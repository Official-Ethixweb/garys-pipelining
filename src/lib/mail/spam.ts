import type { LeadPayloadInput } from "./lead-schema";

// Cheap, dependency-free heuristics that run after schema validation and the
// honeypot check. Not a substitute for a real spam service, just enough to
// blunt the generic link-drop bots that will inevitably find a public POST
// endpoint. Matches are treated as spam by the API route, which responds with
// success anyway so bots get no signal they were filtered.
const URL_PATTERN = /https?:\/\/\S+|(?:^|\s)www\.\S+/gi;
const MAX_URLS = 3;

export function looksLikeSpam(data: Pick<LeadPayloadInput, "name" | "fields" | "transcript">): boolean {
  const haystack = [
    data.name,
    ...data.fields.map((f) => f.value),
    ...(data.transcript ?? []).map((m) => m.text),
  ].join("\n");

  const urlMatches = haystack.match(URL_PATTERN);
  if (urlMatches && urlMatches.length > MAX_URLS) return true;

  return false;
}
