import type { SVGProps } from "react";

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}

export function BowlIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 33h44c-1 13-9 20-22 20S11 46 10 33ZM24 55h16M8 30h48M23 23c-6-6 5-8 0-15M33 23c-6-6 5-8 0-15M43 23c-6-6 5-8 0-15" />
    </svg>
  );
}
