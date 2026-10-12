import fs from "fs";
import PDFParse from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDB.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";
import { getModel } from "../config/llmModels.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRag = async (state) => {
  try {
    await checkAgentLimit(state.userId, "pdf");

    const buffer = fs.readFileSync(state.file.path);
    const pdf = new PDFParse({ data: buffer });

    const result = await pdf.getText();
    const text = result.text;
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = splitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;
    const store = await vectorStore(docs, collectionName);
    const relevantDocs = await store.similaritySearch(state.prompt, 5);
    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");
    const llm = await getModel("pdfRag");

    const message = [
      new SystemMessage(`
        You are CortexAI PDF Assistant.
        
        Rules:
        - Answer ONLY from the uploaded PDF.
        - Never make up information.
        - If the answer is not present in the PDF, reply: "I couldn't find this information in the uploaded PDF."
        - Use Markdown formatting.
        `),
      new HumanMessage(`
        context: ${context} 
        Question: ${state.prompt}
        `),
    ];
    const response = await llm.invoke(message);
    await deductCredits(state.userId, "pdf");

    return {
      ...state,
      aiResponse: response?.content,
    };
  } catch (error) {
    console.log(`pdfRag error : ${error}`);
    return {
      ...state,
      aiResponse: error?.data?.message || "❌ Failed to analyze PDF.",
    };
  } finally {
    fs.unlinkSync(state.file.path);
  }
};
