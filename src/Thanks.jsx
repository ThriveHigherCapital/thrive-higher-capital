import React from "react";

export default function Thanks() {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">Thank you!</h1>
        <p className="mt-3 text-slate-600">
          We received your submission. If you included a phone number or email,
          we’ll follow up soon.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={base}
            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            Back to Home
          </a>

          <a
            href={base + "#faq"}
            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-slate-900 hover:bg-slate-50"
          >
            View FAQ
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-900">What’s next?</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>We review the details and confirm basics.</li>
            <li>If it’s a fit, we’ll reach out with next steps.</li>
            <li>We aim for clear, fast communication.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
