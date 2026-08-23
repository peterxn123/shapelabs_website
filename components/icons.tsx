export function ArrowDown({
  className,
  strokeWidth = 1.25,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 4v15" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  );
}

export function ArrowRight({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </svg>
  );
}

export function GlobeTile() {
  return (
    <span className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#23262d_0%,#14161a_100%)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d7dae0"
        strokeWidth="1.4"
        className="h-[42%] w-[42%]"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4.1" ry="9" />
        <path d="M3.6 9.1h16.8" />
        <path d="M3.6 14.9h16.8" />
      </svg>
    </span>
  );
}
