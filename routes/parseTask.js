export const parseTask = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCfZF72lFFH9bWnpiF97crIPCdyDjCzx68`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `Extract the task title and due date from this sentence: "${prompt}". Return in this JSON format: {"title": "...", "dueDate": "..."}` }]
          }
        ]
      })
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Attempt to parse the JSON response from Gemini
    const jsonResponse = JSON.parse(text);
    res.json(jsonResponse);
  } catch (err) {
    console.error("AI parsing failed:", err.message);
    res.status(500).json({ error: "AI parsing error" });
  }
}
