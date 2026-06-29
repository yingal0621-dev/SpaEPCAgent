import { PREFERENCE_TOPICS } from '../data/mockCustomers'

const LOB_TO_TOPIC_ID = Object.fromEntries(
  PREFERENCE_TOPICS.map((topic) => [topic.label, topic.id]),
)

export function mapSearchResultToCustomer(result) {
  return {
    id: result.customerId,
    customerId: result.customerId,
    name: result.name,
    type: result.type,
    membershipNumber: result.membershipNumber ?? null,
    location: result.location,
    phone: result.phone,
    email: result.email,
  }
}

export function mapPreferencesMatrixToUi(matrix = []) {
  const preferences = Object.fromEntries(
    PREFERENCE_TOPICS.map((topic) => [
      topic.id,
      { call: false, email: false, sms: false, mail: false },
    ]),
  )

  for (const row of matrix) {
    const topicId = LOB_TO_TOPIC_ID[row.lob]
    if (!topicId) continue

    preferences[topicId] = {
      call: Boolean(row.call),
      email: Boolean(row.email),
      sms: Boolean(row.sms),
      mail: Boolean(row.mail),
    }
  }

  return preferences
}

export function mapUiPreferencesToMatrix(preferences) {
  return PREFERENCE_TOPICS.map((topic) => ({
    lob: topic.label,
    call: Boolean(preferences[topic.id]?.call),
    email: Boolean(preferences[topic.id]?.email),
    sms: Boolean(preferences[topic.id]?.sms),
    mail: Boolean(preferences[topic.id]?.mail),
  }))
}

export function mapAuditLogsToUi(auditLogs = []) {
  return auditLogs.map((log, index) => ({
    id: log.logId ? `${log.logId}-${index}` : `log-${index}`,
    title: log.actionDescription,
    detail: [log.operator, log.channel, log.timestamp].filter(Boolean).join(' · '),
  }))
}

export function mergeCustomerWithPreferences(profile, prefsResponse, customerId) {
  return {
    id: customerId,
    customerId,
    name: profile?.name ?? customerId,
    type: profile?.type ?? 'MEMBER',
    membershipNumber: profile?.membershipNumber ?? null,
    location: profile?.location ?? '',
    phone: profile?.phone ?? '',
    email: profile?.email ?? '',
    doNotContactAll: Boolean(prefsResponse.doNotContactAll),
    preferences: mapPreferencesMatrixToUi(prefsResponse.preferencesMatrix),
    auditLog: mapAuditLogsToUi(prefsResponse.auditLogs),
  }
}

export function buildSearchRequestBody(criteria) {
  return {
    firstName: criteria.firstName ?? '',
    lastName: criteria.lastName ?? '',
    email: criteria.email ?? '',
    phone: criteria.phone ?? '',
    address: criteria.address ?? '',
    membershipNumber: criteria.membershipNumber ?? '',
  }
}

export function buildPreferenceUpdateRequest({ preferences, doNotContactAll }) {
  return {
    doNotContactAll: Boolean(doNotContactAll),
    preferencesMatrix: mapUiPreferencesToMatrix(preferences),
  }
}
