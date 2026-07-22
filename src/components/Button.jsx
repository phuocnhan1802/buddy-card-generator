export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-coral text-white hover:bg-coral-dark shadow-soft hover:shadow-lifted active:scale-[0.98]",
    secondary: "bg-white text-ink border border-line hover:border-ink/30 active:scale-[0.98]",
    violet: "bg-violet text-white hover:bg-violet-dark shadow-soft hover:shadow-lifted active:scale-[0.98]",
    ghost: "bg-transparent text-ink-soft hover:bg-line/60",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-7 py-3.5",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...rest}>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
