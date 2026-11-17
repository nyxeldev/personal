"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import useLanguage from "@/hooks/useLanguage";
const CACHE_KEY = `github-snapshot:${SITE.githubHandle}`;
const MAX_AGE = 10 * 60 * 1000;
function timeAgo(iso, strings) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(iso)) / 86400000),
  );
  return days === 0
    ? strings.today
    : days === 1
      ? strings.oneDayAgo
      : `${days} ${strings.daysAgo}`;
}
export default function BuildLog() {
  const { t } = useLanguage();
  const strings = t("footer.buildLog");
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
        (!cached.lastAt || Number.isFinite(Date.parse(cached.lastAt)))
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
      const lastAt =
        ev && Number.isFinite(Date.parse(ev.created_at)) ? ev.created_at : null;
      const next = {
        repos: Number.isInteger(user?.public_repos) ? user.public_repos : null,
        lastAt,
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
          <span>{strings.snapshot}</span>
          {data.repos !== null && (
            <span>
              · {data.repos} {strings.publicRepos}
            </span>
          )}
          {data.lastAt && (
            <span>
              · {strings.lastActivity}{" "}
              <time dateTime={data.lastAt}>{timeAgo(data.lastAt, strings)}</time>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
