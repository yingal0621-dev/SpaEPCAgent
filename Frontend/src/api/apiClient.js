import { API_BASE_URL } from './config'
import { getAuthHeaders } from './authService'

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const authHeaders = await getAuthHeaders()

  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      body?.ReturnMessage ?? response.statusText ?? 'Request failed',
      response.status,
      body,
    )
  }

  return body
}
