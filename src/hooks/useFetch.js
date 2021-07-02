const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'

export default async function useFetch(method, url, body) {
  const response = await fetch(`${baseUrl}${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  return response
}