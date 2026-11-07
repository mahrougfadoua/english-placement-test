export type Level = {
  min: number;
  max: number;
  cefr: string;
  name: string;
  desc: string;
};

export const LEVELS: Level[] = [
  { min: 0,  max: 18, cefr: "A1", name: "Beginner",           desc: "You can understand and use very basic expressions." },
  { min: 19, max: 25, cefr: "A2", name: "Elementary",         desc: "You can handle simple everyday situations and short conversations." },
  { min: 26, max: 32, cefr: "B1", name: "Intermediate",       desc: "You can deal with most situations and express opinions on familiar topics." },
  { min: 33, max: 50, cefr: "B2", name: "Upper-Intermediate", desc: "You can communicate fluently on a wide range of topics." },
];

export const getLevel = (score: number): Level =>
  LEVELS.find((l) => score >= l.min && score <= l.max) ?? LEVELS[0];