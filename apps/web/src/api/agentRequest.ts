const apiBaseUrl = 'http://localhost:3000'
interface AiCompletionInput {
  prompt: string
}

export async function requestCompletionStream(
  input: AiCompletionInput,
  onChunk: (chunk: string) => void,
): Promise<string> {
  const res = await fetch(`${apiBaseUrl}/ai/complete/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('请求失败')
  if (!res.body) return ''

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const lineTrim = line.trim()
      if (!lineTrim || !lineTrim.startsWith('data: ')) continue
      const data = lineTrim.slice(6)
      onChunk(data)
    }
  }
  console.log(fullText, 'fullText')
  return fullText
}
