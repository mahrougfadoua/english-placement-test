"use client";
import { useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent, InputHTMLAttributes } from "react";
import { questions } from "@/data/questions";
import { getLevel, LEVELS } from "@/lib/levels";

const LETTERS = ["a", "b", "c"] as const;
type Letter = (typeof LETTERS)[number];
type Stage = "register" | "test" | "result";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  phone: string;
};
type Errors = Partial<Record<keyof User, string>>;

const EMPTY_USER: User = { firstName: "", lastName: "", email: "", age: "", phone: "" };

const card =
  "anim-fade-up mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10";

export default function Home() {
  const [stage, setStage] = useState<Stage>("register");
  const [user, setUser] = useState<User>(EMPTY_USER);
  const [errors, setErrors] = useState<Errors>({});
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(Letter | null)[]>(
    Array(questions.length).fill(null)
  );

  const total = questions.length;
  const score = answers.filter((a, i) => a === questions[i].a).length;
  const level = getLevel(score);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const validate = (): boolean => {
    const e: Errors = {};
    if (!user.firstName.trim()) e.firstName = "Required";
    if (!user.lastName.trim()) e.lastName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(user.email)) e.email = "Enter a valid email";
    const age = Number(user.age);
    if (!age || age < 5 || age > 100) e.age = "Enter a valid age";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const start = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setStage("test");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const choose = (letter: Letter) => {
    const copy = [...answers];
    copy[current] = letter;
    setAnswers(copy);
  };

  
  const submittedRef = useRef(false);

  // Save in the background (with retries) so the student never waits.
  const saveResult = async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, answers }),
          keepalive: true,
        });
        const result = await response.json();
        if (response.ok && result.ok) return;
      } catch (err) {
        console.error("Submit attempt failed:", err);
      }
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
    console.error("Result could not be saved after 3 attempts", { user, answers });
  };

  const finish = () => {
    if (submittedRef.current) return; // ignore double clicks
    submittedRef.current = true;
    setStage("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
    void saveResult();
  };

  const restart = () => {
    submittedRef.current = false;
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setUser(EMPTY_USER);
    setErrors({});
    setStage("register");
  };

  /* ---------- REGISTER ---------- */
  if (stage === "register") {
    return (
      <div className="anim-fade-up grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 md:grid-cols-5">
        {/* Left panel */}
        <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50/70 p-8 sm:p-10 md:col-span-2 md:border-b-0 md:border-r">
          <div className="relative flex h-full flex-col">
            <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-aqua-dark shadow-sm ring-1 ring-aqua/30">
              CEFR Assessment
            </span>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-navy sm:text-[2rem]">
              Find out your real English level.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              A short placement test to measure your English and recommend the
              right course for you.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              {[
                [`${total} questions`, "Grammar, vocabulary & usage"],
                ["About 15 minutes", "Go at your own pace"],
                ["Instant result", "Your CEFR level, A1 to C1"],
              ].map(([t, s]) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-aqua text-white">
                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                      <path d="M7.7 13.3 4.4 10l-1.4 1.4 4.7 4.7L17 6.8l-1.4-1.4z" />
                    </svg>
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">{t}</span>
                    <span className="text-slate-500">{s}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-1.5 pt-10">
              {LEVELS.map((l) => (
                <span
                  key={l.cefr}
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-navy ring-1 ring-aqua/30"
                >
                  {l.cefr}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={start} noValidate className="p-8 sm:p-10 md:col-span-3">
          <h3 className="font-heading text-2xl font-extrabold text-navy">Your details</h3>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the form below to begin the test.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First name" name="firstName" value={user.firstName} onChange={onChange} error={errors.firstName} />
            <Field label="Last name" name="lastName" value={user.lastName} onChange={onChange} error={errors.lastName} />
            <Field label="Email" name="email" type="email" value={user.email} onChange={onChange} error={errors.email} full />
            <Field label="Age" name="age" type="number" value={user.age} onChange={onChange} error={errors.age} />
            <Field label="Phone (optional)" name="phone" type="tel" value={user.phone} onChange={onChange} />
          </div>

          <button
            type="submit"
            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-navy to-aqua-dark py-3.5 font-semibold text-white shadow-lg shadow-aqua/30 transition hover:brightness-110"
          >
            Start the test
            <span className="transition group-hover:translate-x-1">→</span>
          </button>
        </form>
      </div>
    );
  }

  /* ---------- TEST ---------- */
  if (stage === "test") {
    const q = questions[current];
    const parts = q.q.split("........");
    const isLast = current === total - 1;
    const answered = answers.filter(Boolean).length;

    return (
      <div className={card}>
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>
              Question <span className="text-navy">{current + 1}</span> of {total}
            </span>
            <span>{answered} answered</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-aqua-soft">
            <div
              className="h-full rounded-full bg-gradient-to-r from-navy to-aqua transition-all duration-500"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div key={current} className="anim-slide-in">
          <p className="mb-7 font-heading text-xl font-bold leading-relaxed text-navy sm:text-2xl">
            {parts.map((p, i) => (
              <span key={i}>
                {p}
                {i < parts.length - 1 && (
                  <span className="mx-1 inline-block w-14 translate-y-0.5 border-b-[3px] border-aqua" />
                )}
              </span>
            ))}
          </p>

          <div className="space-y-3">
            {q.o.map((opt, i) => {
              const selected = answers[current] === LETTERS[i];
              return (
                <button
                  key={i}
                  onClick={() => choose(LETTERS[i])}
                  className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition ${
                    selected
                      ? "border-aqua bg-aqua-soft ring-2 ring-aqua/25"
                      : "border-slate-200 bg-white hover:border-aqua/60 hover:bg-aqua-mist"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 flex-none place-items-center rounded-lg text-sm font-bold uppercase transition ${
                      selected ? "bg-navy text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="flex-1 text-base font-medium text-slate-800">{opt}</span>
                  {selected && (
                    <svg viewBox="0 0 20 20" className="h-5 w-5 text-aqua-dark" fill="currentColor">
                      <path d="M7.7 13.3 4.4 10l-1.4 1.4 4.7 4.7L17 6.8l-1.4-1.4z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="rounded-xl px-4 py-3 font-semibold text-slate-600 transition hover:bg-aqua-soft disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ← Previous
          </button>

          {isLast ? (
            <button
              disabled={answered < total}
              onClick={finish}
              className="rounded-xl bg-aqua-dark px-8 py-3 font-semibold text-white shadow-lg shadow-aqua/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Finish
            </button>
          ) : (
            <button
              disabled={!answers[current]}
              onClick={() => setCurrent(current + 1)}
              className="rounded-xl bg-gradient-to-r from-navy to-aqua-dark px-8 py-3 font-semibold text-white shadow-lg shadow-aqua/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next →
            </button>
          )}
        </div>

        {isLast && answered < total && (
          <p className="mt-3 text-sm text-rose-600">
            Please answer all questions to finish ({total - answered} left).
          </p>
        )}

        {/* Question navigator */}
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {answers.map((a, i) => (
            <button
              key={i}
              aria-label={`Go to question ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === current
                  ? "scale-150 bg-aqua"
                  : a
                  ? "bg-navy"
                  : "bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- RESULT ---------- */
  const offset = 339.3 * (1 - score / total);
  const levelIndex = LEVELS.findIndex((l) => l.cefr === level.cefr);

  return (
    <div className={`${card} text-center`}>
      <span className="inline-block rounded-full bg-aqua-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-aqua-dark">
        Your result
      </span>
      <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">
        Well done, {user.firstName}.
      </h2>
      <p className="mt-1 text-slate-500">Here is your English level.</p>

      <div className="relative mx-auto my-8 h-56 w-56">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#12305a" />
              <stop offset="100%" stopColor="#22c1e6" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e8f8fd" strokeWidth="8" />
          <circle
            className="ring-fg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ ["--offset" as string]: offset } as CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-6xl font-extrabold leading-none text-navy">
            {level.cefr}
          </span>
          <span className="mt-2 text-sm font-semibold text-slate-500">
            {score} / {total} correct
          </span>
        </div>
      </div>

      <p className="font-heading text-2xl font-bold text-navy">{level.name}</p>
      <p className="mx-auto mt-2 max-w-md text-slate-500">{level.desc}</p>

      {/* Scale */}
      <div className="mt-9 grid grid-cols-5 gap-2">
        {LEVELS.map((l, i) => {
          const active = i === levelIndex;
          const passed = i < levelIndex;
          return (
            <div key={l.cefr}>
              <div
                className={`h-2 rounded-full ${
                  active
                    ? "bg-gradient-to-r from-navy to-aqua"
                    : passed
                    ? "bg-navy"
                    : "bg-slate-200"
                }`}
              />
              <p
                className={`mt-2 text-sm font-bold ${
                  active ? "text-navy" : "text-slate-400"
                }`}
              >
                {l.cefr}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-aqua/30 bg-aqua-soft px-5 py-4 text-sm text-navy">
        Our team will contact you to recommend the best course for your level.
      </div>

      <button
        onClick={restart}
        className="mt-6 rounded-xl bg-gradient-to-r from-navy to-aqua-dark px-8 py-3 font-semibold text-white shadow-lg shadow-aqua/25 transition hover:brightness-110"
      >
        Take the test again
      </button>
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  full?: boolean;
};

function Field({ label, error, full, ...props }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label htmlFor={props.name} className="text-sm font-semibold text-navy">
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className={`rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? "border-rose-400 focus:ring-rose-100"
            : "border-slate-300 focus:border-aqua focus:ring-aqua/20"
        }`}
      />
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </div>
  );
}