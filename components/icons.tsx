import type { SVGProps } from "react";
export function Icon({
  name = "arrow",
  ...props
}: SVGProps<SVGSVGElement> & {
  name?:
    | "arrow"
    | "diagonal"
    | "plus"
    | "close"
    | "menu"
    | "bookmark"
    | "check"
    | "grid"
    | "list"
    | "search"
    | "download"
    | "share"
    | "chevron"
    | "minus";
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    diagonal: <path d="M5 19 19 5M5 5h14v14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 8h16M4 16h16" />,
    bookmark: <path d="M6 4h12v17l-6-4-6 4Z" />,
    check: <path d="m4 12 5 5L20 6" />,
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" />
        <rect x="14" y="4" width="6" height="6" />
        <rect x="4" y="14" width="6" height="6" />
        <rect x="14" y="14" width="6" height="6" />
      </>
    ),
    list: <path d="M8 5h12M8 12h12M8 19h12M3 5h1M3 12h1M3 19h1" />,
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    download: <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />,
    share: (
      <>
        <path d="M12 16V3m-5 5 5-5 5 5M5 12H3v9h18v-9h-2" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
  };
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
export function SectionMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
      <path
        d="M4 27h12L29 5M4 32h16L33 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
