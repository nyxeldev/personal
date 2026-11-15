import NotFoundBody from "@/components/NotFound/NotFoundBody";
import "./not-found.css";

export const metadata = {
  title: "404 — NYXELDEV",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundBody />;
}
