import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Header from '../components/layout/Header'
import SearchBar from '../components/search/SearchBar'
import CustomerTable from '../components/customers/CustomerTable'
import PreferenceDetailForm from '../components/preferences/PreferenceDetailForm'
import Toast from '../components/ui/Toast'
import { getCustomerById, saveCustomerPreferences, searchCustomers } from '../api/mockApi'

const EMPTY_CRITERIA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  membershipNumber: '',
}

function criteriaFromParams(searchParams) {
  return {
    firstName: searchParams.get('firstName') ?? '',
    lastName: searchParams.get('lastName') ?? '',
    email: searchParams.get('email') ?? '',
    phone: searchParams.get('phone') ?? '',
    address: searchParams.get('address') ?? '',
    membershipNumber: searchParams.get('membershipNumber') ?? '',
  }
}

function criteriaToParams(criteria) {
  const params = new URLSearchParams()
  Object.entries(criteria).forEach(([key, value]) => {
    if (value?.trim()) params.set(key, value.trim())
  })
  return params
}

function getSearchLabel(criteria) {
  const active = Object.values(criteria).find((value) => value?.trim())
  return active?.trim() || 'search'
}

function clonePreferences(preferences) {
  return JSON.parse(JSON.stringify(preferences))
}

export default function StackViewPage() {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const [searchParams] = useSearchParams()

  const [criteria, setCriteria] = useState(() => criteriaFromParams(searchParams))
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [preferences, setPreferences] = useState(null)
  const [doNotContactAll, setDoNotContactAll] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const isSearchRoute = !customerId && searchParams.toString().length > 0
  const showTable = hasSearched && customers.length > 1
  const showPreferences = Boolean(customerId && selectedCustomer)
  const showNoResults = hasSearched && customers.length === 0 && !customerId

  const loadCustomer = useCallback(async (id) => {
    const customer = await getCustomerById(id)
    if (!customer) {
      navigate('/', { replace: true })
      return
    }
    setSelectedCustomer(customer)
    setPreferences(clonePreferences(customer.preferences))
    setDoNotContactAll(customer.doNotContactAll)
  }, [navigate])

  useEffect(() => {
    if (!customerId) return
    loadCustomer(customerId)
  }, [customerId, loadCustomer])

  useEffect(() => {
    const nextCriteria = criteriaFromParams(searchParams)
    setCriteria(nextCriteria)

    const hasParams = searchParams.toString().length > 0
    if (!hasParams) {
      setCustomers([])
      setHasSearched(false)
      if (!customerId) {
        setSelectedCustomer(null)
      }
      return
    }

    let cancelled = false

    async function runSearch() {
      setIsSearching(true)
      try {
        const { customerList } = await searchCustomers(nextCriteria)
        if (cancelled) return

        setCustomers(customerList)
        setHasSearched(true)

        if (!customerId && customerList.length === 1) {
          navigate(`/customer/${customerList[0].id}?${searchParams.toString()}`, {
            replace: true,
          })
        }
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    }

    runSearch()

    return () => {
      cancelled = true
    }
  }, [customerId, navigate, searchParams])

  const handleCriteriaChange = (key, value) => {
    setCriteria((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    const params = criteriaToParams(criteria)
    if (!params.toString()) return
    navigate(`/search?${params.toString()}`)
  }

  const handleClear = () => {
    setCriteria(EMPTY_CRITERIA)
    setCustomers([])
    setSelectedCustomer(null)
    setPreferences(null)
    setDoNotContactAll(false)
    setHasSearched(false)
    navigate('/')
  }

  const handleSelectCustomer = (id) => {
    navigate(`/customer/${id}?${searchParams.toString()}`)
  }

  const handlePreferenceChange = (topicId, channel, checked) => {
    setPreferences((prev) => ({
      ...prev,
      [topicId]: { ...prev[topicId], [channel]: checked },
    }))
  }

  const handleSave = async () => {
    if (!selectedCustomer || !preferences) return

    setIsSaving(true)
    try {
      await saveCustomerPreferences(selectedCustomer.id, {
        preferences,
        doNotContactAll,
      })
      setToastMessage('Customer preferences updated successfully!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (selectedCustomer) {
      setPreferences(clonePreferences(selectedCustomer.preferences))
      setDoNotContactAll(selectedCustomer.doNotContactAll)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-5">
        <SearchBar
          values={criteria}
          onChange={handleCriteriaChange}
          onSearch={handleSearch}
          onClear={handleClear}
          isSearching={isSearching && (isSearchRoute || !customerId)}
        />

        {showNoResults && (
          <p className="mt-4 text-sm text-zinc-400">
            No matches found for &apos;{getSearchLabel(criteria)}&apos;.
          </p>
        )}

        {showTable && (
          <CustomerTable
            customers={customers}
            searchLabel={getSearchLabel(criteria)}
            selectedCustomerId={customerId}
            onSelectCustomer={handleSelectCustomer}
          />
        )}

        {showPreferences && (
          <PreferenceDetailForm
            customer={selectedCustomer}
            preferences={preferences}
            doNotContactAll={doNotContactAll}
            onPreferenceChange={handlePreferenceChange}
            onDoNotContactChange={setDoNotContactAll}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        )}
      </main>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}
