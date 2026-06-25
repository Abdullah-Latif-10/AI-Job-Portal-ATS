/**
 * Helper to call Gemini API and parse details from a resume file buffer.
 */
const parseResumeWithGemini = async (fileBuffer, mimeType) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment. Skipping AI parsing and using mock parsing.");
    return null;
  }

  try {
    // Encode the buffer to base64
    const base64Data = fileBuffer.toString('base64');
    
    // API endpoint for Gemini 2.5 Flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `You are an expert AI recruiter and ATS system.
Analyze the attached resume and extract the key profile information.
Return a JSON object containing the following keys and structures:
{
  "headline": "A brief professional headline (e.g. 'Senior Full-Stack Engineer with 5+ years of experience')",
  "phone": "Extract phone number if present, otherwise default to empty string",
  "location": "Extract city/state/country location if present, otherwise default to empty string",
  "summary": "A clean 2-3 sentence professional summary summarizing their experience and background",
  "experienceLevel": "One of: Entry, Mid, Senior, Lead, Executive — based on years and seniority of roles",
  "skills": ["Array of key technical and soft skills found (e.g., 'React', 'Node.js', 'Project Management')"],
  "experience": [
    {
      "role": "Job title/role (Strictly required. Use 'N/A' if not found)",
      "company": "Company name (Strictly required. Use 'N/A' if not found)",
      "period": "Employment period (e.g. 'Jan 2021 - Present') (Strictly required. Use 'N/A' if not found)"
    }
  ],
  "education": [
    {
      "degree": "Degree earned (e.g. 'B.S. in Computer Science') (Strictly required. Use 'N/A' if not found)",
      "school": "University/School name (Strictly required. Use 'N/A' if not found)",
      "period": "Period attended (e.g. '2017 - 2021') (Strictly required. Use 'N/A' if not found)"
    }
  ]
}

Provide ONLY the valid JSON object in the response. Do not wrap it in markdown code blocks or add any other text.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) {
      throw new Error("No text content returned from Gemini API");
    }

    // Parse the JSON output
    const profileData = JSON.parse(textOutput.trim());
    return profileData;
  } catch (error) {
    console.error("Error parsing resume with Gemini API:", error);
    return null;
  }
};

module.exports = {
  parseResumeWithGemini
};
