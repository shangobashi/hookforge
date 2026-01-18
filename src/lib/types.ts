export type GenerationResult = {
  hooks: string[];
  angles: string[];
  weeklyCalendar: Array<{
    day: string;
    post: string;
  }>;
  threadOutline: string[];
  bio: string;
  cta: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
