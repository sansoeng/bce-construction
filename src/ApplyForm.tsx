import { useState } from "react";
import ArrowButton from "./ArrowButton";
import { Turnstile } from "./turnstile";
import { submitLead, LEAD_FILE_ACCEPT, describeFileProblem, formatFileSize } from "./leads";
import { siteSettings } from "./siteSettings";

// In-page application form for a vacancy: name, contact, a short note and a CV. The CV is stored under `leads/…` in
// R2 (private) with the lead, and HR gets the same Telegram/email alert as a quotation request. The mailto links on
// the page stay as the no-JS fallback.

const fieldClass = "qf-input";

export default function ApplyForm({ role }: { role: string }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [cv, setCv] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [token, setToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [invalid, setInvalid] = useState<string[]>([]);

  const set = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setInvalid((prev) => prev.filter((x) => x !== key));
  };

  // Bring a failed submit back to the first unanswered field, clear of the fixed header.
  const scrollToField = (el: HTMLElement | null) => {
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } | null }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -140 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
  };

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!siteSettings.features.leadsEnabled) return setError("Online applications are paused. Please email HR directly.");
    const missing: string[] = [];
    if (!form.name?.trim()) missing.push("name");
    if (!form.email?.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) missing.push("email");
    setInvalid(missing);
    if (missing.length) {
      setError("");
      requestAnimationFrame(() => {
        const input = document.getElementById(`apply-${missing[0]}`);
        scrollToField(input?.closest<HTMLElement>(".qf-field") ?? null);
        input?.focus({ preventScroll: true });
      });
      return;
    }
    const problem = cv ? describeFileProblem([cv]) : "";
    if (problem) return setError(problem);
    if (!token) return setError("Please complete the security check before sending.");

    setError("");
    setSending(true);
    try {
      await submitLead({
        kind: "careers",
        name: form.name,
        email: form.email,
        phone: form.phone,
        role,
        message: form.message,
        turnstileToken: token,
        files: cv ? [cv] : [],
      });
      setSentTo(form.email.trim());
      setForm({});
      setCv(null);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "We could not send your application. Please email HR directly.");
    } finally {
      setSending(false);
      setToken("");
      setTurnstileKey((key) => key + 1);
    }
  };

  if (sentTo) {
    return (
      <div className="border border-[#111]/10 p-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-[#FB290E]">Application received</p>
        <h3 className="mt-3 text-[20px] font-medium leading-snug">Thank you — HR has your application.</h3>
        <p className="mt-2 max-w-[38ch] text-[15px] leading-[1.6] text-[#111]/55">
          We will reply to {sentTo} if your experience matches the role. For anything urgent, call 012 932 700.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate className="border border-[#111]/10 p-6">
      <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-[#FB290E]">Apply for this role</p>
      <h3 className="mt-3 text-[20px] font-medium leading-snug">{role}</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {invalid.length > 0 && <p className="qf-error sm:col-span-2" role="alert">Please check the highlighted fields.</p>}
        <label className={`qf-field${invalid.includes("name") ? " is-invalid" : ""}`}>
          <span className="qf-label">Your name *</span>
          <input id="apply-name" className={fieldClass} value={form.name ?? ""} onChange={set("name")} autoComplete="name" aria-invalid={invalid.includes("name") || undefined} />
        </label>
        <label className={`qf-field${invalid.includes("email") ? " is-invalid" : ""}`}>
          <span className="qf-label">Email *</span>
          <input id="apply-email" className={fieldClass} type="email" value={form.email ?? ""} onChange={set("email")} autoComplete="email" aria-invalid={invalid.includes("email") || undefined} />
        </label>
        <label className="qf-field sm:col-span-2">
          <span className="qf-label">Phone / Telegram</span>
          <input className={fieldClass} type="tel" value={form.phone ?? ""} onChange={set("phone")} autoComplete="tel" />
        </label>
        <label className="qf-field sm:col-span-2">
          <span className="qf-label">Experience summary</span>
          <textarea className={`${fieldClass} qf-textarea`} rows={3} value={form.message ?? ""} onChange={set("message")} placeholder="Years in the role, equipment or projects you have worked on" />
        </label>
        <label className="qf-field sm:col-span-2">
          <span className="qf-label">CV / résumé</span>
          <input
            type="file"
            accept={LEAD_FILE_ACCEPT}
            className="qf-file"
            onChange={(event) => {
              const picked = event.target.files?.[0] ?? null;
              const problem = picked ? describeFileProblem([picked]) : "";
              setFileError(problem);
              setCv(problem ? null : picked);
            }}
          />
          <span className="qf-file-note">PDF, Word or image · 8 MB maximum.{cv ? ` ${cv.name} (${formatFileSize(cv.size)})` : ""}</span>
          {fileError && <span className="qf-file-error">{fileError}</span>}
        </label>
        <label className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={form.website ?? ""} onChange={set("website")} />
        </label>
      </div>

      <Turnstile onToken={setToken} resetKey={turnstileKey} action="careers" />
      {error && <p role="alert" className="mt-4 text-[13.5px] leading-[1.5] text-[#b3261e]">{error}</p>}
      <ArrowButton type="submit" label={sending ? "Sending…" : "Send application"} disabled={sending} className="mt-5" />
      <p className="mt-3 max-w-[36rem] text-[12.5px] leading-[1.6] text-[#111]/45">
        Applications reach BCE HR only. See our{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-[#111]">Privacy policy</a>{" "}
        for how we use candidate information.
      </p>
    </form>
  );
}
