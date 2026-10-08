"use client";

import { useState } from "react";
import { ArrowRight, Mail, Send, Github, Linkedin } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import "./contact.css";

// Xat shu manzilga tushadi.
const INBOX = "imhamidovic@gmail.com";

// FormSubmit — OAuth yo'q, demak EmailJS'dagidek "token muddati tugadi"
// holati ham yo'q. Statik eksport uchun mos: faqat POST qilinadi.
const ENDPOINT = `https://formsubmit.co/ajax/${INBOX}`;

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "imhamidovic@gmail.com",
    href: "mailto:imhamidovic@gmail.com",
  },
  { icon: Send, label: "Telegram", value: "@nyxeldev", href: "https://t.me/nyxeldev" },
  { icon: Github, label: "GitHub", value: "nyxeldev", href: "https://github.com/nyxeldev" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "iamhamidov",
    href: "https://www.linkedin.com/in/iamhamidov/",
  },
];

const EMPTY = { name: "", email: "", phone: "", message: "" };

// botlar to'ldiradigan ko'rinmas maydon
const HONEY = "company_website";

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [trap, setTrap] = useState("");

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Your name, please.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "That address looks off.";
    if (form.message.trim().length < 10) next.message = "A little more context helps.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;

    // honeypot to'lgan bo'lsa — bu bot, jim chiqamiz
    if (trap) {
      setStatus({ type: "ok", text: "Sent. I’ll get back to you shortly." });
      setForm(EMPTY);
      return;
    }

    if (!validate()) return;

    setSending(true);
    setStatus({ type: "info", text: "Sending…" });

    // XSS oldini olish uchun ma'lumotlarni tozalash
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.replace(/[<>]/g, "")])
    );

    // Yuborish uzilsa yozilgan matn yo'qolmasin: pochta ilovasi to'ldirilgan
    // holda ochiladi, odam faqat "Send" bosadi.
    const failed = () => {
      const subject = encodeURIComponent(`Portfolio — ${clean.name}`);
      const lines = [clean.message, "", `— ${clean.name}`, clean.email];
      if (clean.phone) lines.push(clean.phone);
      const body = encodeURIComponent(lines.join("\n"));

      setStatus({
        type: "err",
        text: "That didn’t send. Your message is safe — open it in your mail app:",
        mailto: `mailto:${INBOX}?subject=${subject}&body=${body}`,
        mailtoLabel: `Email it to ${INBOX}`,
      });
      setSending(false);
    };

    // FormData bilan yuboramiz: JSON Content-Type CORS preflight chaqiradi,
    // multipart esa "simple request" — qo'shimcha OPTIONS so'rovi bo'lmaydi.
    const body = new FormData();
    Object.entries(clean).forEach(([k, v]) => body.append(k, v));
    body.append("_subject", `Portfolio — ${clean.name}`);
    body.append("_template", "table");
    body.append("_captcha", "false");
    // FormSubmit'ning o'z honeypot maydoni — serverda ham filtrlanadi
    body.append("_honey", "");

    // javob kelmasa ham forma "Sending…" da qotib qolmasin
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
        signal: ctrl.signal,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && String(data.success) === "true") {
        setStatus({ type: "ok", text: "Sent. I’ll get back to you shortly." });
        setForm(EMPTY);
        setSending(false);
      } else {
        failed();
      }
    } catch {
      failed();
    } finally {
      clearTimeout(timer);
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="shell">
        <Reveal className="sec-label">
          <span className="sec-label__num">06</span>
          <span>Contact</span>
          <span className="sec-label__bar" />
        </Reveal>

        <h2 className="contact__head">
          <SplitText text="Let’s build something" as="span" />
          <SplitText text="that holds up." as="span" delay={120} className="contact__head-dim" />
        </h2>

        <div className="contact__grid">
          {/* ---------- forma ---------- */}
          <Reveal className="cform" delay={120}>
            <form onSubmit={submit} noValidate>
              <div className="cform__row">
                <label className="field">
                  <span className="field__label mono">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Jane Doe"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <span className="field__err">{errors.name}</span>}
                </label>

                <label className="field">
                  <span className="field__label mono">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    placeholder="jane@company.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <span className="field__err">{errors.email}</span>}
                </label>
              </div>

              <label className="field">
                <span className="field__label mono">Phone — optional</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={update}
                  placeholder="+998 ..."
                />
              </label>

              {/* honeypot — ekranda ham, skrinriderda ham ko'rinmaydi */}
              <div className="honey" aria-hidden="true">
                <label htmlFor={HONEY}>Company website</label>
                <input
                  id={HONEY}
                  name={HONEY}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={trap}
                  onChange={(e) => setTrap(e.target.value)}
                />
              </div>

              <label className="field">
                <span className="field__label mono">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={update}
                  placeholder="What are you building?"
                  aria-invalid={!!errors.message}
                />
                {errors.message && <span className="field__err">{errors.message}</span>}
              </label>

              <div className="cform__foot">
                <Magnetic strength={0.22}>
                  <button type="submit" className="btn btn--primary" disabled={sending}>
                    {sending ? "Sending…" : "Send message"}
                    <ArrowRight size={16} strokeWidth={2} className="btn__arrow" />
                  </button>
                </Magnetic>

                {status && (
                  <p className={`cform__status is-${status.type}`} role="status">
                    {status.text}
                    {status.mailto && (
                      <>
                        {" "}
                        <a href={status.mailto}>{status.mailtoLabel}</a>
                      </>
                    )}
                  </p>
                )}
              </div>
            </form>
          </Reveal>

          {/* ---------- to'g'ridan-to'g'ri aloqa ---------- */}
          <div className="channels">
            {CHANNELS.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} delay={140 + i * 70}>
                  <a
                    className="channel"
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <span className="channel__icon">
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    <span className="channel__text">
                      <span className="channel__label mono">{c.label}</span>
                      <span className="channel__value">{c.value}</span>
                    </span>
                    <ArrowRight size={15} strokeWidth={1.8} className="channel__arrow" />
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
