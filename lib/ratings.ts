export type RatingJudge = "Codeforces" | "AtCoder";

export function getRatingTitle(judge: RatingJudge, rating: number) {
  if (judge === "Codeforces") {
    if (rating < 1200) return "Newbie";
    if (rating < 1400) return "Pupil";
    if (rating < 1600) return "Specialist";
    if (rating < 1900) return "Expert";
    if (rating < 2100) return "Candidate Master";
    if (rating < 2300) return "Master";
    if (rating < 2400) return "International Master";
    if (rating < 2600) return "Grandmaster";
    if (rating < 3000) return "International Grandmaster";
    return "Legendary Grandmaster";
  }

  if (rating < 400) return "Gray";
  if (rating < 800) return "Brown";
  if (rating < 1200) return "Green";
  if (rating < 1600) return "Cyan";
  if (rating < 2000) return "Blue";
  if (rating < 2400) return "Yellow";
  if (rating < 2800) return "Orange";
  return "Red";
}
