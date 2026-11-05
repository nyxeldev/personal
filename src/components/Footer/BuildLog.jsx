"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
const CACHE_KEY = `github-snapshot:${SITE.githubHandle}`;
const MAX_AGE = 10 * 60 * 1000;
function timeAgo(iso) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(iso)) / 86400000),
  );
  return days === 0 ? "today" : days === 1 ? "1 day ago" : `${days} days ago`;
}
function eventLabel(event) {
  const action = event.payload?.action;
  if (event.type === "PullRequestEvent")
    return ["opened", "closed", "reopened"].includes(action)
      ? `${action} a PR in`
      : "updated a PR in";
  if (event.type === "IssuesEvent")
    return ["opened", "closed", "reopened"].includes(action)
      ? `${action} an issue in`
      : "updated an issue in";
  return (
    {
      PushEvent: "pushed to",
      CreateEvent: "created in",
      IssueCommentEvent: "commented in",
      ReleaseEvent: "released in",
      ForkEvent: "forked",
      WatchEvent: "starred",
    }[event.type] || "was active in"
  );
}
export default function BuildLog() {
  const [data, setData] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    let cancelled = false;
    let ctrl;
    let timer;
    let observer;
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (
        cached &&
        Date.now() - cached.updatedAt < MAX_AGE &&
        cached.updatedAt <= Date.now() &&
        ((Number.isInteger(cached.repos) && cached.repos >= 0) ||
          (cached.repos === null && cached.lastAt)) &&
        (!cached.lastAt ||
          (Number.isFinite(Date.parse(cached.lastAt)) &&
            /^[\w.-]+\/[\w.-]+$/.test(cached.lastRepo || "") &&
            typeof cached.lastLabel === "string"))
      ) {
        setData(cached);
        return;
      }
    } catch {}
    const load = async () => {
      observer?.disconnect();
      ctrl = new AbortController();
      timer = setTimeout(() => ctrl.abort(), 6000);
      const read = (path) =>
        fetch(`https://api.github.com/users/${SITE.githubHandle}${path}`, {
          signal: ctrl.signal,
        }).then((r) => (r.ok ? r.json() : null));
      const [profile, events] = await Promise.allSettled([
        read(""),
        read("/events/public"),
      ]);
      clearTimeout(timer);
      if (cancelled) return;
      const user = profile.status === "fulfilled" ? profile.value : null;
      const ev =
        events.status === "fulfilled" && Array.isArray(events.value)
          ? events.value[0]
          : null;
      const latest =
        ev &&
        /^[\w.-]+\/[\w.-]+$/.test(ev.repo?.name || "") &&
        Number.isFinite(Date.parse(ev.created_at))
          ? ev
          : null;
      const next = {
        repos: Number.isInteger(user?.public_repos) ? user.public_repos : null,
        lastLabel: latest ? eventLabel(latest) : null,
        lastRepo: latest?.repo.name || null,
        lastAt: latest?.created_at || null,
        updatedAt: Date.now(),
      };
      if (next.repos === null && !next.lastAt) return;
      setData(next);
      // Cache profile-only snapshots too. Failure never produces invented values.
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {}
    };
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) load();
        },
        { rootMargin: "150px" },
      );
      observer.observe(ref.current);
    } else load();
    return () => {
      cancelled = true;
      observer?.disconnect();
      ctrl?.abort();
      clearTimeout(timer);
    };
  }, []);
  return (
    <div ref={ref}>
      {data && (
        <div className="buildlog mono">
          <span className="buildlog__dot" aria-hidden="true" />
          <span>GitHub snapshot</span>
          {data.repos !== null && <span>· {data.repos} public repos</span>}
          {data.lastAt && (
            <>
              <span>·</span>
              <a
                href={`https://github.com/${data.lastRepo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.lastLabel} {data.lastRepo.split("/")[1]}
              </a>
              <time dateTime={data.lastAt}>{timeAgo(data.lastAt)}</time>
            </>
          )}
        </div>
      )}
    </div>
  );
}
