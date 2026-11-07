
import { NextResponse } from "next/server";
import { questions } from "@/data/questions";
import { getLevel } from "@/lib/levels";

export async function POST(req: Request) {
  try {
    const { user, answers } = await req.json();

    if (!user?.email || !Array.isArray(answers)) {
      return NextResponse.json(
        { ok: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    if (answers.length !== questions.length || answers.some(
      (a: string | null) => !["a", "b", "c"].includes(a ?? "")
    )) {
      return NextResponse.json(
        { ok: false, error: "Incomplete answers" },
        { status: 400 }
      );
    }

    const score = answers.filter(
      (a: string, i: number) => a === questions[i]?.a
    ).length;

    const level = getLevel(score);

    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      phone: user.phone || "",
      score,
      level: level.cefr,
      levelName: level.name,
    };

    const url = process.env.SHEETS_WEBHOOK_URL;

    if (!url) {
      throw new Error("SHEETS_WEBHOOK_URL is missing");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await response.text();

    console.log("Google Sheets response:", result);

    if (!response.ok) {
      throw new Error(`Google Sheets HTTP error: ${response.status}`);
    }

    const confirmation = JSON.parse(result);

    if (!confirmation.ok) {
      throw new Error("Google Sheets did not confirm saving");
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Submission error:", err);

    return NextResponse.json(
      { ok: false, error: "Could not save your test result" },
      { status: 500 }
    );
  }
}
