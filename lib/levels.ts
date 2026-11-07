// ⚠️ راجع جدول التنقيط الرسمي تاع Outcomes (في Teacher's Guide) وعدّل الحدود إذا اختلفت
export type Level = {
  min: number;
  max: number;
  cefr: string;
  name: string;
  desc: string;
};

export const LEVELS: Level[] = [
  { min: 0,  max: 10, cefr: "A1", name: "Beginner",           desc: "You can understand and use very basic expressions." },
  { min: 11, max: 20, cefr: "A2", name: "Elementary",         desc: "You can handle simple everyday situations and short conversations." },
  { min: 21, max: 30, cefr: "B1", name: "Intermediate",       desc: "You can deal with most situations and express opinions on familiar topics." },
  { min: 31, max: 40, cefr: "B2", name: "Upper-Intermediate", desc: "You can communicate fluently on a wide range of topics." },
  { min: 41, max: 50, cefr: "C1", name: "Advanced",           desc: "You can use English flexibly for academic and professional purposes." },
];

export const getLevel = (score: number): Level =>
  LEVELS.find((l) => score >= l.min && score <= l.max) ?? LEVELS[0];