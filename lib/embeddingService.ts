export async function CalculateEmbedding(data: { inputs: { source_sentence: string, sentences: string[] } }) {
	const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/thenlper/gte-base/pipeline/sentence-similarity",
		{
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}