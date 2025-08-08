import * as chrono from "chrono-node";

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
                  text: `Extract ONLY the task title from this sentence: "${prompt}".
Do NOT include any due date or time in the title.
Return ONLY a raw JSON object in this exact format:
{"title": "..."}

No explanation, no extra text.`,
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

    let jsonResponse = JSON.parse(match[0]);

    // Step 2: Extract date using chrono-node
    const dateResult = chrono.parseDate(prompt);
    if (dateResult) {
      const dd = String(dateResult.getDate()).padStart(2, "0");
      const mm = String(dateResult.getMonth() + 1).padStart(2, "0");
      const yyyy = dateResult.getFullYear();
      jsonResponse.dueDate = `${dd}-${mm}-${yyyy}`;
    } else {
      jsonResponse.dueDate = null;
    }

    res.json(jsonResponse);
  } catch (err) {
    console.error("AI parsing failed:", err.message);
    res.status(500).json({ error: "AI parsing error", details: err.message });
  }
};
