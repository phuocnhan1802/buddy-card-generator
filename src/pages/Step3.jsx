import { useEffect, useRef, useState } from "react";
import config from "../config";
import Layout from "../components/Layout";
import BuddyPreview from "../components/BuddyPreview";
import Button from "../components/Button";
import { useUserData } from "../hooks/useUserData";
import { getUser, saveMatch } from "../services/googleApi";
import { downloadBuddyTeam } from "../services/renderService";
import { normalizeDomain } from "../utils/validators";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

export default function Step3() {
  const { user, setStep } = useUserData();
  const [domainA, setDomainA] = useState("");
  const [domainB, setDomainB] = useState("");
  const [buddyA, setBuddyA] = useState(null);
  const [buddyB, setBuddyB] = useState(null);
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [matchWarning, setMatchWarning] = useState("");
  const teamRef = useRef(null);
  const teamScale = useResponsiveScale(config.BUDDY_CARD_PREVIEW_WIDTH);

  const validationError = useValidation({ domainA, domainB, buddyA, buddyB, currentDomain: user.domain });

  function handleGeneratePreview() {
    setError("");
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!buddyA || !buddyB) {
      setError("Please select two valid buddies first.");
      return;
    }
    setPreviewGenerated(true);
  }

  async function handleDownload() {
    setDownloading(true);
    setError("");
    setMatchWarning("");
    try {
      // Record the match in the Sheet only at download time (per request),
      // so casually generating a preview doesn't write anything yet.
      const matchSaved = await saveMatch({ domain: user.domain, buddy1: buddyA.domain, buddy2: buddyB.domain });
      if (!matchSaved) {
        setMatchWarning(
          'Card downloaded, but the match wasn\'t recorded in the Sheet — make sure it has "Buddy 1" and "Buddy 2" columns.'
        );
      }
      await downloadBuddyTeam(teamRef.current, [buddyA.name, user.name, buddyB.name]);
    } catch (err) {
      setError(err.message || "Could not download the Buddy Team card.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Layout
      stepNumber={3}
      formPanel={
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet mb-1">Step 3 of 3</p>
            <h1 className="font-display font-extrabold text-3xl text-ink">Buddy Match</h1>
            <p className="text-ink-soft mt-2">Enter your two buddies' domains to generate your team card.</p>
          </div>

          <BuddyDomainField label="Buddy 1" domain={domainA} setDomain={setDomainA} buddy={buddyA} setBuddy={setBuddyA} />
          <BuddyDomainField label="Buddy 2" domain={domainB} setDomain={setDomainB} buddy={buddyB} setBuddy={setBuddyB} />

          {error && <p className="text-sm text-danger">{error}</p>}
          {matchWarning && <p className="text-sm text-coral-dark">{matchWarning}</p>}

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setStep("step2")}>
              Back
            </Button>
            <Button variant="violet" onClick={handleGeneratePreview}>
              Generate Preview
            </Button>
            {previewGenerated && (
              <Button onClick={handleDownload} loading={downloading} className="ml-auto">
                Share / Save Buddy Team
              </Button>
            )}
          </div>
        </div>
      }
      previewPanel={
        previewGenerated ? (
          <BuddyPreview ref={teamRef} members={[buddyA, user, buddyB]} scale={teamScale} />
        ) : (
          <div
            style={{
              width: config.BUDDY_CARD_PREVIEW_WIDTH * teamScale,
              height: config.BUDDY_CARD_PREVIEW_HEIGHT * teamScale,
            }}
            className="rounded-lg border-2 border-dashed border-line flex items-center justify-center text-center px-8"
          >
            <p className="text-ink-soft text-sm">
              Select two buddies and click <span className="font-semibold">Generate Preview</span> to see your Buddy
              Team card ({config.BUDDY_EXPORT_WIDTH}×{config.BUDDY_EXPORT_HEIGHT}px export).
            </p>
          </div>
        )
      }
    />
  );
}

/** One "Buddy N" domain input with live search-as-you-type lookup. */
function BuddyDomainField({ label, domain, setDomain, buddy, setBuddy }) {
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const debouncedDomain = useDebouncedValue(domain, 400);

  useEffect(() => {
    const clean = normalizeDomain(debouncedDomain || "");
    if (!clean) {
      setBuddy(null);
      setNotFound(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setNotFound(false);
    getUser(clean)
      .then((found) => {
        if (cancelled) return;
        setBuddy(found);
        setNotFound(!found);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDomain]);

  return (
    <div>
      <label className="font-semibold text-ink text-sm mb-2 block">{label}</label>
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="nhanltp"
        className="w-full rounded-sm border border-line px-4 py-2.5 text-base md:text-sm focus:border-violet"
      />
      <div className="mt-1.5 h-5 text-sm">
        {searching && <span className="text-ink-soft">Searching…</span>}
        {!searching && buddy && <span className="text-success font-medium">✓ {buddy.name}</span>}
        {!searching && notFound && domain && <span className="text-danger">Domain not found.</span>}
      </div>
    </div>
  );
}

/** Cross-field validation: no self-select, no duplicate buddy domains. */
function useValidation({ domainA, domainB, buddyA, buddyB, currentDomain }) {
  const a = normalizeDomain(domainA || "");
  const b = normalizeDomain(domainB || "");
  const me = normalizeDomain(currentDomain || "");

  if (a && a === me) return "You can't choose yourself as Buddy 1.";
  if (b && b === me) return "You can't choose yourself as Buddy 2.";
  if (a && b && a === b) return "Buddy 1 and Buddy 2 can't be the same person.";
  if (domainA && buddyA === null) return null; // handled by inline "not found" state
  return null;
}
