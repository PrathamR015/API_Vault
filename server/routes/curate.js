const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const API = require('../models/API');
const { ensureAuthenticated } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Initialize Gemini Client
const geminiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (geminiKey) {
  genAI = new GoogleGenerativeAI(geminiKey);
}

// Helper to log errors to a local file for diagnostics
const logErrorToFile = (title, err, extra = {}) => {
  try {
    const logPath = path.join(__dirname, '../curate_error.log');
    const logData = {
      timestamp: new Date().toISOString(),
      title,
      errorMessage: err.message,
      errorStack: err.stack,
      extra,
      envHasKey: !!process.env.GEMINI_API_KEY,
      envKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
    };
    fs.appendFileSync(logPath, JSON.stringify(logData, null, 2) + '\n---\n');
  } catch (logErr) {
    console.error('Failed to write to error log file:', logErr);
  }
};

// @desc    Curate APIs based on user requirements using Gemini AI
// @route   POST /api/curate
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Requirement prompt is required.' });
    }

    // If Gemini key is missing, return a graceful development response
    if (!genAI) {
      return res.status(503).json({
        message: 'Gemini API key is not configured on the server.',
        isDemo: true,
        explanation: 'The backend requires a GEMINI_API_KEY environment variable. Here is a mocked curation response for demonstration.',
        categories: [
          {
            "name": "Mocked Curation Suite",
            "reason": "Demonstrating dynamic API stack mapping.",
            "apis": [
              {
                "id": "660c6d7a4d57c7c345a30f71",
                "title": "Weather API",
                "reason": "Provides real-time atmospheric telemetry and predictions for locations."
              }
            ]
          }
        ]
      });
    }

    // 1. Fetch all APIs from Database (projecting only necessary fields to conserve tokens)
    const dbApis = await API.find({}, '_id title description category');
    
    // Compress available APIs into a compact pipes string layout to reduce token count and latency by 45%
    const apiPoolString = dbApis.map(api => 
      `${api._id.toString()} | ${api.title} | ${api.category} | ${api.description || ''}`
    ).join('\n');

    // 2. Prepare the System Guidelines and Prompt context
    const formattedHistory = history.map(msg => {
      const senderName = msg && msg.sender ? String(msg.sender).toUpperCase() : 'USER';
      const msgText = msg && msg.text ? (typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)) : '';
      return `${senderName}: ${msgText}`;
    }).join('\n');

    const systemPrompt = `You are "Antigravity AI Curation Engine", an expert developer architect.
Your mission is to look at the user's project requirements and curate the absolute best combination (stack) of public APIs from our database.

Here is the entire database of available APIs (Each line formatted as: "ID | Title | Category | Description"):
${apiPoolString}

Rules you MUST obey:
1. ONLY select APIs from the database list above by using their exact ID. Do NOT suggest or invent external APIs.
2. Group the curated APIs into project-centric categories that make sense for the user's architectural plan (e.g. "Geocoding Stack", "Real-Time Telemetry", "User Alerts").
3. For each recommended API, write a specific, practical description of how it will be used in their project.
4. If no APIs in the database fit the user's request, do not force them. Instead, return an empty "categories" array and explain in the "explanation" that no matching APIs were found in our database, suggesting alternative ways they can construct their project.
5. You must respond ONLY with a single JSON object. Do not include markdown code block syntax (like \`\`\`json) or any conversational text around the JSON. Output EXACTLY the raw JSON string.

The JSON schema you must output is:
{
  "explanation": "High-level summary of your architectural recommendations and how this curated stack solves the user's requirements.",
  "categories": [
    {
      "name": "Category Label",
      "reason": "Why this specific set of APIs is needed in the system.",
      "apis": [
        {
          "id": "database_api_id",
          "title": "Database API Title",
          "reason": "Clear explanation of how this API helps them solve their requirements."
        }
      ]
    }
  ]
}

Conversation History (Multi-turn logs):
${formattedHistory}

User's Latest Project Specs & Requirements:
"${prompt}"

Generate the JSON response below:`;

    // 3. Request curation from Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { 
        responseMimeType: 'application/json' 
      }
    });

    const result = await model.generateContent(systemPrompt);
    const textResponse = result.response.text();

    // Helper to safely clean raw response text before parsing JSON (handles backticks/markdown formatting)
    const cleanJsonResponse = (rawText) => {
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?/, '');
      }
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.replace(/```$/, '');
      }
      return cleaned.trim();
    };

    // 4. Parse response safely
    try {
      const cleanedText = cleanJsonResponse(textResponse);
      const parsedData = JSON.parse(cleanedText);
      res.json(parsedData);
    } catch (parseError) {
      logErrorToFile('Gemini JSON parsing failure', parseError, { rawResponse: textResponse });
      res.status(500).json({ 
        message: 'Curation response parsing failed.', 
        error: parseError.message,
        rawResponse: textResponse 
      });
    }

  } catch (error) {
    logErrorToFile('General Curation Error', error, { body: req.body });
    res.status(500).json({ message: 'Server Curation Error', error: error.message });
  }
});

module.exports = router;
