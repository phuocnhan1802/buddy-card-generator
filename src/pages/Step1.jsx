import { useState } from "react";
import config from "../config";
import Layout from "../components/Layout";
import CardPreview from "../components/CardPreview";
import AvatarUploader from "../components/AvatarUploader";
import InterestTags from "../components/InterestTags";
import RitualEditor from "../components/RitualEditor";
import Button from "../components/Button";
import { useUserData } from "../hooks/useUserData";
import { saveUser } from "../services/googleApi";

export default function Step1() {
  const { user, updateUser, setStep } = useUserData();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const hasMinRituals = (user.rituals?.length || 0) >= config.REQUIRED_RITUAL_COUNT;

  async function handleSaveAndContinue() {
    setError("");
    if (!hasMinRituals) {
      setError(`Please add at least ${config.REQUIRED_RITUAL_COUNT} rituals before continuing.`);
      return;
    }
    setSaving(true);
    try {
      await saveUser(user);
      setSaved(true);
      setStep("step2");
    } catch (err) {
      setError(err.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      stepNumber={1}
      formPanel={
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet mb-1">Step 1 of 3</p>
            <h1 className="font-display font-extrabold text-3xl text-ink">Build Your Card</h1>
            <p className="text-ink-soft mt-2">
              Add a photo, your interests, and the rituals you'd like your buddy to know about you.
            </p>
          </div>

          <Field label="Photo">
            <AvatarUploader value={user.avatar} onChange={(avatar) => updateUser({ avatar })} />
          </Field>

          <Field label="Name">
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full rounded-sm border border-line bg-canvas px-4 py-2.5 text-ink-soft cursor-not-allowed"
            />
          </Field>

          <Field label="Interests" hint="Add as many as you like">
            <InterestTags value={user.interests} onChange={(interests) => updateUser({ interests })} />
          </Field>

          <Field label="My Rituals" hint={`Minimum ${config.REQUIRED_RITUAL_COUNT}, drag to reorder`}>
            <RitualEditor value={user.rituals} onChange={(rituals) => updateUser({ rituals })} />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}
          {saved && !error && <p className="text-sm text-success">Saved!</p>}

          <Button onClick={handleSaveAndContinue} loading={saving} size="lg" className="self-start">
            Save &amp; Continue
          </Button>
        </div>
      }
      previewPanel={<CardPreview user={user} />}
    />
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="font-semibold text-ink text-sm">{label}</label>
        {hint && <span className="text-xs text-ink-soft">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
