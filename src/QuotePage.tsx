import { useMemo, useRef, useState, type CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import ArrowButton from "./ArrowButton";
import { usePageSetup } from "./usePageSetup";
import { offerings } from "./company";

// Request a Quote (website brief, sections 8 and 9): choose a BCE service first, estimate the concrete with the
// volume calculator (its result fills the request), then service-specific project details and contact.
// No backend yet: Submit assembles the request and offers to call, copy it, or (once QUOTE_EMAIL / QUOTE_TELEGRAM
// are set) send it by email or Telegram. A backend that stores requests and drawing/BOQ uploads can replace `send`.

const phones = ["012 932 700", "017 222 205", "012 867 475", "070 867 475"];
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const pad = (n: number) => String(n).padStart(2, "0");

/** BCE's quotation inbox and Telegram username. */
const QUOTE_EMAIL = "bcebtb999@gmail.com";
const QUOTE_TELEGRAM = "thendLP";

type Shape = "slab" | "beam" | "column" | "footing" | "pile" | "custom";
const SHAPES: { id: Shape; label: string; fields: [key: string, label: string][] }[] = [
  { id: "slab", label: "Slab", fields: [["l", "Length (m)"], ["w", "Width (m)"], ["t", "Thickness (m)"]] },
  { id: "beam", label: "Beam", fields: [["l", "Length (m)"], ["w", "Width (m)"], ["t", "Depth (m)"]] },
  { id: "column", label: "Column", fields: [["w", "Width (m)"], ["t", "Depth (m)"], ["l", "Height (m)"]] },
  { id: "footing", label: "Footing", fields: [["l", "Length (m)"], ["w", "Width (m)"], ["t", "Depth (m)"]] },
  { id: "pile", label: "Pile", fields: [["d", "Diameter (m)"], ["l", "Length (m)"]] },
  { id: "custom", label: "Custom", fields: [["a", "Area (m²)"], ["t", "Depth (m)"]] },
];
const num = (v: string | undefined) => Math.max(parseFloat(v ?? "") || 0, 0);
const volumeOf = (shape: Shape, v: Record<string, string>) => {
  const q = Math.max(Math.round(num(v.q) || 1), 1);
  const each = shape === "pile" ? Math.PI * (num(v.d) / 2) ** 2 * num(v.l) : shape === "custom" ? num(v.a) * num(v.t) : num(v.l) * num(v.w) * num(v.t);
  return each * q;
};

const STRENGTHS = ["C15", "C20", "C25", "C30", "C35", "C40", "Not sure"];

function Field({ label, required, children, wide }: { label: string; required?: boolean; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`qf-field${wide ? " qf-field--wide" : ""}`}>
      <span className="qf-label">{label}{required && <span aria-hidden> *</span>}</span>
      {children}
    </label>
  );
}

// A numbered step: the homepage's left-title / right-content split.
function Step({ n, title, note, children, id }: { n: number; title: string; note?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="qf-step grid gap-y-8 px-5 pt-20 md:grid-cols-12 md:gap-x-5 md:pt-32">
      <div className="md:col-span-5">
        <p className="text-[.95rem] text-black/45">{pad(n)}</p>
        <h2 data-split className="pd-h2 mt-4">{title}</h2>
        {/* The note can change with the service, so it skips the split reveal (which rewrites text nodes). */}
        {note && <p className="mt-5 max-w-[26rem] text-[1rem] leading-[1.45] text-black/50">{note}</p>}
      </div>
      <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">{children}</div>
    </section>
  );
}

export default function QuotePage() {
  usePageSetup("Request a Quote | BCE., Ltd.");
  const initial = new URLSearchParams(location.search).get("service");
  const [service, setService] = useState(() => offerings.find((b) => b.slug === initial)?.slug ?? "");
  const [shape, setShape] = useState<Shape>("slab");
  const [dims, setDims] = useState<Record<string, string>>({ q: "1" });
  const [waste, setWaste] = useState("5");
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const biz = offerings.find((b) => b.slug === service);
  const concrete = service === "" || service === "ready-mix-concrete" || service === "concrete-slab-works" || service === "construction" || service === "piling";
  const withWaste = service === "" || service === "ready-mix-concrete" || service === "concrete-slab-works";
  const base = volumeOf(shape, dims);
  const total = base * (1 + num(waste) / 100);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const useVolume = () => {
    setForm((f) => ({ ...f, volume: total.toFixed(1) }));
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } | null }).__lenis;
    if (detailsRef.current) lenis ? lenis.scrollTo(detailsRef.current, { offset: -120 }) : detailsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Service-specific questions (brief section 9; the ready-mix list is the brief's own).
  const specific = useMemo((): [key: string, label: string, kind?: "strength" | "yesno" | "select", options?: string[]][] => {
    switch (service) {
      case "ready-mix-concrete":
      case "concrete-slab-works":
        return [["strength", "Concrete strength / class", "strength"], ["volume", "Estimated volume (m³)"], ["date", "Required date"], ["pump", "Pump required", "yesno"]];
      case "piling":
        return [["piles", "Number of piles"], ["pileSize", "Pile size / diameter"], ["pileLength", "Pile length (m)"], ["date", "Required start date"]];
      case "construction":
        return [["type", "Project type", "select", ["Infrastructure", "Industrial", "Commercial", "Residential"]], ["volume", "Estimated concrete (m³)"], ["date", "Planned start date"]];
      case "equipment-rental":
        return [["equipment", "Equipment", "select", ["Mixer truck", "Pump truck", "Piling rig", "Not sure"]], ["duration", "Hire period (days)"], ["date", "Start date"]];
      default:
        return [["volume", "Estimated volume (m³)"], ["date", "Required date"]];
    }
  }, [service]);

  const summary = () => {
    const lines: [string, string | undefined][] = [
      ["Service", biz?.name],
      ["Project name", form.project],
      ["Project location", form.location],
      ...specific.map(([k, label]) => [label, form[k]] as [string, string | undefined]),
      ...(specific.some(([k]) => k === "volume") ? [] : [["Estimated volume (m³)", form.volume] as [string, string | undefined]]),
      ["Contact person", form.contact],
      ["Phone / Telegram", form.phone],
      ["Notes", form.notes],
    ];
    return lines.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v}`).join("\n");
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return setError("Please choose a service.");
    if (!form.contact?.trim() || !form.phone?.trim()) return setError("Please add a contact person and a phone or Telegram number.");
    setError("");
    setCopied(false);
    setSent(`BCE quotation request\n\n${summary()}`);
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="relative z-[1] overflow-x-clip bg-white text-[#111]">
      <SiteHeader phones={phones} tel={tel} base="/" />

      <header data-header-title="Request a quote" className="px-5 pt-28 md:pt-36">
        <p data-split="content" className="mt-20 text-[.95rem] text-black/45 md:mt-36">Request a quote</p>
        <h1 data-split data-split-type="words" className="pd-title mt-6 max-w-[72rem]">Tell us about your project. We’ll come back with a quotation.</h1>
        <p data-split="content" className="mt-8 max-w-[34rem] text-[1.05rem] leading-[1.45] text-black/55">Choose a service, estimate your concrete with the calculator, and add your details. Prefer to talk? Call <a href={tel(phones[0])} className="underline underline-offset-4">{phones[0]}</a>.</p>
      </header>

      <form onSubmit={send} noValidate className="pb-24 md:pb-40">
        {/* 01: service, as five tiles in the homepage panel colours. */}
        <Step n={1} title="Choose a service">
          <fieldset className="qf-tiles">
            <legend className="sr-only">Service</legend>
            {offerings.map((b, i) => (
              <label key={b.slug} className={`qf-tile${service === b.slug ? " is-on" : ""}`} style={{ "--bg": b.bg, "--fg": b.fg, "--i": i } as CSSProperties}>
                <input type="radio" name="service" value={b.slug} checked={service === b.slug} onChange={() => setService(b.slug)} className="sr-only" />
                <span className="qf-tile-num">{pad(i + 1)}</span>
                <span className="qf-tile-name">{b.name}</span>
                <span className="qf-tile-tag">{b.tagline}</span>
              </label>
            ))}
          </fieldset>
        </Step>

        {/* 02: concrete volume calculator (concrete services). */}
        {concrete && (
          <Step n={2} title="Concrete volume calculator" note="A preliminary estimate. Final quantities should be verified from approved drawings and site requirements.">
            <div className="qf-calc">
              <div className="pl-terms qf-shapes" role="radiogroup" aria-label="Shape">
                {SHAPES.map((s) => (
                  <button key={s.id} type="button" role="radio" aria-checked={shape === s.id} className={`pl-term${shape === s.id ? " is-active" : ""}`} onClick={() => setShape(s.id)}>
                    <span aria-hidden>/</span><span>{s.label}</span>
                  </button>
                ))}
              </div>
              <div className="qf-grid mt-8">
                {SHAPES.find((s) => s.id === shape)!.fields.map(([k, label]) => (
                  <Field key={`${shape}-${k}`} label={label}>
                    <input className="qf-input" type="number" inputMode="decimal" min="0" step="any" value={dims[k] ?? ""} onChange={(e) => setDims((d) => ({ ...d, [k]: e.target.value }))} placeholder="0" />
                  </Field>
                ))}
                <Field label="Quantity">
                  <input className="qf-input" type="number" inputMode="numeric" min="1" step="1" value={dims.q ?? ""} onChange={(e) => setDims((d) => ({ ...d, q: e.target.value }))} />
                </Field>
                {withWaste && (
                  <Field label="Wastage allowance">
                    <select className="qf-input" value={waste} onChange={(e) => setWaste(e.target.value)}>
                      {["0", "3", "5", "10"].map((w) => <option key={w} value={w}>{w}%</option>)}
                    </select>
                  </Field>
                )}
              </div>
              <div className="qf-result">
                <div>
                  <p className="text-[.95rem] text-black/45">Estimated volume</p>
                  <p className="qf-result-num" aria-live="polite">{total.toFixed(2)}<span className="pd-unit">m³</span></p>
                  {withWaste && num(waste) > 0 && base > 0 && <p className="text-[.9rem] text-black/45">{base.toFixed(2)} m³ + {waste}% wastage</p>}
                </div>
                <ArrowButton label="Use in my request" onClick={useVolume} disabled={total <= 0} className="qf-use" />
              </div>
            </div>
          </Step>
        )}

        {/* 03: project details, service-specific. */}
        <Step n={concrete ? 3 : 2} title="Project details" note={biz ? `${biz.name}: ${biz.tagline.toLowerCase()}.` : "Choose a service above for its specific questions."}>
          <div ref={detailsRef} className="qf-grid">
            <Field label="Project name"><input className="qf-input" value={form.project ?? ""} onChange={set("project")} /></Field>
            <Field label="Project location"><input className="qf-input" value={form.location ?? ""} onChange={set("location")} placeholder="Province or address" /></Field>
            {specific.map(([k, label, kind, options]) => (
              <Field key={`${service}-${k}`} label={label}>
                {kind === "strength" ? (
                  <select className="qf-input" value={form[k] ?? ""} onChange={set(k)}>
                    <option value="">Select</option>
                    {STRENGTHS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : kind === "yesno" ? (
                  <select className="qf-input" value={form[k] ?? ""} onChange={set(k)}>
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not sure</option>
                  </select>
                ) : kind === "select" ? (
                  <select className="qf-input" value={form[k] ?? ""} onChange={set(k)}>
                    <option value="">Select</option>
                    {options!.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className="qf-input" type={k === "date" ? "date" : "text"} inputMode={/volume|piles|Length|duration/.test(k) ? "decimal" : undefined} value={form[k] ?? ""} onChange={set(k)} />
                )}
              </Field>
            ))}
            <Field label="Notes" wide><textarea className="qf-input qf-textarea" rows={3} value={form.notes ?? ""} onChange={set("notes")} placeholder="Scope, access, drawings or BOQ you can share" /></Field>
          </div>
        </Step>

        {/* 04: contact and send. */}
        <Step n={concrete ? 4 : 3} title="Your details">
          <div className="qf-grid">
            <Field label="Contact person" required><input className="qf-input" value={form.contact ?? ""} onChange={set("contact")} autoComplete="name" /></Field>
            <Field label="Phone / Telegram" required><input className="qf-input" type="tel" value={form.phone ?? ""} onChange={set("phone")} autoComplete="tel" /></Field>
          </div>
          {error && <p role="alert" className="mt-6 text-[.95rem] text-[#b3261e]">{error}</p>}
          <ArrowButton type="submit" label="Prepare my request" className="mt-10" />

          {sent && (
            <div className="qf-sent" role="status">
              <p className="pd-statement">Your request is ready.</p>
              <p className="mt-3 text-[1rem] leading-[1.45] text-black/55">Send it to our team and we’ll come back to you with a quotation.</p>
              <pre className="qf-summary">{sent}</pre>
              <div className="mt-8 flex flex-wrap gap-3">
                {QUOTE_EMAIL && <ArrowButton href={`mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(`Quotation request: ${biz?.name ?? ""}`)}&body=${encodeURIComponent(sent)}`} label="Send by email" />}
                {QUOTE_TELEGRAM && <ArrowButton href={`https://t.me/${QUOTE_TELEGRAM}`} label="Open Telegram" />}
                <ArrowButton label={copied ? "Copied" : "Copy request"} onClick={copy} theme={QUOTE_EMAIL ? "alpha" : "black"} />
                <ArrowButton href={tel(phones[0])} label={`Call ${phones[0]}`} theme="alpha" />
              </div>
            </div>
          )}
        </Step>
      </form>

      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </main>
  );
}
