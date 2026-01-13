import React, { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqayvpq";

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [status, setStatus] = useState("idle");
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

  // Optional reCAPTCHA v3 token
if (executeRecaptcha) {
    try {
      const token = await executeRecaptcha("contact_form");
      console.log("reCAPTCHA token length:", token ? token.length : "NO TOKEN");
      formData.append("g-recaptcha-response", token);
    } catch {
      console.log("reCAPTCHA failed to execute");
      // continue without blocking
    }
  }  

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-4 border-red-500 bg-yellow-100 p-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          name="name"
          required
          placeholder="Your name"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>
  
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>
  
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Your message"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>
  
      {/* Honeypot */}
      <input type="text" name="_gotcha" className="hidden" />
  
      <button
        type="submit"
        disabled={status === "submitting" || !recaptchaReady}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {!recaptchaReady
          ? "reCAPTCHA loading..."
          : status === "submitting"
          ? "Sending..."
          : "Send Message"}
      </button>
  
      {status === "success" && (
        <p className="text-sm font-medium text-green-700">
          Message sent successfully.
        </p>
      )}
  
      {status === "error" && (
        <p className="text-sm font-medium text-red-700">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
  
}

