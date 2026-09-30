export function SectionEyebrow({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <p className="eyebrow">
      {number && <span className="eyebrow-number">{number}</span>}
      {children}
    </p>
  );
}
