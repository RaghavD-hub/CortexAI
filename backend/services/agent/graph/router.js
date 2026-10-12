import { getModel } from "../config/llmModels.js";

export const router = async (state) => {
  const selectedAgent = state.agent ? state.agent.trim().toLowerCase() : "auto";
  if (selectedAgent && selectedAgent !== "auto") {
    return {
      ...state,
      agent: selectedAgent,
    };
  }

  if (state.file) {
    if (state.file.mimtype == "application/pdf") {
      return {
        ...state,
        agent: "pdfRag",
      };
    }

    if (state.file.mimtype.startsWith("image/")) {
      return {
        ...state,
        agent: "imageAnalyzer",
      };
    }
  }

  const llm = await getModel("router");
  const prompt = `You are an agent router
    
Available agents:
- chat
- search
- coding
- pdf
- ppt
- vision

Rules:

chat:
General conversation, explanations, learning, Q&A, general text prompts.

search:
Current events, latest information, news, recent developments, internet lookup.

coding:
Generate code, debug code, build projects, architecture, API design.

pdf:
Questions about generating PDFs, document summaries, PDF files.

ppt:
Generating PPTs, PowerPoint, presentations, slideshows, slide decks, or structured slides.

vision:
Generate image, create image, draw picture.

Return ONLY one word:
chat
search
coding
pdf
ppt
vision

User Query:
${state.prompt}
`;

  const response = await llm.invoke(prompt);
  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
