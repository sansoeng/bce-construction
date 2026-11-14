import { useState, type ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import QuoteCta from "./QuoteCta";
import ArrowButton from "./ArrowButton";
import { Turnstile } from "./turnstile";
import { submitLead } from "./leads";
import { siteSettings } from "./siteSettings";
import { usePageSetup } from "./usePageSetup";

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("O'Char, Battambang, Cambodia");

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const PhoneIcon = () => (
  <svg {...iconProps} className="size-4">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps} className="size-4">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.693c.46 0 .663-.211.921-.46l2.211-2.15 4.6 3.4c.847.468 1.458.226 1.67-.783l3.015-14.2c.31-1.24-.473-1.8-1.27-.927z" />
  </svg>
);

const PinIcon = () => (
  <svg {...iconProps} className="size-4">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg {...iconProps} className="size-3.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/** A soft grey panel; on hover only the panel itself eases in and out, the copy inside stays crisp. */
function ChannelCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="box-24 group relative isolate rounded-[24px] p-6"
      style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as Record<string, string>}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-[#F8F9FA] transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
        style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as Record<string, string>}
      />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#191C1F]/45">{icon}</span>
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#191C1F]/45">{label}</span>
      </div>
      {children}
    </div>
  );
}

const fieldClass =
  "w-full rounded-[16px] bg-[#F4F4F5] border border-transparent px-4 py-3 text-[15px] text-[#191C1F] placeholder:text-[#191C1F]/35 outline-none transition-colors focus:bg-white focus:border-[#191C1F]/15";

export default function ContactPage() {
  usePageSetup("Contact us | BCE., Ltd.");

  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);

  const set =
    (key: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((value) => ({ ...value, [key]: event.target.value }));

  const reset = () => {
    setForm({});
    setError("");
    setSent(false);
    setToken("");
    setTurnstileKey((key) => key + 1);
  };

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!siteSettings.features.leadsEnabled)
      return setError("Online requests are temporarily paused. Please call 012 932 700.");
    if (!form.name?.trim() || !form.phone?.trim())
      return setError("Please add your name and a phone number.");
    if (!form.message?.trim()) return setError("Please tell us how we can help.");
    if (!token) return setError("Please complete the security check before sending.");

    setError("");
    setSending(true);
    try {
      await submitLead({
        kind: "contact",
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        summary: `BCE contact request\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email ?? ""}\n\n${form.message}`,
        website: form.website ?? "",
        turnstileToken: token,
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We could not send your message. Please call 012 932 700 or message us on Telegram.",
      );
      setToken("");
      setTurnstileKey((key) => key + 1);
    } finally {
      setSending(false);
    }
  };

  const telegram = siteSettings.contact.telegram.replace(/^@/, "");
  const addressLines = siteSettings.contact.address.split(",").map((line) => line.trim()).filter(Boolean);

  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main className="relative z-[1] overflow-x-clip bg-white text-[#191C1F]">
        <section className="max-w-[1000px] w-full mx-auto px-5 sm:px-6 md:px-8 pt-[280px] pb-20 sm:pb-28">
          {/* Centered hero */}
          <div className="text-center max-w-[760px] mx-auto mb-10 sm:mb-14">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#191C1F]/40 mb-5">Get in touch</p>
            <h1 className="text-[34px] sm:text-[42px] md:text-[64px] font-semibold text-[#191C1F] tracking-[-0.03em] leading-[1.12]">
              Contact us
            </h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-[#191C1F]/60 leading-[1.55] max-w-[620px] mx-auto">
              Ready-mix concrete, piling, civil works or fleet hire — our team answers every day from Battambang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-4 lg:gap-6 items-start">
            {/* Direct channels */}
            <div className="md:col-span-5 flex flex-col gap-3.5 md:gap-4">
              <ChannelCard icon={<PhoneIcon />} label="Hotlines">
                <div className="flex flex-col gap-1.5">
                  {phones.map((number) => (
                    <a
                      key={number}
                      href={tel(number)}
                      className="text-[17px] font-medium tracking-[-0.01em] text-[#191C1F] hover:underline underline-offset-4 w-fit"
                    >
                      {number}
                    </a>
                  ))}
                </div>
                <p className="mt-3 text-[12.5px] text-[#191C1F]/45">24/7 site pouring dispatch upon schedule</p>
              </ChannelCard>

              <ChannelCard icon={<MailIcon />} label="Email">
                <a
                  href={`mailto:${siteSettings.contact.email}`}
                  className="text-[17px] font-medium text-[#191C1F] break-all hover:underline underline-offset-4"
                >
                  {siteSettings.contact.email}
                </a>
              </ChannelCard>

              <ChannelCard icon={<TelegramIcon />} label="Telegram">
                <a
                  href={`https://t.me/${telegram}`}
                  target="_blank"
                  rel="noopener"
                  className="text-[17px] font-medium text-[#191C1F] hover:underline underline-offset-4"
                >
                  @{telegram}
                </a>
                <p className="mt-3 text-[12.5px] text-[#191C1F]/45">Direct chat &amp; quotations</p>
              </ChannelCard>

              <ChannelCard icon={<PinIcon />} label="Head office">
                <address className="not-italic text-[14px] leading-[1.55] text-[#191C1F]/75">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#191C1F] hover:underline underline-offset-4"
                >
                  <span>Get directions</span>
                  <svg viewBox="0 0 16 16" className="size-3 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 12L12 4M6 4h6v6" />
                  </svg>
                </a>
                <div className="mt-4 flex items-center gap-1.5 text-[12.5px] text-[#191C1F]/50">
                  <ClockIcon />
                  <span>{siteSettings.contact.hours}</span>
                </div>
              </ChannelCard>
            </div>

            {/* Message form */}
            <div className="md:col-span-7">
              <div
                className="box-24 rounded-[24px] bg-[#F8F9FA] p-6 sm:p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                style={{ WebkitCornerSmoothing: "60%", cornerSmoothing: "60%" } as Record<string, string>}
              >
                {sent ? (
                  <div className="py-10 text-center">
                    <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-[#191C1F] text-white">
                      <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M3 8l3.5 3.5L13 5" />
                      </svg>
                    </span>
                    <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] text-[#191C1F]">
                      Message sent
                    </h2>
                    <p className="mt-2 text-[14px] text-[#191C1F]/55 max-w-[320px] mx-auto leading-[1.55]">
                      Thank you. Our team will be in touch shortly.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-[#191C1F] px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-black"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={send} noValidate>
                    <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] text-[#191C1F]">
                      Send us a message
                    </h2>
                    <p className="mt-2 mb-6 text-[14px] text-[#191C1F]/55 leading-[1.55]">
                      Tell us what you need and our team will come back to you.
                    </p>

                    <div className="flex flex-col gap-4">
                      <label className="flex flex-col gap-2">
                        <span className="text-[12px] font-medium text-[#191C1F]/60">Your name</span>
                        <input
                          type="text"
                          autoComplete="name"
                          value={form.name ?? ""}
                          onChange={set("name")}
                          placeholder="Somchai Meas"
                          className={fieldClass}
                        />
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                          <span className="text-[12px] font-medium text-[#191C1F]/60">Phone</span>
                          <input
                            type="tel"
                            autoComplete="tel"
                            value={form.phone ?? ""}
                            onChange={set("phone")}
                            placeholder="012 932 700"
                            className={fieldClass}
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <span className="text-[12px] font-medium text-[#191C1F]/60">Email address</span>
                          <input
                            type="email"
                            autoComplete="email"
                            value={form.email ?? ""}
                            onChange={set("email")}
                            placeholder="you@company.com"
                            className={fieldClass}
                          />
                        </label>
                      </div>

                      <label className="flex flex-col gap-2">
                        <span className="text-[12px] font-medium text-[#191C1F]/60">Message</span>
                        <textarea
                          rows={5}
                          value={form.message ?? ""}
                          onChange={set("message")}
                          placeholder="How can we help?"
                          className={`${fieldClass} resize-y`}
                        />
                      </label>

                      {/* Honeypot: hidden from people, tempting to bots. */}
                      <label className="sr-only" aria-hidden>
                        Website
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={form.website ?? ""}
                          onChange={set("website")}
                        />
                      </label>

                      <Turnstile onToken={setToken} resetKey={turnstileKey} action="contact" />

                      {error && <p className="text-[13.5px] text-[#b3261e] leading-[1.5]">{error}</p>}

                      <ArrowButton
                        type="submit"
                        theme="black"
                        label={sending ? "Sending…" : "Send message"}
                        className="mt-2 self-start"
                        disabled={sending}
                      />
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <QuoteCta href="/?quote" />
        <Footer phones={phones} tel={tel} base="/" />
        <FluidCursor />
      </main>
    </>
  );
}
