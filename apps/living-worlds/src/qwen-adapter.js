// Browser-local Qwen 3.5 adapter. No API key and no inference server required.
const MODEL_ID = "onnx-community/Qwen3.5-0.8B-ONNX-OPT";
let processor = null;
let model = null;
let loading = null;

export const qwenAdapter = {
  get ready() { return Boolean(model && processor); },
  async load(onStatus = () => {}) {
    if (this.ready) return true;
    if (loading) return loading;
    loading = (async () => {
      if (!globalThis.navigator?.gpu) {
        throw new Error("This browser does not expose WebGPU. Try a current Chrome/Edge browser on a WebGPU-capable device.");
      }
      onStatus("Loading Qwen runtime…");
      const hf = await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0");
      onStatus("Loading tokenizer and processor…");
      const nextProcessor = await hf.AutoProcessor.from_pretrained(MODEL_ID);
      onStatus("Downloading Qwen 0.8B model (first load may take a while)…");
      const nextModel = await hf.Qwen3_5ForConditionalGeneration.from_pretrained(MODEL_ID, {
        dtype: {
          embed_tokens: "q4",
          vision_encoder: "fp16",
          decoder_model_merged: "q4"
        },
        device: "webgpu"
      });
      processor = nextProcessor;
      model = nextModel;
      onStatus("Qwen 0.8B ready in this browser.");
      return true;
    })().catch((error) => {
      loading = null;
      throw error;
    });
    return loading;
  },
  async chooseAction(context) {
    if (!this.ready) return null;
    const prompt = [
      "<|im_start|>system",
      "You control one character in a small fictional simulation. Choose exactly one action from the allowed action IDs. Do not invent actions or claim state changes. Return ONLY one valid JSON object with keys actionId and dialogue. dialogue must be one short in-character sentence. No markdown.",
      "<|im_end|>",
      "<|im_start|>user",
      JSON.stringify(context),
      "<|im_end|>",
      "<|im_start|>assistant",
      "<think>\n\n</think>\n"
    ].join("\n");
    const inputs = await processor(prompt);
    const result = await model.generate({
      ...inputs,
      max_new_tokens: 100,
      do_sample: false
    });
    const decoded = processor.batch_decode(result.sequences, { skip_special_tokens: false })[0];
    const answer = decoded.slice(decoded.lastIndexOf("<|im_start|>assistant") + "<|im_start|>assistant".length)
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/<\|im_end\|>[\s\S]*$/g, "")
      .trim();
    const match = answer.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      const proposal = JSON.parse(match[0]);
      if (typeof proposal.actionId !== "string") return null;
      return {
        actionId: proposal.actionId,
        dialogue: typeof proposal.dialogue === "string" ? proposal.dialogue.slice(0, 180) : ""
      };
    } catch (_) {
      return null;
    }
  }
};
