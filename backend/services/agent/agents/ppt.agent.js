import { getModel } from "../config/llmModels.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { generatePpt } from "../utils/generatePpt.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pptAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "ppt");

    const llm = await getModel("pdf");
    const prompt = `
    You are a professional presentation designer.

    Return ONLY valid JSON.

    Structure :
    {
        "title" :"",
        "subtitle":"",
        "slides" : [
            {
                "title" :"",
                "points" : ["","",""]
            }
        ]
    }

  Rules:
  - Generate exactly 6 content slides.
  - Each slide should have 4-6 concise bullet points.
  - No markdown.
  - No explanation.
  - No code block.
  - Return ONLY JSON. 

    Topic :
    ${state.prompt}
    `;

    const res = await llm.invoke(prompt);
    const cleaned = res.content.replace(/```json\s*|```/gi, "").trim();
    const data = JSON.parse(cleaned);
    await deductCredits(state.userId, "ppt");
    const ppt = await generatePpt(data);
    const buffer = await ppt.write({ outputType: "nodebuffer" });

    const filename = `ppt-${Date.now()}.pptx`;
    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `# ✅ Presentation Generated Successfully

**${data.title}**

📩 [Download Presentation](${downloadUrl})

⌛ Note: S3 link will expire in accordance with your AWS session credentials (up to 24 hours).`,
    };
  } catch (error) {
    console.error(error);

    return {
      ...state,
      aiResponse: error?.data?.message || "❌ Failed to generate PPT.",
    };
  }
};
