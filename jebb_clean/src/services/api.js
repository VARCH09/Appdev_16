import Constants from "expo-constants";

const OPENROUTER_KEY = Constants.expoConfig.extra.openrouterKey;

export async function analyzeSpending(text) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a financial analysis assistant." },
          { role: "user", content: text }
        ],
      }),
    });

    const json = await response.json();
    return json.choices?.[0]?.message?.content || "No response";

  } catch (err) {
    console.error("AI Error:", err);
    return "AI Error: " + err.message;
  }
}
