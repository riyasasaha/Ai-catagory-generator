const { db } = require('./db');
const { callGemini } = require('./ai.service');

const categorizeProduct = async (req, res) => {
    const { name, description, allowedCategories } = req.body;

    if (!name || !description || !allowedCategories || !Array.isArray(allowedCategories)) {
        return res.status(400).json({ error: 'Missing name, description, or allowedCategories (must be array)' });
    }

    try {
        const aiResponseData = await callGemini({ name, description, allowedCategories });
        const { systemPrompt, userInput, rawAiResponse } = aiResponseData;

        let parsedData = null;
        let statusCode = 200;

        try {
            parsedData = JSON.parse(rawAiResponse);

            // Additional basic validation
            if (!parsedData.primary_category || !parsedData.seo_tags) {
                throw new Error("Missing required JSON fields from AI");
            }
        } catch (parseError) {
            console.error("Failed to parse Gemini AI JSON Response:", rawAiResponse);
            statusCode = 500;

            // Log the failure
            db.run(
                `INSERT INTO AI_Logs (system_prompt, user_input, raw_ai_response, status_code) VALUES (?, ?, ?, ?)`,
                [systemPrompt, userInput, rawAiResponse, statusCode]
            );

            return res.status(500).json({
                error: 'AI returned malformed or unexpected data.',
                raw_response: rawAiResponse
            });
        }

        // Insert Log successfully
        db.run(
            `INSERT INTO AI_Logs (system_prompt, user_input, raw_ai_response, status_code) VALUES (?, ?, ?, ?)`,
            [systemPrompt, userInput, rawAiResponse, statusCode]
        );

        // Insert Product Output
        db.run(
            `INSERT INTO Products (name, description, primary_category, sub_category, seo_tags, sustainability_filters) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name,
                description,
                parsedData.primary_category,
                parsedData.sub_category,
                JSON.stringify(parsedData.seo_tags || []),
                JSON.stringify(parsedData.sustainability_filters || [])
            ],
            function (err) {
                if (err) {
                    console.error("Error saving product to DB:", err);
                    return res.status(500).json({ error: "Failed to save categorized product." });
                }

                // Return structured data along with DB ID.
                res.status(200).json({
                    id: this.lastID,
                    name,
                    description,
                    ...parsedData
                });
            }
        );

    } catch (error) {
        console.error("Internal API error:", error);
        res.status(500).json({ error: 'Failed to process categorization request. Ensure your GEMINI_API_KEY is configured.' });
    }
};

const getLogs = (req, res) => {
    db.all(`SELECT * FROM AI_Logs ORDER BY timestamp DESC LIMIT 50`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch logs" });
        }
        res.json({ logs: rows });
    });
};

module.exports = { categorizeProduct, getLogs };
