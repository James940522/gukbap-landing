// Trigger after content clears the viewport edge. A pixel inset also works for
// sections taller than the screen, where a visibility ratio may never be met.
export const revealViewport = {
  once: true,
  amount: "some",
  margin: "0px 0px -160px 0px",
} as const;
