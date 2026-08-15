export type LeetCodeContest = {
  attended: boolean;
  finishTimeInSeconds: number;
  rating: number;
  ranking: number;
  contest: { title: string; startTime: number };
};

export type LeetCodeActivity = {
  username: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  streak: number;
  totalActiveDays: number;
  submissionCalendar: Record<string, number>;
  contestRating: number | null;
  attendedContests: number;
  badge: string | null;
  contestHistory: LeetCodeContest[];
};

type LeetCodeResponse = {
  data?: {
    matchedUser?: {
      username: string;
      submitStatsGlobal?: { acSubmissionNum?: { difficulty: string; count: number }[] };
      userCalendar?: { streak?: number; totalActiveDays?: number; submissionCalendar?: string };
    } | null;
    userContestRanking?: { attendedContestsCount?: number; rating?: number; badge?: { name?: string } | null } | null;
    userContestRankingHistory?: LeetCodeContest[];
  };
  errors?: { message?: string }[];
};

const query = `query asteruneeActivity($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { streak totalActiveDays submissionCalendar }
  }
  userContestRanking(username: $username) {
    attendedContestsCount rating badge { name }
  }
  userContestRankingHistory(username: $username) {
    attended finishTimeInSeconds rating ranking
    contest { title startTime }
  }
}`;

export async function getLeetCodeActivity(username = "asterunee"): Promise<LeetCodeActivity> {
  const response = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: `https://leetcode.com/u/${username}/`, "User-Agent": "asterunee-blog/1.0" },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 21600 },
    signal: AbortSignal.timeout(6000),
  });
  const data = await response.json() as LeetCodeResponse;
  const user = data.data?.matchedUser;
  if (!response.ok || !user) throw new Error(data.errors?.[0]?.message || "LeetCode profile unavailable");

  const counts = new Map((user.submitStatsGlobal?.acSubmissionNum || []).map((item) => [item.difficulty, item.count]));
  let calendar: Record<string, number> = {};
  try {
    calendar = JSON.parse(user.userCalendar?.submissionCalendar || "{}") as Record<string, number>;
  } catch {
    calendar = {};
  }
  const ranking = data.data?.userContestRanking;
  return {
    username: user.username,
    solved: counts.get("All") || 0,
    easy: counts.get("Easy") || 0,
    medium: counts.get("Medium") || 0,
    hard: counts.get("Hard") || 0,
    streak: user.userCalendar?.streak || 0,
    totalActiveDays: user.userCalendar?.totalActiveDays || 0,
    submissionCalendar: calendar,
    contestRating: typeof ranking?.rating === "number" ? ranking.rating : null,
    attendedContests: ranking?.attendedContestsCount || 0,
    badge: ranking?.badge?.name || null,
    contestHistory: (data.data?.userContestRankingHistory || []).filter((contest) => contest.attended),
  };
}
