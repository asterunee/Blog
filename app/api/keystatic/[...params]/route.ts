import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystaticConfig, { keystaticGithubMode } from "@/keystatic.config";
const unavailable = () => Response.json({ error: "GitHub content storage is not configured." }, { status: 503 });
export const { GET, POST } = process.env.NODE_ENV === "production" && !keystaticGithubMode ? { GET: unavailable, POST: unavailable } : makeRouteHandler({ config: keystaticConfig });
