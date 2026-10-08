"use client";

import useInView from "./useInView";

/**
 * Matnni so'zlarga bo'lib, pastdan ko'tarib chiqaradi.
 * Har bir so'z overflow-hidden niqob ichida — shunda "line reveal" hissi chiqadi.
 */
export default function SplitText({
  text,
  as: Tag = "span",
  delay = 0,
  stagger = 42,
  className = "",
}) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const words = String(text).split(" ");

  return (
    <Tag ref={ref} className={`split ${inView ? "is-in" : ""} ${className}`.trim()}>
      {words.map((word, i) => (
        <span className="split__line" key={`${word}-${i}`}>
          <span
            className="split__word"
            style={{ "--word-delay": `${delay + i * stagger}ms` }}
          >
            {word}
            {i < words.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
