import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  CheckCircle2,
  ChevronRight,
  FileText,
  Handshake,
  Home,
  LineChart,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Timer,
  Users,
  X,
} from "lucide-react";

// ==============================
// CONFIG
// ==============================

// Replace with your real Formspree endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqayvpq";

const CONTACT = {
  brand: "Thrive Higher Capital",
  tagline: "Washington-focused buyer • Fast close • Long-term partnerships",
  email: "deals@thrivehighercapital.com",
  phoneDisplay: "(206) 203-1230",
  phoneHref: "+12062031230",
  location:
    "Washington State — investing across Bellingham, Seattle & King County",
  cta: "Get a Same-Day Offer",
  secondaryCta: "Send Me a Deal",
};

const SMS_POLICY = {
  brand: "Thrive Higher Capital",
  purpose:
    "We may text you about the deal you submitted (follow-ups, questions, scheduling).",
  frequency: "Message frequency varies.",
  rates: "Message & data rates may apply.",
  optOut: "Reply STOP to opt out, HELP for help.",
  privacy:
    "We don’t sell your number and we only use it for business communications.",
};

const NAV = [
  { id: "how", label: "How it works" },
  { id: "criteria", label: "Buy Box" },
  { id: "proof", label: "Why us" },
  { id: "faq", label: "FAQ" },
];

// localStorage key (prefill contact fields)
const STORAGE_KEY = "thrive_lead_prefill_v1";

// ==============================
// HELPERS / UI
// ==============================

function clsx(...xs) {
  return xs.filter(Boolean).join(" ");
}

function useScrollSpy(ids) {
  ids = Array.isArray(ids) ? ids : [];
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0),
          );
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35],
        rootMargin: "-20% 0px -55% 0px",
      },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);

  return active;
}

function Container({ children, className }) {
  return (
    <div className={clsx("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}

function Pill({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm shadow-sm">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-base text-white/90">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="flex items-end justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none",
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
        "placeholder:text-slate-400",
        props.className,
      )}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={clsx(
        "w-full appearance-none rounded-xl border bg-white px-3 py-2 text-sm outline-none",
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
        props.className,
      )}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={clsx(
        "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none",
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
        "placeholder:text-slate-400",
        props.className,
      )}
    />
  );
}

function Button({ children, variant = "primary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    ghost: "bg-white text-slate-900 hover:bg-slate-50 border shadow-sm",
    subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    dark: "bg-slate-800 text-white hover:bg-slate-700 shadow-sm",
  };
  return (
    <button
      {...props}
      className={clsx(base, styles[variant] || styles.primary, className)}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent" />
  );
}

// ==============================
// DEAL FORM (ALL FEATURES INCLUDED)
// ==============================

function DealForm({ compact = false, onSubmitted }) {
  // You must have these defined somewhere (or keep them here):

  // const STORAGE_KEY = "dealFormContact";
  // const FORMSPREE_ENDPOINT = FORMSPREE_DEAL_ENDPOINT; // or your real endpoint

  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Load contact fields from localStorage
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        // contact
        name: saved.name || "",
        email: saved.email || "",
        phone: saved.phone || "",
        role: saved.role || "Agent/Realtor",
        preferredContact: saved.preferredContact || "Email",
        smsConsent: !!saved.smsConsent,

        // deal
        address: "",
        city: "",
        asking: "",
        condition: "Average",
        timeline: "ASAP",
        photosLink: "",
        notes: "",

        // honeypot
        gotcha: "",
      };
    } catch {
      return {
        name: "",
        email: "",
        phone: "",
        role: "Agent/Realtor",
        preferredContact: "Email",
        smsConsent: false,

        address: "",
        city: "",
        asking: "",
        condition: "Average",
        timeline: "ASAP",
        photosLink: "",
        notes: "",

        gotcha: "",
      };
    }
  });

  // Save contact fields to localStorage (NOT inside submit)
  useEffect(() => {
    const toSave = {
      name: state.name.trim(),
      email: state.email.trim(),
      phone: state.phone.trim(),
      role: state.role,
      preferredContact: state.preferredContact,
      smsConsent: !!state.smsConsent,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [
    state.name,
    state.email,
    state.phone,
    state.role,
    state.preferredContact,
    state.smsConsent,
  ]);

  // Requirements + consent rules
  const phoneProvided = Boolean(state.phone?.trim());
  const emailProvided = Boolean(state.email?.trim());

  const prefersEmail = state.preferredContact === "Email";
  const prefersText = state.preferredContact === "Text";
  const prefersCall = state.preferredContact === "Call";

  const preferredMethodOk =
    (prefersEmail && emailProvided) ||
    ((prefersText || prefersCall) && phoneProvided) ||
    emailProvided ||
    phoneProvided;

  const smsConsentRequired = prefersText;

  const requiredOk =
    state.name.trim() &&
    state.address.trim() &&
    preferredMethodOk &&
    (!smsConsentRequired || state.smsConsent);
  const canSubmit = !!requiredOk && status !== "sending";

  const clean = (v, max = 500) =>
    String(v || "")
      .trim()
      .slice(0, max);

  async function submit(e) {
    e.preventDefault();
    setErrorMsg("");

    // Honeypot spam trap: if filled, pretend success
    if (state.gotcha && state.gotcha.trim()) {
      setStatus("success");
      onSubmitted?.();
      return;
    }

    if (!requiredOk) {
      setStatus("error");
      setErrorMsg("Please complete the required fields before submitting.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const payload = {
        name: clean(state.name, 120),
        email: clean(state.email, 160),
        _replyto: clean(state.email, 160),
        phone: clean(state.phone, 40),

        role: clean(state.role, 60),
        preferredContact: clean(state.preferredContact, 20),
        smsConsent: state.smsConsent ? "Yes" : "No",

        address: clean(state.address, 200),
        city: clean(state.city, 120),
        asking: clean(state.asking, 40),
        condition: clean(state.condition, 40),
        timeline: clean(state.timeline, 40),

        photosLink: clean(state.photosLink, 400),
        notes: clean(state.notes, 2000),

        _subject: `Deal Submission — ${CONTACT.brand}`,
        page: window.location.href,
        userAgent: navigator.userAgent,
        _gotcha: clean(state.gotcha, 120),
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v ?? ""));

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        let msg = "Submission failed. Please try again.";
        try {
          const data = await res.json();
          msg =
            data?.error ||
            data?.message ||
            (Array.isArray(data?.errors) && data.errors[0]?.message) ||
            msg;
        } catch {}
        throw new Error(msg);
      }

      setStatus("success");

      // Clear only deal fields; keep contact fields (saved)
      setState((s) => ({
        ...s,
        address: "",
        city: "",
        asking: "",
        condition: "Average",
        timeline: "ASAP",
        photosLink: "",
        notes: "",
        gotcha: "",
      }));

      onSubmitted?.();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className={clsx("grid gap-3", compact ? "" : "gap-4")}
      aria-label="Deal submission form"
    >
      {/* Hidden fields (optional — payload already includes _subject) */}
      <input
        type="hidden"
        name="_subject"
        value={`Deal Submission — ${CONTACT.brand}`}
      />
      <input
        type="hidden"
        name="_redirect"
        value={`${window.location.origin}${import.meta.env.BASE_URL || "/"}thanks`}
      />

      {/* Honeypot */}
      <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
        <input
          type="text"
          name="_gotcha"
          tabIndex="-1"
          autoComplete="off"
          value={state.gotcha}
          onChange={(e) => setState((s) => ({ ...s, gotcha: e.target.value }))}
        />
      </div>

      {/* Contact */}
      <div className={clsx("grid gap-3", compact ? "" : "sm:grid-cols-3")}>
        <Field label="Your name *">
          <Input
            value={state.name}
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            placeholder="Full name"
            autoComplete="name"
          />
        </Field>

        <Field label="Email">
          <Input
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            placeholder="you@email.com"
            inputMode="email"
            autoComplete="email"
          />
        </Field>

        <Field label="Phone">
          <Input
            value={state.phone}
            onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
            placeholder="(206) 555-1234"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
      </div>

      {/* Property location */}
      <div className={clsx("grid gap-3", compact ? "" : "sm:grid-cols-2")}>
        <Field label="Property address *">
          <Input
            value={state.address}
            onChange={(e) =>
              setState((s) => ({ ...s, address: e.target.value }))
            }
            placeholder="123 Main St"
            autoComplete="street-address"
          />
        </Field>

        <Field label="City">
          <Input
            value={state.city}
            onChange={(e) => setState((s) => ({ ...s, city: e.target.value }))}
            placeholder="Seattle"
            autoComplete="address-level2"
          />
        </Field>
      </div>

      <div className={clsx("grid gap-3", "sm:grid-cols-3")}>
        <Field label="I am a…">
          <Select
            value={state.role}
            onChange={(e) => setState((s) => ({ ...s, role: e.target.value }))}
          >
            <option>Agent/Realtor</option>
            <option>Wholesaler</option>
            <option>Seller/Owner</option>
            <option>Other</option>
          </Select>
        </Field>

        {/* Preferred Contact */}
        <Field label="Preferred contact *">
          <div className="grid gap-1">
            <Select
              value={state.preferredContact}
              onChange={(e) =>
                setState((s) => ({ ...s, preferredContact: e.target.value }))
              }
            >
              <option value="Email">Email</option>
              <option value="Text">Text</option>
              <option value="Call">Call</option>
            </Select>

            <div className="text-xs text-slate-500 px-1">
              Email, Text, or Call
            </div>
          </div>
        </Field>

        {/* SMS Consent */}
        <Field label="SMS consent *">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex items-start gap-3">
              <input
                id="smsConsent"
                type="checkbox"
                className="mt-1"
                checked={state.smsConsent}
                onChange={(e) =>
                  setState((s) => ({ ...s, smsConsent: e.target.checked }))
                }
              />

              <label htmlFor="smsConsent" className="grid gap-1 cursor-pointer">
                <div className="text-sm text-slate-700 leading-snug">
                  I agree to receive deal-related text messages. Message &amp;
                  data rates may apply.
                </div>

                <div className="text-xs text-slate-500">
                  {smsConsentRequired
                    ? "Required if Text is selected"
                    : "Optional"}
                </div>
              </label>
            </div>
          </div>
        </Field>
      </div>

      <div className={clsx("grid gap-3", "sm:grid-cols-3")}>
        <Field label="Asking price">
          <Input
            value={state.asking}
            onChange={(e) =>
              setState((s) => ({ ...s, asking: e.target.value }))
            }
            placeholder="$"
            inputMode="decimal"
          />
        </Field>

        <Field label="Condition / repairs">
          <Select
            value={state.condition}
            onChange={(e) =>
              setState((s) => ({ ...s, condition: e.target.value }))
            }
          >
            <option>Great</option>
            <option>Average</option>
            <option>Needs work</option>
            <option>Heavy rehab</option>
          </Select>
        </Field>

        <Field label="Timeline">
          <Select
            value={state.timeline}
            onChange={(e) =>
              setState((s) => ({ ...s, timeline: e.target.value }))
            }
          >
            <option>ASAP</option>
            <option>7–14 days</option>
            <option>30 days</option>
            <option>60+ days</option>
          </Select>
        </Field>
      </div>

      <Field label="Photos or link" hint="Google Drive, Dropbox, MLS, etc.">
        <Input
          value={state.photosLink}
          onChange={(e) =>
            setState((s) => ({ ...s, photosLink: e.target.value }))
          }
          placeholder="https://..."
          inputMode="url"
        />
      </Field>

      <Field
        label="Notes"
        hint="Repairs, access, occupancy, comps, offer instructions…"
      >
        <Textarea
          value={state.notes}
          onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
          placeholder="ARV / rent comps, repairs, access, occupancy, offer instructions…"
          rows={compact ? 3 : 4}
        />
      </Field>

      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {status === "success" && (
        <div className="mb-6 rounded-xl border border-emerald-300 bg-emerald-100 p-4 text-sm text-emerald-800">
          ✅ Submission complete.
          <br />
          Our team has received your deal and will reach out shortly.
        </div>
      )}

      <div className="sticky bottom-0 -mx-5 mt-2 border-t bg-white/95 px-5 py-4 backdrop-blur">
        <div
          className={clsx(
            "flex flex-col gap-3",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div className="text-xs text-slate-500">
            By submitting, you agree we can contact you about this deal. If you
            provide a phone number (or prefer Text), SMS consent is required.
          </div>
          <div className="text-[11px] text-slate-500">
            name:{String(!!state.name.trim())} | address:
            {String(!!state.address.trim())} | preferredOk:
            {String(preferredMethodOk)} | smsReq:{String(smsConsentRequired)} |
            smsOk:{String(!smsConsentRequired || state.smsConsent)} |
            requiredOk:{String(!!requiredOk)} | status:{String(status)} |
            canSubmit:{String(!!canSubmit)}
          </div>

          <Button
            type="submit"
            disabled={!requiredOk || status === "sending"}
            className={clsx(
              (!requiredOk || status === "sending") &&
                "opacity-60 cursor-not-allowed",
            )}
          >
            <Mail className="h-4 w-4" />
            {status === "sending" ? "Sending…" : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt={CONTACT.brand}
        className="h-16 w-auto md:h-20 drop-shadow-sm"
      />
      <div className="leading-tight hidden sm:block">
        <div className="text-sm font-semibold text-slate-900">
          {CONTACT.brand}
        </div>
        <div className="text-xs text-slate-500">{CONTACT.tagline}</div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-full max-w-2xl rounded-3xl border bg-white shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b p-5">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  {CONTACT.brand}
                </div>
                <div className="mt-0.5 text-lg font-semibold text-slate-900">
                  {title}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
const buyBox = null;

// ==============================
// APP
// ==============================

export default function App() {
  const [openDeal, setOpenDeal] = useState(false);
  const [openOffer, setOpenOffer] = useState(false);

  const [mode, setMode] = useState("home"); // "home" | "submit" | "thanks"

  useEffect(() => {
    const syncFromUrl = () => {
      const h = (window.location.hash || "").toLowerCase();

      if (h === "#/submit" || h === "#submit") setMode("submit");
      else if (h === "#/thanks" || h === "#thanks") setMode("thanks");
      else setMode("home");
    };

    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);

    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

// Keep this variable name so the rest of your file works
const isSubmitOnly = mode === "submit";

const active = useScrollSpy((Array.isArray(NAV) ? NAV : []).map((n) => n.id));

  const valueProps = [
    {
      icon: Timer,
      title: "Fast answers",
      text: "Same-day feedback on most deals. Clear next steps and no run-around.",
    },
    {
      icon: Calculator,
      title: "Simple underwriting",
      text: "Repair scope, ARV/rent comps, exit strategy, timeline.",
    },
    {
      icon: Handshake,
      title: "Repeat business",
      text: "We build long-term relationships with agents and wholesalers.",
    },
  ];

  const steps = [
    {
      icon: FileText,
      title: "Send the basics",
      text: "Address, asking price, condition, photos/comps link, access/occupancy.",
    },
    {
      icon: LineChart,
      title: "We run numbers",
      text: "We underwrite and reply with an offer range + what we need to finalize.",
    },
    {
      icon: CheckCircle2,
      title: "Close clean",
      text: "We coordinate title/escrow and move quickly once terms are set.",
    },
  ];

  const faqs = [
    {
      q: "Do you buy with cash?",
      a: "We can purchase with cash or strong financing. Either way, we focus on certainty and speed.",
    },
    {
      q: "How fast can you close?",
      a: "Depends on title/escrow and access. Many deals can close quickly once we have what we need.",
    },
    {
      q: "What do you need to give a real offer?",
      a: "Address, price, condition/repairs, strategy/access, and comps or ARV/rent picture.",
    },
    {
      q: "Do you pay assignment/wholesale fees?",
      a: "If the numbers work and the paperwork is clean, we consider it. Transparency helps.",
    },
  ];

  const hasPhone = Boolean(CONTACT.phoneHref && CONTACT.phoneHref.trim());

  // ✅ FORM-ONLY PAGE (no header/hero/etc.)
  if (isSubmitOnly) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-2xl font-semibold">Submit a Deal</h1>
          <p className="mt-2 text-sm text-slate-300">
            Share the basics and we’ll follow up quickly.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <DealForm onSubmitted={() => (window.location.href = "/#thanks")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#283750] via-[#283750]/90 to-slate-50 text-slate-900">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06)]" />
        <div className="absolute right-8 top-40 h-64 w-64 rounded-full bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06)]" />
        <div className="absolute left-8 bottom-24 h-64 w-64 rounded-full bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <Container className="flex items-center justify-between py-3">
          <a
            href="#top"
            className="rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
          >
            <LogoMark />
          </a>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {(NAV || []).map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={clsx(
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  active === n.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpenDeal(true)}
              className="hidden sm:inline-flex"
            >
              <ChevronRight className="h-4 w-4" />
              {CONTACT.secondaryCta}
            </Button>
            <Button onClick={() => setOpenOffer(true)}>
              <Sparkles className="h-4 w-4" />
              {CONTACT.cta}
            </Button>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <main id="top">
        <Container className="py-12 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="flex flex-wrap gap-3 mb-8">
                <Pill icon={Shield}>
                  Straightforward, professional, fast close
                </Pill>
                <Pill icon={Handshake}>Relationship-first</Pill>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              >
                We buy properties quickly across Washington State —
                <span className="block text-white">
                  and we’re easy to work with.
                </span>
              </motion.h1>

              <p className="mt-4 max-w-xl text-base text-white">
                If you’re an agent, wholesaler, or seller with a deal, send it
                over. We give clear feedback, keep communication clean, and aim
                for repeat business.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => setOpenDeal(true)} className="sm:w-auto">
                  <Mail className="h-4 w-4" />
                  {CONTACT.secondaryCta}
                </Button>
                <Button variant="ghost" onClick={() => setOpenOffer(true)}>
                  <ChevronRight className="h-4 w-4" />
                  {CONTACT.cta}
                </Button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Card className="p-4">
                  <div className="text-xs font-medium text-slate-500">
                    Primary markets
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    Washington State
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs font-medium text-slate-500">
                    Key areas
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    Bellingham • Seattle • King County
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs font-medium text-slate-500">
                    Deal types
                  </div>
                  <div className="mt-1 text-sm font-semibold">Value-add</div>
                </Card>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white">
                {hasPhone ? (
                  <a
                    className="inline-flex items-center gap-2 hover:text-slate-900"
                    href={`tel:${CONTACT.phoneHref}`}
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT.phoneDisplay}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-slate-200">
                    <Phone className="h-4 w-4" />
                    {CONTACT.phoneDisplay}
                  </span>
                )}
                <a
                  className="inline-flex items-center gap-2 hover:text-slate-900"
                  href={`mailto:${CONTACT.email}`}
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT.email}
                </a>
              </div>
            </div>

            {/* Right */}
            <div>
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-slate-500">
                      Quick submit
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      Send a deal in 60 seconds
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      Required: your name + address + preferred contact info.
                    </p>
                  </div>
                  <div className="hidden sm:block rounded-2xl bg-slate-100 p-3">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="text-sm font-semibold">What to send</div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {[
                        "Property address",
                        "Asking price",
                        "Condition / repairs",
                        "Photos or link",
                        "Access / occupancy",
                      ].map((x) => (
                        <li key={x} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-500">
                      If you include photos/comps, we can move faster.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={() => setOpenDeal(true)}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4" />
                      Open quick submit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setOpenOffer(true)}
                      className="flex-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      Get same-day offer
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:auto-rows-fr sm:items-stretch">
                {valueProps.map((v) => (
                  <Card key={v.title} className="p-4 h-full w-full">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-100 p-2">
                        <v.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{v.title}</div>
                        <div className="mt-1 text-xs text-slate-600">
                          {v.text}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Divider />

      {/* How */}
      <section id="how" className="scroll-mt-24">
        <Container className="py-10">
          <SectionTitle
            eyebrow="Simple process"
            title="How it works"
            subtitle="No complicated funnels. Just a clean process that gets to yes/no quickly."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-slate-100 p-2">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        {s.text}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <Divider />

      {/* Buy box */}
      <section id="criteria" className="scroll-mt-24">
        <Container className="py-10">
          <SectionTitle
            eyebrow="Buy Box"
            title="What we’re looking for"
            subtitle="This helps you pre-qualify deals before you send them. If you’re unsure, send it anyway."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(buyBox || []).map((b) => (
              <Card key={b.title}>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-slate-100 p-2">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{b.title}</div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {(b.bullets || []).map((x) => (
                        <li key={x} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-300" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Divider />

      {/* Proof */}
      <section id="proof" className="scroll-mt-24">
        <Container className="py-10">
          <SectionTitle
            eyebrow="Why work with us"
            title="Professional, direct, and consistent"
            subtitle="We’re building long-term partnerships and repeat closings — not one-off chaos."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Clean communication",
                text: "Clear yes/no. No ghosting. No vague maybes.",
              },
              {
                icon: Calculator,
                title: "Numbers-driven",
                text: "Repair scope + comps + exit strategy. Realistic assumptions.",
              },
              {
                icon: Handshake,
                title: "Win-win focus",
                text: "We want you paid and happy so you bring the next one.",
              },
            ].map((x) => (
              <Card key={x.title}>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-slate-100 p-2">
                    <x.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{x.title}</div>
                    <p className="mt-1 text-sm text-slate-600">{x.text}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="text-sm font-semibold">Deal-ready checklist</div>
              <p className="mt-1 text-sm text-slate-600">
                Include these and we can underwrite faster.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  "Photos (interior/exterior)",
                  "Repair notes or contractor bid",
                  "Comps / ARV estimate",
                  "Rent comps (if rental)",
                  "Occupancy + access info",
                  "Preferred closing date",
                ].map((x) => (
                  <div
                    key={x}
                    className="flex items-start gap-2 rounded-2xl border bg-slate-50 p-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <div className="text-sm text-slate-700">{x}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="text-sm font-semibold">Contact</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4" />
                  {CONTACT.location}
                </div>
                {hasPhone ? (
                  <a
                    className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
                    href={`tel:${CONTACT.phoneHref}`}
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT.phoneDisplay}
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="h-4 w-4" />
                    {CONTACT.phoneDisplay}
                  </div>
                )}
                <a
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
                  href={`mailto:${CONTACT.email}`}
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT.email}
                </a>
              </div>

              <div className="mt-5">
                <Button onClick={() => setOpenDeal(true)} className="w-full">
                  <Mail className="h-4 w-4" />
                  {CONTACT.secondaryCta}
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  variant="ghost"
                  onClick={() => setOpenOffer(true)}
                  className="w-full"
                >
                  <ChevronRight className="h-4 w-4" />
                  {CONTACT.cta}
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <Divider />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <Container className="py-10">
          <SectionTitle
            eyebrow="FAQ"
            title="Common questions"
            subtitle="Quick answers so you can move faster."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <Card key={f.q}>
                <div className="text-sm font-semibold">{f.q}</div>
                <div className="mt-2 text-sm text-slate-600">{f.a}</div>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border bg-slate-900 p-6 text-white shadow-sm">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-sm font-semibold">
                  Ready to send a deal?
                </div>
                <p className="mt-1 text-sm text-white/80">
                  Hit the button, submit the basics, and we’ll reply with next
                  steps.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Button
                  variant="subtle"
                  onClick={() => setOpenDeal(true)}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT.secondaryCta}
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => setOpenOffer(true)}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                  {CONTACT.cta}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SMS terms */}
      <section id="sms-consent" className="scroll-mt-24">
        <Container className="py-10">
          <SectionTitle
            eyebrow="SMS consent"
            title="SMS terms & consent"
            subtitle="If you provide a phone number, you agree to receive deal-related texts under the terms below."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <div className="text-sm font-semibold">How we use texts</div>
              <p className="mt-2 text-sm text-slate-600">
                {SMS_POLICY.purpose}
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium text-slate-700">Frequency:</span>{" "}
                  {SMS_POLICY.frequency}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Rates:</span>{" "}
                  {SMS_POLICY.rates}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Opt-out:</span>{" "}
                  {SMS_POLICY.optOut}
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-sm font-semibold">Privacy</div>
              <p className="mt-2 text-sm text-slate-600">
                {SMS_POLICY.privacy}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Note: This site submits deals via Formspree. Texts are used only
                for follow-up once we receive your submission.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <Container className="py-10">
          <div className="grid gap-8 md:grid-cols-3 items-start">
            <div className="mt-6 md:mt-2">
              <LogoMark />
              <p className="mt-3 text-sm text-slate-600">
                Investing with integrity and clarity. We aim for fast answers,
                clean closings, and long-term partnerships.
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <div className="text-sm font-semibold">Quick links</div>
              <div className="mt-3 grid gap-2 text-sm">
              {(NAV || []).map((n) => (
                  <a
                    key={n.id}
                    href={`#${n.id}`}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    {n.label}
                  </a>
                ))}
                <button
                  onClick={() => setOpenDeal(true)}
                  className="text-left text-slate-600 hover:text-slate-900"
                >
                  {CONTACT.secondaryCta}
                </button>
              </div>
            </div>

            <div className="md:pt-0">
              <div className="text-sm font-semibold">Contact</div>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {CONTACT.location}
                </div>
                {hasPhone ? (
                  <a
                    className="flex items-center gap-2 hover:text-slate-900"
                    href={`tel:${CONTACT.phoneHref}`}
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT.phoneDisplay}
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="h-4 w-4" />
                    {CONTACT.phoneDisplay}
                  </div>
                )}
                <a
                  className="flex items-center gap-2 hover:text-slate-900"
                  href={`mailto:${CONTACT.email}`}
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              © {new Date().getFullYear()} {CONTACT.brand}. All rights reserved.
              Thrive Higher Capital is a private investment group. Not a
              brokerage.
            </div>
            <div className="flex flex-wrap gap-4">
              <span>Privacy-friendly</span>
              <span aria-hidden>•</span>
              <span>No cookies required</span>
            </div>
          </div>
        </Container>
      </footer>

      {/* Modals */}
      <Modal
        open={openDeal}
        onClose={() => setOpenDeal(false)}
        title="Send a deal"
      >
        <DealForm onSubmitted={() => setOpenDeal(false)} />
      </Modal>

      <Modal
        open={openOffer}
        onClose={() => setOpenOffer(false)}
        title="Get a same-day offer (quick details)"
      >
        <div className="grid gap-4">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="text-sm font-semibold">Best way to start</div>
            <p className="mt-1 text-sm text-slate-600">
              Send the property address + your best estimate of
              repairs/condition. If you have comps, include them.
            </p>
          </div>
          <DealForm onSubmitted={() => setOpenOffer(false)} />
        </div>
      </Modal>

      {/* Mobile quick bar */}
      <div className="fixed bottom-3 left-0 right-0 z-30 md:hidden">
        <Container>
          <div className="flex gap-2 rounded-3xl border bg-white/90 p-2 shadow-lg backdrop-blur">
            <Button
              variant="ghost"
              onClick={() => setOpenDeal(true)}
              className="flex-1"
            >
              <Mail className="h-4 w-4" />
              Send deal
            </Button>
            <Button onClick={() => setOpenOffer(true)} className="flex-1">
              <Sparkles className="h-4 w-4" />
              Offer
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
}

/* Manual smoke tests (quick checklist)
1) Fill Name + Email + Address -> Submit becomes enabled.
2) If you enter a Phone number, SMS consent must be checked.
3) Submission should go to Formspree (not mailto).
4) Phone links should be clickable everywhere (tel:+12062031230).
*/
{
  /* Page footer / debug stamp */
}
<div className="mt-4 text-center text-[10px] text-slate-400">
  build: 2026-01-12-3
</div>;
