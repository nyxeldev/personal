"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * GitHub'ning ochiq, autentifikatsiyasiz API'sidan real ma'lumot oladi —
 * repo soni va oxirgi faoliyat. Hech qanday qiymat o'ylab topilmaydi:
 * so'rov uzilsa yoki muddat tugasa, komponent shunchaki hech narsa
 * chizmaydi (eski yoki soxta raqam ko'rsatishdan ko'ra yaxshiroq).
 *
 * So'rov brauzerning o'zidan — tashrif buyuruvchining IP'si bilan —
 * ketadi, chunki sayt statik eksport, server yo'q. GitHub'ning
 * autentifikatsiyasiz chegarasi (soatiga 60 so'rov) bitta sahifa
 * yuklanishida ikkita so'rov bilan hech qachon yetib bo'lmaydigan son.
 */

const EVENT_LABEL = {
  PushEvent: "pushed to",
  CreateEvent: "created in",
  PullRequestEvent: "opened a PR in",
  IssuesEvent: "opened an issue in",
  IssueCommentEvent: "commented in",
  ReleaseEvent: "released in",
  ForkEvent: "forked",
  WatchEvent: "starred",
};

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export default function BuildLog() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);

    const user = fetch(`https://api.github.com/users/${SITE.githubHandle}`, {
      signal: ctrl.signal,
    }).then((r) => (r.ok ? r.json() : null));

    const events = fetch(`https://api.github.com/users/${SITE.githubHandle}/events/public`, {
      signal: ctrl.signal,
    }).then((r) => (r.ok ? r.json() : null));

    Promise.all([user, events])
      .then(([u, ev]) => {
        if (cancelled || !u) return;

        const latest = Array.isArray(ev) ? ev[0] : null;

        setData({
          repos: u.public_repos,
          lastLabel: latest ? EVENT_LABEL[latest.type] || "active in" : null,
          lastRepo: latest ? latest.repo.name.split("/")[1] : null,
          lastRepoUrl: latest ? `https://github.com/${latest.repo.name}` : null,
          lastAt: latest ? latest.created_at : null,
        });
      })
      .catch(() => {
        // tarmoq xatosi, timeout yoki rate limit — jim turamiz
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, []);

  if (!data) return null;

  return (
    <div className="buildlog mono">
      <span className="buildlog__dot" aria-hidden="true" />
      <span>{data.repos} public repos on GitHub</span>
      {data.lastAt && (
        <>
          <span className="buildlog__sep" aria-hidden="true">
            ·
          </span>
          <a href={data.lastRepoUrl} target="_blank" rel="noopener noreferrer">
            {data.lastLabel} {data.lastRepo}
          </a>
          <span className="buildlog__time">{timeAgo(data.lastAt)}</span>
        </>
      )}
    </div>
  );
}
