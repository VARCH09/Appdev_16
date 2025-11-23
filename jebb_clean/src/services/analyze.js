const OPENROUTER_KEY = API_key

export async function analyzeSpendingAI(transactions) {
  const text = transactions
    .map(t => `${t.type} ₹${t.amount} in ${t.category}`)
    .join("\n");

  const prompt = `
Analyze this spending data and summarize where most money is spent:

${text}

Give a short, clear summary with bullet points.
  `;

  try {
    const res = await fetch("https://api.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
      })
    });

    const json = await res.json();
    return json?.choices?.[0]?.message?.content || "No analysis available.";
  } catch (err) {
    return "AI Error: " + err.message;
  }
}
