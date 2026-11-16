import { siteSettings } from "./siteSettings";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import FluidCursor from "./FluidCursor";
import { usePageSetup } from "./usePageSetup";

// Privacy Policy and Terms of Use. Kept in one module so the two legal pages share the same layout, header and
// footer. The policy describes the site as it is built today: quote/contact forms, Cloudflare Turnstile, Telegram
// notifications for enquiries, the HR inbox for applications, and the language preference stored in localStorage.
// If analytics or a CV upload form is added later, update the policy in the same change.

const phones = siteSettings.contact.phones;
const tel = (n: string) => `tel:+855${n.replace(/\s/g, "").slice(1)}`;
const UPDATED = "17 November 2026";

type Section = { title: string; body?: string[]; items?: string[] };

function LegalLayout({
  kind,
  title,
  intro,
  sections,
}: {
  kind: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <>
      <SiteHeader phones={phones} tel={tel} base="/" />
      <main className="relative z-[1] overflow-x-clip bg-white text-[#111]">
        <article className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-32 sm:px-8 md:pb-32 md:pt-44">
          <p className="font-mono text-[12px] uppercase tracking-[0.09em] text-[#FB290E]">{kind}</p>
          <h1 className="mt-5 text-[34px] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[48px] md:text-[58px]">
            {title}
          </h1>
          <p className="mt-6 max-w-[44rem] text-[16px] leading-[1.65] text-[#111]/60">{intro}</p>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.08em] text-[#111]/40">
            Last updated: {UPDATED}
          </p>

          <div className="mt-14 border-t border-[#111]/10">
            {sections.map((section, index) => (
              <section key={section.title} className="border-b border-[#111]/10 py-8">
                <div className="grid gap-4 md:grid-cols-[64px_1fr] md:gap-8">
                  <span className="font-mono text-[12px] text-[#111]/35">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 className="text-[20px] font-medium leading-[1.3] tracking-[-0.01em] sm:text-[22px]">{section.title}</h2>
                    {section.body?.map((paragraph) => (
                      <p key={paragraph} className="mt-3 text-[15px] leading-[1.7] text-[#111]/65">
                        {paragraph}
                      </p>
                    ))}
                    {section.items && (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-[1.7] text-[#111]/65 marker:text-[#111]/25">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <p className="mt-10 text-[14px] leading-[1.7] text-[#111]/50">
            This page is published in English. A Khmer translation is available on request from{" "}
            <a href={`mailto:${siteSettings.contact.email}`} className="underline underline-offset-4 hover:text-[#111]">
              {siteSettings.contact.email}
            </a>
            .
          </p>

          <nav aria-label="Legal" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[14px]">
            <a href="/?privacy" className="underline underline-offset-4 hover:text-[#FB290E]">Privacy policy</a>
            <a href="/?terms" className="underline underline-offset-4 hover:text-[#FB290E]">Terms of use</a>
            <a href="/?contact" className="underline underline-offset-4 hover:text-[#FB290E]">Contact BCE</a>
          </nav>
        </article>
      </main>
      <Footer phones={phones} tel={tel} base="/" />
      <FluidCursor />
    </>
  );
}

const CONTACT = `${siteSettings.contact.email} or ${siteSettings.contact.phones[0]}`;

const PRIVACY: Section[] = [
  {
    title: "Who we are",
    body: [
      "Battambang Construction and Engineering Co., Ltd. (BCE) operates this website. Our head office is at Ang Village, Sangkat O'Char, Battambang City, Battambang Province, Kingdom of Cambodia.",
      `For privacy questions or requests, contact ${CONTACT}.`,
    ],
  },
  {
    title: "Information you give us",
    body: ["We collect the information you choose to send us through the website or by email:"],
    items: [
      "Quotation and contact forms: your name, phone number, email address, company, service required, project name and location, estimated quantities, required dates and any notes you add.",
      "Files you send us: drawings, BOQs or other project documents you choose to attach or send to our team.",
      "Recruitment: your CV, certificates, contact details and any other information you include in an application email.",
      "Messages: the content of enquiries, requests for documents and other correspondence.",
    ],
  },
  {
    title: "Information collected automatically",
    body: [
      "When you use the site, our hosting and security providers process limited technical information needed to deliver and protect it:",
    ],
    items: [
      "Your IP address, used in hashed form to rate-limit form submissions and prevent abuse.",
      "Browser type, device type, referring page and the pages you request.",
      "Security checks from Cloudflare Turnstile, used to confirm that a form submission is not automated.",
      "Your language preference (English or Khmer), stored in your browser's local storage so the site opens in the language you chose.",
    ],
  },
  {
    title: "How we use your information",
    items: [
      "To answer enquiries, prepare quotations and provide the services you request.",
      "To assess job applications and contact candidates about recruitment.",
      "To keep records of enquiries, quotations and projects for our legitimate business purposes.",
      "To protect the website, prevent spam and fraud, and maintain security.",
      "To comply with legal, tax, accounting and regulatory obligations.",
    ],
  },
  {
    title: "Why we are allowed to use it",
    body: [
      "We rely on your consent when you submit an enquiry or an application, on the steps needed to respond to your request before entering a contract, on our legitimate interest in running and protecting our business, and on legal obligations where they apply. You may withdraw consent at any time, but that does not affect processing that already took place.",
    ],
  },
  {
    title: "Who we share it with",
    body: [
      "We do not sell personal information. We share it only with service providers that help us operate the site and respond to you, and only as needed:",
    ],
    items: [
      "Cloudflare, which hosts the website, provides security and Turnstile, and stores form submissions in our database.",
      "Telegram, which sends our team a notification when a new enquiry arrives.",
      "Our email providers, for correspondence and recruitment applications.",
      "Professional advisers and authorities where required by law, or to establish or defend legal claims.",
    ],
  },
  {
    title: "International transfers",
    body: [
      "Some providers process data outside Cambodia. Where that happens, we take reasonable steps to ensure the information remains protected and is used only for the purposes described here.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep enquiry and quotation records for as long as needed to respond, deliver any project and meet our business and legal record-keeping needs. Recruitment information is kept for the current recruitment process and up to 12 months afterwards unless you ask us to delete it or agree to a longer period. Technical and security logs are kept for the short period needed to operate and protect the site.",
    ],
  },
  {
    title: "Security",
    body: [
      "The site is served over HTTPS. Access to enquiries and candidate information is restricted to authorised staff. IP addresses used for rate limiting are hashed, and Turnstile helps protect forms from automated abuse. No method of transmission or storage is completely secure, but we take reasonable measures to protect the information we hold.",
    ],
  },
  {
    title: "Your rights",
    body: ["Subject to applicable law, you may ask us to:"],
    items: [
      "Confirm whether we hold personal information about you and give you a copy.",
      "Correct information that is inaccurate or out of date.",
      "Delete information we no longer need for the purpose it was collected.",
      "Withdraw consent or object to a particular use.",
      "Answer any question about how your information is handled.",
    ],
  },
  {
    title: "Cookies and local storage",
    body: [
      "The public site does not use advertising or profiling cookies. It stores your language choice in local storage and uses Cloudflare Turnstile, which is necessary for form security. If we add analytics in future, we will update this policy and, where required, ask for consent before setting non-essential cookies.",
    ],
  },
  {
    title: "Children",
    body: ["The site is intended for business users and is not directed at children under 16. We do not knowingly collect their personal information."],
  },
  {
    title: "Changes to this policy",
    body: ["We may update this policy when the site or our practices change. The date at the top shows the latest revision."],
  },
];

const TERMS: Section[] = [
  {
    title: "About these terms",
    body: [
      "These terms govern your use of the BCE website. By using the site, you agree to them. If you do not agree, please do not use the site.",
      `The site is operated by Battambang Construction and Engineering Co., Ltd. (BCE), Ang Village, Sangkat O'Char, Battambang City, Battambang Province, Cambodia. Contact: ${CONTACT}.`,
    ],
  },
  {
    title: "Information on the site",
    body: [
      "The site describes BCE's businesses, capabilities, projects and credentials. We aim to keep it accurate and current, but information may change and is provided for general information. Photographs, project records and figures marked as sample or illustrative are drafts and are not a statement that a particular project was completed by BCE.",
    ],
  },
  {
    title: "Quotations and the volume calculator",
    body: [
      "The concrete volume calculator gives a preliminary estimate only. It is not a quotation, an offer or a commitment to supply. Final quantities must be verified against approved drawings and site requirements.",
      "A quotation becomes binding only when BCE issues it in writing and accepts an order on its stated terms. Prices, availability and delivery dates are confirmed in that written quotation.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The BCE name, logo, photographs, text, drawings and other content on the site are owned by BCE or used with permission. You may view and print pages for your own business use, but you may not reproduce, publish, sell or redistribute the content without our written permission.",
    ],
  },
  {
    title: "Acceptable use",
    items: [
      "Do not use the site to send false, misleading or unlawful enquiries.",
      "Do not attempt to gain unauthorised access to the site, its database or another person's information.",
      "Do not upload malicious code, scrape the site at a scale that disrupts it, or interfere with its security features.",
      "Do not impersonate BCE or another person when submitting a form.",
    ],
  },
  {
    title: "Third-party links",
    body: [
      "The site links to services such as Google Maps, Telegram and social media. Those services have their own terms and privacy policies, and BCE is not responsible for their content or practices.",
    ],
  },
  {
    title: "Privacy",
    body: ["Our Privacy policy explains what we collect when you use the site and how we handle it. It forms part of these terms."],
  },
  {
    title: "Disclaimer and liability",
    body: [
      "The site is provided on an “as is” basis. To the extent permitted by law, BCE is not liable for indirect or consequential loss arising from use of the site or reliance on general information on it. Nothing in these terms limits liability that cannot be limited under Cambodian law.",
    ],
  },
  {
    title: "Governing law",
    body: ["These terms are governed by the laws of the Kingdom of Cambodia. Disputes are subject to the jurisdiction of the competent Cambodian courts."],
  },
  {
    title: "Changes",
    body: ["We may update these terms from time to time. The date at the top shows the latest revision; continued use of the site after a change means you accept the updated terms."],
  },
];

export function PrivacyPage() {
  usePageSetup("Privacy policy | BCE., Ltd.");
  return (
    <LegalLayout
      kind="Legal"
      title="Privacy policy"
      intro="How BCE collects, uses and protects the information you send through this website, including quotation enquiries, document requests and job applications."
      sections={PRIVACY}
    />
  );
}

export function TermsPage() {
  usePageSetup("Terms of use | BCE., Ltd.");
  return (
    <LegalLayout
      kind="Legal"
      title="Terms of use"
      intro="The rules for using the BCE website, including how to read estimates, project information and quotations."
      sections={TERMS}
    />
  );
}
