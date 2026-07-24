import { useRef, useState } from "react";
import config from "../config";
import Layout from "../components/Layout";
import CardPreview from "../components/CardPreview";
import Button from "../components/Button";
import { useUserData } from "../hooks/useUserData";
import { saveUser } from "../services/googleApi";
import { downloadPersonalCard } from "../services/renderService";
import { useResponsiveScale } from "../hooks/useResponsiveScale";

export default function Step2() {
  const { user, updateUser, setStep } = useUserData();
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const cardScale = useResponsiveScale(config.CARD_PREVIEW_WIDTH);

  async function handleDownload() {
    setError("");
    setDownloading(true);
    try {
      await saveUser(user); // keep the Sheet in sync before exporting
      await downloadPersonalCard(cardRef.current, user.name);
    } catch (err) {
      setError(err.message || "Could not download your card. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Layout
      stepNumber={2}
      formPanel={
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet mb-1">Step 2 of 3</p>
            <h1 className="font-display font-extrabold text-3xl text-ink">Complete Your Card</h1>
            <p className="text-ink-soft mt-2">Tell your buddy what you bring, and what you're hoping for.</p>
          </div>

          <Field label="I can help with">
            <textarea
              value={user.contribute}
              onChange={(e) => updateUser({ contribute: e.target.value })}
              rows={4}
              placeholder="e.g. Feedback on presentations, career planning, product strategy..."
              className="w-full rounded-sm border border-line px-4 py-2.5 text-base md:text-sm focus:border-violet resize-none"
            />
          </Field>

          <Field label="I'm looking for">
            <textarea
              value={user.need}
              onChange={(e) => updateUser({ need: e.target.value })}
              rows={4}
              placeholder="e.g. An accountability partner, more visibility, honest feedback..."
              className="w-full rounded-sm border border-line px-4 py-2.5 text-base md:text-sm focus:border-violet resize-none"
            />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => setStep("step1")}>
              Back
            </Button>
            <Button onClick={handleDownload} loading={downloading} size="lg">
              Share / Save Card
            </Button>
            <Button variant="violet" onClick={() => setStep("step3")} className="sm:ml-auto">
              Buddy Match →
            </Button>
          </div>
        </div>
      }
      previewPanel={<CardPreview ref={cardRef} user={user} scale={cardScale} />}
    />
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="font-semibold text-ink text-sm mb-2 block">{label}</label>
      {children}
    </div>
  );
}
