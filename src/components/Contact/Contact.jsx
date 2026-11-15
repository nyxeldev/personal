"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Github, Linkedin, Send } from "lucide-react";
import { SITE } from "@/lib/site";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import useLanguage from "@/hooks/useLanguage";
import "./contact.css";

const EMPTY = { name: "", email: "", message: "" };
const CHANNEL_META = [
  { icon: Github, key: "github", value: SITE.githubHandle, href: SITE.github },
  { icon: Linkedin, key: "linkedin", value: "iamhamidov", href: SITE.linkedin },
  { icon: Send, key: "telegram", value: "@nyxeldev", href: SITE.telegram },
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
  const { t } = useLanguage();
  const strings = t("contact.form");
  const channelLabels = t("contact.channels");
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
    if (!form.name.trim()) next.name = strings.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = strings.errors.email;
    if (form.message.trim().length < 10)
      next.message = strings.errors.message;
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus({ type: "err", text: strings.errors.checkFields });
      formRef.current.elements.namedItem(Object.keys(next)[0])?.focus();
      return;
    }
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()]),
    );
    setSending(true);
    setStatus({ type: "info", text: strings.sending });
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
        text: strings.status.ok,
      });
    } catch {
      const subject = encodeURIComponent(`Portfolio — ${clean.name}`),
        message = encodeURIComponent(
          [clean.message, "", clean.name, clean.email]
            .filter(Boolean)
            .join("\n"),
        );
      setStatus({
        type: "err",
        text: strings.status.err,
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
          <span>{t("contact.sectionLabel")}</span>
          <span className="sec-label__bar" />
        </div>
        <h2 className="contact__head" id="contact-title">
          <SplitText text={t("contact.heading")} as="span" />
        </h2>
        <Reveal as="p" className="contact__intro" delay={160}>
          {t("contact.intro")}
        </Reveal>
        <div className="contact__grid">
          <div className="channels">
            <div className="contact__invitation">
              <span className="mono">{t("contact.invitation")}</span>
              <p>
                {t("contact.invitationBody1")}
                <br />
                {t("contact.invitationBody2")}
              </p>
              <a href={`mailto:${SITE.email}`} className="contact__email">
                {SITE.email}
                <ArrowRight size={20} />
              </a>
            </div>
            {CHANNEL_META.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal
                  as="a"
                  key={c.key}
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
                    <span className="channel__label mono">{channelLabels[c.key]}</span>
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
                {t("contact.viewResume")}
              </a>
              <a
                className="worklink"
                href="/files/Resume.pdf"
                download="NYXELDEV-Resume.pdf"
              >
                {t("contact.downloadPdf")}
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
                <legend className="mono">{strings.legend}</legend>
                <div className="cform__row">
                  <Field
                    name="name"
                    label={strings.name}
                    form={form}
                    update={update}
                    errors={errors}
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                  <Field
                    name="email"
                    label={strings.email}
                    form={form}
                    update={update}
                    errors={errors}
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
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
                  label={strings.message}
                  form={form}
                  update={update}
                  errors={errors}
                  multiline
                  maxLength={5000}
                  required
                />
                <button type="submit" className="btn btn--primary">
                  {sending ? strings.sending : strings.send}
                  <ArrowRight size={16} />
                </button>
              </fieldset>
              <p className="cform__privacy">{strings.privacy}</p>
              <noscript>
                <p>{strings.noscript}</p>
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
                      <a href={status.mailto}>{strings.openInEmailApp}</a>
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
