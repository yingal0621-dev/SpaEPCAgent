import { ApiError, apiRequest } from './apiClient'
import {
  buildPreferenceUpdateRequest,
  buildSearchRequestBody,
  mapSearchResultToCustomer,
  mergeCustomerWithPreferences,
} from './apiMappers'

const searchResultCache = new Map()
let lastSearchCriteria = null

function cacheSearchResults(results) {
  for (const customer of results) {
    searchResultCache.set(customer.id, customer)
  }
}

async function fetchSearchResults(criteria) {
  lastSearchCriteria = { ...criteria }

  try {
    const data = await apiRequest('/customers/search', {
      method: 'POST',
      body: JSON.stringify(buildSearchRequestBody(criteria)),
    })

    const rawResults = Array.isArray(data) ? data : []
    const customerList = rawResults.map(mapSearchResultToCustomer)
    cacheSearchResults(customerList)

    return customerList
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return []
    }
    throw error
  }
}

async function resolveCustomerProfile(customerId) {
  let profile = searchResultCache.get(customerId)

  if (!profile && lastSearchCriteria) {
    await fetchSearchResults(lastSearchCriteria)
    profile = searchResultCache.get(customerId)
  }

  return profile ?? null
}

async function fetchCustomerPreferences(customerId) {
  try {
    return await apiRequest(`/customers/${encodeURIComponent(customerId)}/preferences`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * POST /customers/search
 * Preserves legacy return shape for StackViewPage: { customerList, total }.
 */
export async function searchCustomers(criteria) {
  const customerList = await fetchSearchResults(criteria)

  return {
    customerList,
    total: customerList.length,
  }
}

/**
 * GET /customers/{customerId}/preferences
 * Merges cached search profile with preferences response for existing UI components.
 */
export async function getCustomerById(customerId) {
  const [profile, prefsResponse] = await Promise.all([
    resolveCustomerProfile(customerId),
    fetchCustomerPreferences(customerId),
  ])

  if (!prefsResponse) {
    return null
  }

  return mergeCustomerWithPreferences(profile, prefsResponse, customerId)
}

/**
 * PUT /customers/{customerId}/preferences
 * Preserves legacy return shape for StackViewPage save handler.
 */
export async function saveCustomerPreferences(customerId, payload) {
  const requestBody = buildPreferenceUpdateRequest(payload)

  const response = await apiRequest(
    `/customers/${encodeURIComponent(customerId)}/preferences`,
    {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    },
  )

  return {
    status: response?.status?.toUpperCase?.() ?? 'SUCCESS',
    message: 'Customer preferences updated successfully!',
  }
}
