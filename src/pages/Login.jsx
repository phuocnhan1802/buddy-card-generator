import { useState } from "react";
import { useForm } from "react-hook-form";
import config from "../config";
import Button from "../components/Button";
import { getUser } from "../services/googleApi";
import { normalizeDomain } from "../utils/validators";
import { useUserData } from "../hooks/useUserData";

export default function Login() {
  const { startSession } = useUserData();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { domain: "" } });

  async function onSubmit({ domain }) {
    setServerError("");
    const cleanDomain = normalizeDomain(domain);
    try {
      const found = await getUser(cleanDomain);
      if (!found) {
        setServerError("Domain not found.");
        return;
      }
      startSession(found);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-soft p-10 text-center animate-fadeIn">
        <img
          src={config.LOGO_PATH}
          alt=""
          className="h-8 mx-auto mb-8 opacity-90"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <h1 className="font-display font-extrabold text-2xl text-ink mb-2">Welcome to Buddy Card Generator</h1>
        <p className="text-ink-soft text-sm mb-8">Enter your company domain to build your Buddy Card.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="you@company.com"
            autoFocus
            {...register("domain", { required: "Please enter your domain." })}
            className="w-full rounded-sm border border-line px-4 py-3 text-center focus:border-violet transition-colors"
          />
          {(errors.domain || serverError) && (
            <p className="text-sm text-danger">{errors.domain?.message || serverError}</p>
          )}
          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
