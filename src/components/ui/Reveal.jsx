"use client";

import useInView from "./useInView";

/** Scroll bilan ochiladigan o'rama. */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
