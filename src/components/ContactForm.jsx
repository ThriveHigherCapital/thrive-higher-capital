return (
  <form
    onSubmit={handleSubmit}
    className="mt-6 space-y-4 border-4 border-red-500 bg-yellow-100 p-4"
  >
    <div className="rounded-md bg-blue-100 p-2 text-sm font-semibold text-blue-900">
      FORM TEST VISIBLE
    </div>

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

    <input type="text" name="_gotcha" className="hidden" />

    <button
      type="submit"
      disabled={status === "sending"}
      className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed"
    >
     {status === "sending" ? "Sending..." : "Submit"}
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

