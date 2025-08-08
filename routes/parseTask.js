export const parseTask = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Extract the task title and due date(in Date format dd-mm-yyy) from this sentence: "${prompt}". ONLY return a raw JSON object in this format:\n\n{"title": "...", "dueDate": "..."}\n\nNo explanation.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Gemini response missing expected text");

    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("No JSON found in Gemini response text");

    const jsonResponse = JSON.parse(match[0]);
    res.json(jsonResponse);
  } catch (err) {
    console.error("AI parsing failed:", err.message);
    res.status(500).json({ error: "AI parsing error", details: err.message });
  }
};
