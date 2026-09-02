import React from 'react';
import { MessageCircle, Link2, Lightbulb, ExternalLink } from 'lucide-react';

// ─── Editable contact details ───────────────────────────────────────────────
// TODO: replace the placeholder values below with the real ACM-CEG office
// bearers' details and the actual suggestion-form link.
interface Contact {
  role: string;
  name: string;
  /** Display form of the WhatsApp number; the wa.me link strips non-digits. */
  whatsapp: string;
  linkedin: string;
}

const CONTACTS: Contact[] = [
  {
    role: 'Chairperson · ACM-CEG',
    name: 'Chairperson name (to be added)',
    whatsapp: '+91 00000 00000',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    role: 'Vice Chairperson · ACM-CEG',
    name: 'Vice Chairperson name (to be added)',
    whatsapp: '+91 00000 00000',
    linkedin: 'https://www.linkedin.com/',
  },
];

// TODO: point this at the real Google Form.
const SUGGESTION_FORM_URL = 'https://forms.gle/';
// ────────────────────────────────────────────────────────────────────────────

const waLink = (num: string) => `https://wa.me/${num.replace(/\D/g, '')}`;

export const ContactUs: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Contact Us</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Reach out to the ACM-CEG team, or suggest how C.O.D.E can be improved.
        </p>
      </div>

      {/* Office bearers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {CONTACTS.map((c) => (
          <div key={c.role} className="glass-panel p-6 rounded-xl border border-zinc-800/80 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{c.role}</span>
            <h3 className="text-base font-semibold text-zinc-100 mt-1">{c.name}</h3>

            <div className="mt-5 space-y-2">
              <a
                href={waLink(c.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-xs font-medium text-zinc-300 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="font-mono">{c.whatsapp}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto shrink-0 text-zinc-600" />
              </a>
              <a
                href={c.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-blue-500/40 hover:bg-blue-500/5 text-xs font-medium text-zinc-300 hover:text-blue-300 transition-colors"
              >
                <Link2 className="w-4 h-4 shrink-0" />
                <span>LinkedIn profile</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto shrink-0 text-zinc-600" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion form box */}
      <a
        href={SUGGESTION_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent p-6 transition-colors hover:border-blue-400/50 hover:from-blue-600/25"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-300" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-zinc-100">Suggest an improvement</h3>
            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
              Spotted a bug, missing question set, or have an idea to make C.O.D.E better?
              Tell us through the suggestion form — it takes a minute.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-blue-400">
              Open suggestion form <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};
