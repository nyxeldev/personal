"use client";

import useInView from "./useInView";

/** Word entrances retain readable server-rendered text until hydration. */
export default function SplitText({
  text,
  as: Tag = "span",
  delay = 0,
  stagger = 42,
  className = "",
}) {
  const [ref, inView, armed] = useInView({ threshold: 0.3 });
  const words = String(text).split(" ");

  return (
    <Tag ref={ref} className={`split ${armed ? "is-armed" : ""} ${inView ? "is-in" : ""} ${className}`.trim()}>
      {words.map((word, i) => (
        <span className="split__line" key={`${word}-${i}`}>
          <span
            className="split__word"
            style={{ "--word-delay": `${delay + i * stagger}ms` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
