import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import "dotenv/config";
import fs from "fs";
import path from "path";


const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model =  "deepseek/DeepSeek-R1-0528";

export async function main() {
    try {
    // Load and encode the sketch image
    const imagePath = path.join(process.cwd(), "contoso_layout_sketch.jpg");
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token),
    );

    const response = await client.path("/chat/completions").post({
        body: {
        model: model,
        messages: [
        {
            role: "system",
            content: "You are an expert front-end developer. Convert the provided hand-drawn website layout sketch into a fully responsive HTML and CSS layout. Keep the design modern and clean.",
        },
        {
        role: "user",
        content: [
        {
        type: "text",
        text: "Please generate HTML and CSS code for this layout:",
        },
        {
        type: "image_url",
        image_url: {
            url: `data:JS-AI-Build-a-thon\\contoso_layout_sketch.jpg;base64,${base64Image}`,
        },
        },
            ],
        },
        ],
        temperature: 0.2,
      },
    });

    if (isUnexpected(response)) {
        console.error("Unexpected response:", response.body);
      return;
    }

    const completion = response.body.choices?.[0]?.message?.content;
    if (completion) {
    const outputPath = path.join(process.cwd(), "sketch_layout_output.html");
    fs.writeFileSync(outputPath, completion);
    console.log(` Web page code saved to ${outputPath}`);
    } else {
    console.error(" No completion returned.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
