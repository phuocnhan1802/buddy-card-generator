import StepHeader from "./StepHeader";

/**
 * The shared two-panel shell used by Step 1, 2, and 3.
 * Left panel scrolls independently; the preview panel stays
 * pinned so the card is always visible while editing.
 */
export default function Layout({ stepNumber, formPanel, previewPanel }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col overflow-x-hidden">
      <StepHeader current={stepNumber} />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* LEFT — form */}
        <div className="thin-scroll overflow-y-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-16 lg:py-14">
          <div className="max-w-xl mx-auto animate-fadeIn">{formPanel}</div>
        </div>

        {/* RIGHT — live preview, sticky on desktop so it never scrolls away.
            On mobile it sits below the form (per design review) and simply
            flows with the page — no sticky/fixed positioning there. */}
        <div className="bg-white lg:border-l border-line flex items-start justify-center px-4 py-8 sm:px-6 sm:py-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-auto thin-scroll">
          <div className="animate-fadeIn my-auto">{previewPanel}</div>
        </div>
      </div>
    </div>
  );
}
