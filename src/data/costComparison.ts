// Copy and displayed figures supplied in the client's cost-ratio reference image.
// TODO: Add the underlying calculation period and comparison source when provided.
export const costComparison = [
  {
    id: "ddukson",
    label: "뚝손국밥",
    value: "30%",
    qualifier: "초반",
    // Match the reference's approximate visual proportion. This is not an exact 32% claim.
    relativeWidth: "80%",
    featured: true,
  },
  {
    id: "industry",
    label: "업계 평균",
    value: "40%",
    qualifier: "",
    relativeWidth: "100%",
    featured: false,
  },
] as const;
