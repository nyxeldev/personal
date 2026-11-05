"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mail, Github, Linkedin, Send } from "lucide-react";
import { SITE } from "@/lib/site";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import "./contact.css";

const EMPTY = { name: "", email: "", phone: "", message: "" };
const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: Github,
    label: "GitHub",
    value: SITE.githubHandle,
    href: SITE.github,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "iamhamidov",
    href: SITE.linkedin,
  },
  { icon: Send, label: "Telegram", value: "@nyxeldev", href: SITE.telegram },
];
function Field({
  name,
  label,
  form,
  update,
  errors,
  type = "text",
  autoComplete,
  maxLength,
  placeholder,
  multiline = false,
  required = false,
}) {
  const props = {
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange: update,
    required,
    maxLength,
    placeholder,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  };
  return (
    <div className="field">
      <label className="field__label mono" htmlFor={props.id}>
        {label}
      </label>
      {multiline ? (
        <textarea {...props} rows={5} />
      ) : (
        <input {...props} type={type} autoComplete={autoComplete} />
      )}
      {errors[name] && (
        <span id={`error-${name}`} className="field__err">
          {errors[name]}
        </span>
      )}
    </div>
  );
}
export default function Contact() {
  const [form, setForm] = useState(EMPTY),
    [errors, setErrors] = useState({}),
    [status, setStatus] = useState(null),
    [sending, setSending] = useState(false),
    [trap, setTrap] = useState(""),
    [ready, setReady] = useState(false);
  const formRef = useRef(null),
    controller = useRef(null);
  useEffect(() => {
    setReady(true);
    return () => controller.current?.abort();
  }, []);
  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };
  const submit = async (e) => {
    e.preventDefault();
    if (sending || !ready) return;
    if (trap) return;
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10)
      next.message = "Enter at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus({ type: "err", text: "Please check the highlighted fields." });
      formRef.current.elements.namedItem(Object.keys(next)[0])?.focus();
      return;
    }
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()]),
    );
    setSending(true);
    setStatus({ type: "info", text: "Sending…" });
    const body = new FormData();
    Object.entries(clean).forEach(([k, v]) => body.append(k, v));
    body.append("_subject", `Portfolio — ${clean.name}`);
    body.append("_template", "table");
    body.append("_honey", trap);
    // This static site relies on FormSubmit's server-side filtering. Client-side
    // validation and the honeypot improve UX; they are not abuse-proof controls.
    body.append("_captcha", "false");
    const ctrl = new AbortController();
    controller.current = ctrl;
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${SITE.email}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== "true")
        throw new Error("Not accepted");
      setForm(EMPTY);
      setStatus({
        type: "ok",
        text: "Your message was accepted. Thank you for getting in touch.",
      });
    } catch {
      const subject = encodeURIComponent(`Portfolio — ${clean.name}`),
        message = encodeURIComponent(
          [clean.message, "", clean.name, clean.email, clean.phone]
            .filter(Boolean)
            .join("\n"),
        );
      setStatus({
        type: "err",
        text: "Could not send. Your message is still here.",
        mailto: `mailto:${SITE.email}?subject=${subject}&body=${message}`,
      });
    } finally {
      clearTimeout(timer);
      controller.current = null;
      setSending(false);
    }
  };
  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="shell">
        <div className="sec-label">
          <span className="sec-label__num">07</span>
          <span>Contact</span>
          <span className="sec-label__bar" />
        </div>
        <h2 className="contact__head" id="contact-title">
          <SplitText text="Have a role or project in mind?" as="span" />
        </h2>
        <Reveal as="p" className="contact__intro" delay={160}>
          Email is the simplest way to reach me. You can also view my résumé or
          send a message below.
        </Reveal>
        <div className="contact__grid">
          <div className="channels">
            <div className="contact__invitation">
              <span className="mono">Let’s start a conversation</span>
              <p>Full-stack &amp; backend opportunities.<br />Based in Tashkent. Open to remote work.</p>
              <a href={`mailto:${SITE.email}`} className="contact__email">{SITE.email}<ArrowRight size={20} /></a>
            </div>
            {CHANNELS.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal
                  as="a"
                  key={c.label}
                  className="channel"
                  delay={220 + i * 60}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    c.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <span className="channel__icon">
                    <Icon size={16} />
                  </span>
                  <span className="channel__text">
                    <span className="channel__label mono">{c.label}</span>
                    <span className="channel__value">{c.value}</span>
                  </span>
                  <ArrowRight size={15} className="channel__arrow" />
                </Reveal>
              );
            })}
            <div className="contact__resume">
              <a
                className="worklink"
                href="/files/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View résumé ↗
              </a>
              <a
                className="worklink"
                href="/files/Resume.pdf"
                download="Jahongir-Hamidov-Resume.pdf"
              >
                Download PDF ↓
              </a>
            </div>
          </div>
          <Reveal className="cform" delay={240}>
            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              aria-busy={sending}
            >
              <fieldset disabled={!ready || sending}>
                <legend className="mono">Send a message</legend>
                <div className="cform__row">
                  <Field
                    name="name"
                    label="Name"
                    form={form}
                    update={update}
                    errors={errors}
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                  <Field
                    name="email"
                    label="Email"
                    form={form}
                    update={update}
                    errors={errors}
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
                <Field
                  name="phone"
                  label="Phone — optional"
                  form={form}
                  update={update}
                  errors={errors}
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                />
                <div className="honey" aria-hidden="true">
                  <label htmlFor="company-website">Company website</label>
                  <input
                    id="company-website"
                    name="company_website"
                    value={trap}
                    onChange={(e) => setTrap(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <Field
                  name="message"
                  label="Message"
                  form={form}
                  update={update}
                  errors={errors}
                  multiline
                  maxLength={5000}
                  required
                />
                <button type="submit" className="btn btn--primary">
                  {sending ? "Sending…" : "Send message"}
                  <ArrowRight size={16} />
                </button>
              </fieldset>
              <p className="cform__privacy">
                The form uses FormSubmit to deliver your message. Please avoid
                sending confidential information.
              </p>
              <noscript>
                <p>Email me directly; the form requires JavaScript.</p>
              </noscript>
              {status && (
                <p
                  className={`cform__status is-${status.type}`}
                  role={status.type === "err" ? "alert" : "status"}
                >
                  {status.text}
                  {status.mailto && (
                    <>
                      {" "}
                      <a href={status.mailto}>
                        Open your message in your email app
                      </a>
                    </>
                  )}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
