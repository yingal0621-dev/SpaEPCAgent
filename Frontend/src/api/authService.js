const AGENT_INFO = {
  agentId: 'Agent-99281',
  name: 'J. Tran',
  corporateDomain: 'INTERNAL',
}

let cachedToken = null

export function getAgentInfo() {
  return { ...AGENT_INFO }
}

/**
 * Simulates an async token exchange against future .NET JWT / identity provider.
 * Replace the body with a real auth endpoint call when backend middleware is ready.
 */
export async function exchangeAgentToken() {
  await new Promise((resolve) => setTimeout(resolve, 50))

  cachedToken = 'mock-token'
  return cachedToken
}

export async function getAuthHeaders() {
  if (!cachedToken) {
    await exchangeAgentToken()
  }

  return {
    Authorization: `Bearer ${cachedToken}`,
    'Content-Type': 'application/json',
    'X-Agent-Id': AGENT_INFO.agentId,
    'X-Corporate-Domain': AGENT_INFO.corporateDomain,
  }
}

export function clearAuthToken() {
  cachedToken = null
}
