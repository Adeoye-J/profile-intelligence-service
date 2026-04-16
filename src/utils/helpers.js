export function buildResponse(name, data) {
  const probability = Number(data.probability);
  const sample_size = data.count;

  const is_confident =
    probability >= 0.7 && sample_size >= 100;

  return {
    name: name.toLowerCase(),
    gender: data.gender,
    probability,
    sample_size,
    is_confident,
    processed_at: new Date().toISOString()
  };
}