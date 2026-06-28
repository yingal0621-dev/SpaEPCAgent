import { CUSTOMERS } from '../data/mockCustomers'

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

function matchesField(value, query) {
  if (!query?.trim()) return true
  return value?.toLowerCase().includes(query.trim().toLowerCase())
}

export async function searchCustomers(criteria) {
  await delay()

  const results = CUSTOMERS.filter((customer) => {
    const {
      firstName = '',
      lastName = '',
      email = '',
      phone = '',
      address = '',
      membershipNumber = '',
    } = criteria

    const hasCriteria = [firstName, lastName, email, phone, address, membershipNumber].some(
      (field) => field?.trim(),
    )

    if (!hasCriteria) return false

    return (
      matchesField(customer.firstName, firstName) &&
      matchesField(customer.lastName, lastName) &&
      matchesField(customer.email, email) &&
      matchesField(customer.phone, phone) &&
      matchesField(customer.address, address) &&
      matchesField(customer.membershipNumber ?? '', membershipNumber)
    )
  })

  return {
    customerList: results,
    total: results.length,
  }
}

export async function getCustomerById(customerId) {
  await delay(300)
  return CUSTOMERS.find((customer) => customer.id === customerId) ?? null
}

export async function saveCustomerPreferences(customerId, preferences) {
  await delay(800)

  const customer = CUSTOMERS.find((c) => c.id === customerId)
  if (!customer) {
    throw new Error('Customer not found')
  }

  customer.preferences = preferences.preferences
  customer.doNotContactAll = preferences.doNotContactAll

  return {
    status: 'SUCCESS',
    message: 'Customer preferences updated successfully!',
  }
}
