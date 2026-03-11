# Sustainable Commerce AI Categorization Platform

## Overview
This full-stack application utilizes the React (Vite) frontend and Node.js (Express) backend to power an applied AI categorization system for sustainable commerce products. It takes raw product names and descriptions, and securely calls Google's Gemini Large Language Model to categorize them accurately, assigning SEO tags and sustainability filters.

## Features
- **Strict JSON Generation**: The AI is instructed via rigorous system prompts to output purely structured JSON.
- **SQL Auditing**: Every AI request and response is logged into a local SQLite database for compliance and auditing.
- **Earthy UI Theme**: Built with Tailwind CSS Version 4 to evoke a premium sustainable feel.
- **Concurrent Dev Environment**: A single root workspace allows spinning up both client/server quickly.

## Setup Instructions
1. Navigate to the `server` directory and create a `.env` file (if you haven't).
   \`\`\`env
   PORT=5000
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   \`\`\`
2. From the root directory (\`ecommerce-ai\`), ensure all dependencies are installed, then run the project:
   \`\`\`bash
   npm start
   \`\`\`
3. Visit the frontend at `http://localhost:5173`.

## Architecture & Responsibilities
- **Frontend (`/client`)**: Handles the user interface, captures the user's input, validates it, and displays the structured payload and audit logs cleanly using React, Tailwind V4, and Lucide Icons.
- **Backend (`/server`)**: 
  - Express endpoints coordinate incoming HTTP requests.
  - SQLite creates and maintains the `Products` classification table and `AI_Logs` analytics table.
  - `ai.service.js` is fully decoupled from the routing logic and encapsulates all Google Gemini interaction mechanics (error handling, JSON stripping, config).

## AI Prompt Design Explanation
The application employs **Prompt Engineering best practices** to guarantee that Google's Gemini LLM returns reliable, machine-readable JSON. Key design choices include:
1. **Explicit Schema Definition**: The prompt explicitly maps out the expected JSON structure (`primary_category`, `sub_category`, `seo_tags`, `sustainability_filters`).
2. **Business Constraints**: The LLM is dynamically passed a list of allowed `primary_categories` from the frontend and is strictly instructed to *"choose exactly from the allowed primary categories"*.
3. **Format Enforcement**: The prompt forbids the LLM from adding markdown backticks (like \`\`\`json) and tells it the output *"MUST parse cleanly with JSON.parse()"*, heavily reducing formatting hallucinations.
4. **Context Provision**: The system combines a rigid "System Prompt" containing the rules with a segregated "\n\nUSER INPUT:\n" block mapping the raw product name and description dynamically.
