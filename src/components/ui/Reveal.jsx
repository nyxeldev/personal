"use client";

import useInView from "./useInView";

/** Scroll entrance; useInView arms motion only after hydration. */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, inView, armed] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${armed ? "is-armed" : ""} ${inView ? "is-in" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
