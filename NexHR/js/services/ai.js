import { store } from '../data/store.js';

export const ai = {
    // Cache the working model to avoid repeated lookups
    workingModel: null,

    async getBestModel(apiKey) {
        if (this.workingModel) return this.workingModel;

        try {
            console.log('Discovering available AI models...');
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error.message);
            if (!data.models) throw new Error('No models found for this key.');

            const models = data.models;
            // Strategy: Prefer 1.5 Pro -> 1.5 Flash -> 1.0 Pro -> Any Gemini
            const priority = [
                'models/gemini-1.5-pro',
                'models/gemini-1.5-pro-001',
                'models/gemini-1.5-flash',
                'models/gemini-1.5-flash-001',
                'models/gemini-pro'
            ];

            let selected = null;

            // 1. Try Priority List
            for (const id of priority) {
                const match = models.find(m => m.name === id && m.supportedGenerationMethods?.includes('generateContent'));
                if (match) {
                    selected = match.name;
                    break;
                }
            }

            // 2. Fallback: Any model that supports generation
            if (!selected) {
                const fallback = models.find(m => m.name.includes('gemini') && m.supportedGenerationMethods?.includes('generateContent'));
                if (fallback) selected = fallback.name;
            }

            if (!selected) throw new Error('No compatible Gemini model found.');

            console.log('Selected AI Model:', selected);
            this.workingModel = selected;
            return selected;

        } catch (e) {
            console.error('Model Discovery Failed:', e);
            // Ultimate fallback if discovery totally fails (e.g. network/permissions)
            return 'models/gemini-1.5-pro';
        }
    },

    async completion(prompt, parts = []) {
        const apiKey = store.settings?.apiKey;

        if (!apiKey) {
            throw new Error('API Key missing. Please configure it in Settings.');
        }

        // Dynamically find the right model
        const modelName = await this.getBestModel(apiKey);
        // modelName already includes "models/" prefix from API, or validation logic handles it.
        // The endpoint usually expects: models/MODEL_ID:generateContent
        // If discovery returned "models/gemini-1.5-pro", we are good.

        const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

        // Build parts: Text prompt + any attachments
        const contentParts = [{ text: prompt }, ...parts];

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: contentParts }]
                })
            });

            const data = await response.json();

            if (data.error) {
                // If it fails, maybe clear cache and retry? 
                // For now, just throw.
                throw new Error(data.error.message || 'AI Error');
            }

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('AI returned no content. potentially safety block.');
            }

            return data.candidates[0].content.parts[0].text;

        } catch (e) {
            console.error('AI Call Failed', e);
            throw e;
        }
    },

    async parseResume(text) {
        // Updated to request scoring
        const prompt = `
            You are an expert ATS (Applicant Tracking System) AI. 
            Analyze the following resume text.
            
            Extract:
            1. "name" (string)
            2. "role" (string, inferred from experience)
            3. "skills" (array of strings)
            4. "matchScore" (integer 0-100, where 100 perfectly matches a senior professional standard)
            5. "analysis" (string, a brief 1-sentence summary of why this score was given)

            Return ONLY raw JSON. No markdown formatting.
            
            Resume Text:
            ${text}
        `;
        const result = await this.completion(prompt);
        return this.cleanJson(result);
    },

    async parseResumeFromPdf(base64Data) {
        const prompt = `
            You are an expert ATS AI. Analyze this PDF resume.
            Extract: "name", "role", "skills", "matchScore" (0-100), and "analysis" (1-sentence summary).
            Return ONLY raw JSON. No markdown formatting.
        `;

        const pdfPart = {
            inlineData: {
                mimeType: "application/pdf",
                data: base64Data
            }
        };

        const result = await this.completion(prompt, [pdfPart]);
        return this.cleanJson(result);
    },

    cleanJson(text) {
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    },

    async chat(history, userMsg) {
        // 1. Gather App Context
        const candidates = store.candidates || [];
        const stats = store.stats || {};

        const contextData = {
            candidateCount: candidates.length,
            candidates: candidates.map(c => `${c.name} (${c.role}): ${c.status}, Match: ${c.matchScore}%`).join('\n'),
            openPositions: stats.openPos
        };

        const systemPrompt = `
            You are NexHR, an advanced AI Assistant for this HR Platform.
            
            CURRENT DATA CONTEXT:
            - Total Candidates: ${contextData.candidateCount}
            - Open Positions: ${contextData.openPositions}
            - Candidate List:
            ${contextData.candidates || "No candidates yet."}

            USER REQUEST: ${userMsg}

            INSTRUCTIONS:
            - Answer the user's question based on the Context above if relevant.
            - If they ask about candidates, summarize the list provided.
            - If generic HR question, answer professionally.
            - Be concise and helpful.
        `;

        // Note: For full chat history, we'd structure 'contents' differently, keeping it simple for now.
        return await this.completion(systemPrompt);
    },

    async checkModels() {
        const apiKey = store.settings?.apiKey;
        if (!apiKey) return console.error('No API Key');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        console.log('AVAILABLE MODELS:', data);
        alert('Check Console for List of Available Models');
    },

    resetModel() {
        this.workingModel = null;
        console.log('AI Model Cache Cleared');
    }
};

// Expose AI for debugging
window.ai = ai;

