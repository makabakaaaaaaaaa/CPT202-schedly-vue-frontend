<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { api } from '@/api/client'

const expertiseList = ref([])
const page = ref({ items: [], total: 0 })
const loading = ref(false)
const error = ref('')
const success = ref('')
const searchQuery = ref('')

const form = ref({
  name: '',
  price: '',
  bio: '',
  expertiseIds: []
})

const creating = ref(false)
const statusBusy = ref('')

const expertiseOpen = ref(false)
const expertiseSearch = ref('')
const expertiseFieldRef = ref(null)

const expertiseMap = computed(() => {
  const map = new Map()
  for (const item of expertiseList.value || []) {
    const id = item?.id != null ? String(item.id) : ''
    if (!id) continue
    map.set(id, item)
  }
  return map
})

const filteredExpertiseOptions = computed(() => {
  const q = expertiseSearch.value.trim().toLowerCase()
  if (!q) return expertiseList.value
  return (expertiseList.value || []).filter((item) => String(item?.name ?? '').toLowerCase().includes(q))
})

const selectedExpertise = computed(() =>
  (form.value.expertiseIds || []).map((id) => expertiseMap.value.get(String(id)) || { id, name: id })
)

const filteredSpecialists = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const rows = page.value?.items || []
  if (!q) return rows
  return rows.filter((row) => String(row?.name ?? '').toLowerCase().includes(q))
})

const totalSpecialists = computed(() => Math.max(Number(page.value?.total) || 0, (page.value?.items || []).length))

const expertisePlaceholder = computed(() => {
  if (!form.value.expertiseIds.length) return 'Select expertise'
  if (form.value.expertiseIds.length === 1) return selectedExpertise.value[0]?.name || '1 selected'
  return `${form.value.expertiseIds.length} expertise selected`
})

function normalizeExpertiseIds(value) {
  if (!Array.isArray(value)) return []
  return value.map((id) => String(id)).filter(Boolean)
}

function toggleExpertisePicker() {
  expertiseOpen.value = !expertiseOpen.value
}

function closeExpertisePicker() {
  expertiseOpen.value = false
}

function toggleExpertise(id) {
  const targetId = String(id)
  if (!targetId) return
  const set = new Set(normalizeExpertiseIds(form.value.expertiseIds))
  if (set.has(targetId)) set.delete(targetId)
  else set.add(targetId)
  form.value.expertiseIds = [...set]
}

function removeExpertise(id) {
  const targetId = String(id)
  form.value.expertiseIds = normalizeExpertiseIds(form.value.expertiseIds).filter((itemId) => itemId !== targetId)
}

function handleGlobalClick(event) {
  const host = expertiseFieldRef.value
  if (!host) return
  if (host.contains(event.target)) return
  closeExpertisePicker()
}

function formatPrice(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '--'
  return `$${amount.toFixed(2)}`
}

function specialistExpertiseNames(row) {
  if (Array.isArray(row?.expertiseNames)) {
    return row.expertiseNames.map((name) => String(name)).filter(Boolean)
  }

  if (Array.isArray(row?.expertise)) {
    const names = row.expertise
      .map((item) => String(item?.name ?? '').trim())
      .filter(Boolean)
    if (names.length) return names
  }

  const ids = normalizeExpertiseIds(row?.expertiseIds)
  if (!ids.length) return []
  return ids.map((id) => expertiseMap.value.get(id)?.name || id)
}

function specialistStatus(row) {
  const status = String(row?.status ?? '').trim()
  return status || 'Unknown'
}

function specialistStatusClass(row) {
  const status = specialistStatus(row).toLowerCase()
  if (status === 'active') return 'status-badge status-badge--active'
  if (status === 'inactive') return 'status-badge status-badge--inactive'
  return 'status-badge'
}

async function loadExpertise() {
  try {
    expertiseList.value = await api.listExpertise()
  } catch {
    expertiseList.value = []
  }
}

async function loadSpecialists() {
  error.value = ''
  loading.value = true
  try {
    page.value = await api.listSpecialists({ pageSize: 100 })
  } catch (e) {
    error.value = e?.message || 'Failed to load specialists'
    page.value = { items: [], total: 0 }
  } finally {
    loading.value = false
  }
}

async function onCreate() {
  error.value = ''
  success.value = ''

  if (!form.value.name.trim()) {
    error.value = 'Please enter a name'
    return
  }
  if (!form.value.expertiseIds.length) {
    error.value = 'Please select at least one expertise item'
    return
  }

  creating.value = true
  try {
    const price = form.value.price === '' ? undefined : Number(form.value.price)
    await api.adminCreateSpecialist({
      name: form.value.name.trim(),
      expertiseIds: normalizeExpertiseIds(form.value.expertiseIds),
      price: Number.isFinite(price) ? price : undefined,
      bio: form.value.bio.trim() || undefined
    })
    form.value = { name: '', price: '', bio: '', expertiseIds: [] }
    expertiseSearch.value = ''
    closeExpertisePicker()
    await loadSpecialists()
    success.value = 'Specialist created successfully.'
  } catch (e) {
    error.value = e?.message || 'Failed to create specialist'
  } finally {
    creating.value = false
  }
}

async function setStatus(id, status) {
  statusBusy.value = `${id}:${status}`
  error.value = ''
  success.value = ''
  try {
    await api.adminSetSpecialistStatus(id, { status })
    await loadSpecialists()
    success.value = `Status updated to ${status}.`
  } catch (e) {
    error.value = e?.message || 'Failed to update status'
  } finally {
    statusBusy.value = ''
  }
}

function onEditReserved(row) {
  const specialistId = row?.id != null ? String(row.id) : 'N/A'
  success.value = `Edit flow reserved for specialist ${specialistId}. PATCH /admin/specialists/{id} can be wired here.`
}

onMounted(async () => {
  document.addEventListener('click', handleGlobalClick)
  await loadExpertise()
  await loadSpecialists()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Specialist Management</h1>
      <p class="subtitle">
        Create and manage specialist profiles, pricing, and expertise assignments.
      </p>
    </header>

    <div v-if="error" class="banner banner--error" role="alert">{{ error }}</div>
    <div v-if="success" class="banner banner--success" role="status">{{ success }}</div>

    <section class="calc-card create-card">
      <h2 class="card-title">Create Specialist</h2>

      <div class="create-grid">
        <label class="field">
          <span class="label">Name</span>
          <input v-model="form.name" class="input" placeholder="Enter specialist name" />
        </label>

        <label class="field">
          <span class="label">Default Price (optional)</span>
          <input
            v-model="form.price"
            class="input"
            type="number"
            min="0"
            step="1"
            placeholder="Enter price"
          />
        </label>

        <label class="field field--full">
          <span class="label">Bio (optional)</span>
          <textarea
            v-model="form.bio"
            class="input input--area"
            rows="3"
            placeholder="Add specialist bio"
          />
        </label>
      </div>

      <div ref="expertiseFieldRef" class="field expertise-field field--full">
        <span class="label">Expertise</span>
        <button
          type="button"
          class="multi-trigger"
          :class="{ 'multi-trigger--open': expertiseOpen }"
          @click="toggleExpertisePicker"
        >
          <span>{{ expertisePlaceholder }}</span>
          <span class="multi-trigger__arrow">{{ expertiseOpen ? '^' : 'v' }}</span>
        </button>

        <div v-if="expertiseOpen" class="multi-panel">
          <input
            v-model.trim="expertiseSearch"
            class="input input--search"
            type="text"
            placeholder="Search expertise"
          />

          <div class="multi-options">
            <button
              v-for="item in filteredExpertiseOptions"
              :key="item.id"
              type="button"
              class="multi-option"
              :class="{ 'multi-option--active': form.expertiseIds.includes(String(item.id)) }"
              @click="toggleExpertise(item.id)"
            >
              <span>{{ item.name }}</span>
              <span class="multi-option__state">
                {{ form.expertiseIds.includes(String(item.id)) ? 'Selected' : 'Select' }}
              </span>
            </button>

            <div v-if="!filteredExpertiseOptions.length" class="multi-empty">
              No expertise matched your search.
            </div>
          </div>
        </div>

        <div v-if="selectedExpertise.length" class="selected-chips">
          <button
            v-for="item in selectedExpertise"
            :key="item.id"
            type="button"
            class="selected-chip"
            @click="removeExpertise(item.id)"
          >
            <span>{{ item.name }}</span>
            <span class="selected-chip__remove">x</span>
          </button>
        </div>
      </div>

      <button type="button" class="btn-primary btn-primary--fit" :disabled="creating" @click="onCreate">
        {{ creating ? 'Creating...' : 'Create' }}
      </button>
    </section>

    <section class="calc-card list-card">
      <div class="list-toolbar">
        <div class="toolbar-title">
          <h2 class="card-title">Specialists</h2>
          <p class="list-note">
            Total: {{ totalSpecialists }}
            <span v-if="searchQuery"> | Matched: {{ filteredSpecialists.length }}</span>
          </p>
        </div>
        <div class="toolbar-actions">
          <input
            v-model.trim="searchQuery"
            class="input search-input"
            type="text"
            placeholder="Search specialist by name"
            aria-label="Search specialist by name"
          />
          <button type="button" class="btn-neutral btn-refresh" :disabled="loading" @click="loadSpecialists">
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
      </div>

      <div v-if="loading && !(page.items || []).length" class="state muted">Loading...</div>

      <div v-else-if="!filteredSpecialists.length" class="state muted">
        {{ searchQuery ? 'No specialist matched your search.' : 'No specialist data.' }}
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col" class="th-id">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Expertise</th>
              <th scope="col">Status</th>
              <th scope="col" class="th-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="s in filteredSpecialists" :key="s.id">
              <td class="mono weak">{{ s.id ?? '--' }}</td>
              <td class="name-cell">{{ s.name ?? '--' }}</td>
              <td>{{ formatPrice(s.price) }}</td>
              <td>
                <div v-if="specialistExpertiseNames(s).length" class="expertise-summary">
                  <span
                    v-for="name in specialistExpertiseNames(s).slice(0, 2)"
                    :key="name"
                    class="summary-chip"
                  >
                    {{ name }}
                  </span>
                  <span
                    v-if="specialistExpertiseNames(s).length > 2"
                    class="summary-chip summary-chip--more"
                  >
                    +{{ specialistExpertiseNames(s).length - 2 }}
                  </span>
                </div>
                <span v-else class="muted">--</span>
              </td>
              <td>
                <span :class="specialistStatusClass(s)">{{ specialistStatus(s) }}</span>
              </td>
              <td>
                <div class="row-actions">
                  <button type="button" class="action-btn" @click="onEditReserved(s)">
                    Edit
                  </button>
                  <button
                    type="button"
                    class="action-btn action-btn--active"
                    :disabled="statusBusy === `${s.id}:Active`"
                    @click="setStatus(s.id, 'Active')"
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    class="action-btn action-btn--danger"
                    :disabled="statusBusy === `${s.id}:Inactive`"
                    @click="setStatus(s.id, 'Inactive')"
                  >
                    Deactivate
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.page__header {
  margin: 8px 0 20px;
  padding: 0;
}

.page__header h1 {
  margin: 0;
  font-size: clamp(32px, 3.1vw, 38px);
  font-weight: 800;
  line-height: 1.12;
}

.subtitle {
  margin: 6px 0 0;
  color: #4b5563;
  font-size: 14px;
}

.calc-card {
  background: #ffffff;
  border: 1px solid rgba(17, 24, 39, 0.1);
  border-radius: 0;
  padding: 16px;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.06);
}

.list-card {
  margin-top: 14px;
}

.card-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
}

.create-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.field--full {
  grid-column: 1 / -1;
}

.label {
  font-size: 13px;
  color: #4b5563;
  font-weight: 600;
}

.input {
  height: 44px;
  padding: 0 12px;
  border-radius: 0;
  border: 1px solid #d8d1cb;
  background: #f8f5f2;
  color: #111827;
  width: 100%;
}

.input::placeholder {
  color: #6b7280;
}

.input--area {
  min-height: 102px;
  height: auto;
  padding: 10px 12px;
  resize: vertical;
}

.btn-primary {
  width: 100%;
  height: 44px;
  border: 1px solid #a94442;
  border-radius: 0;
  background: #a94442;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary--fit {
  max-width: 220px;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-neutral {
  height: 40px;
  padding: 0 14px;
  border: 1px solid #d8d1cb;
  border-radius: 0;
  background: #f8f5f2;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-neutral:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-refresh {
  border-color: #a94442;
  background: #a94442;
  color: #ffffff;
}

.banner {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 0;
  font-size: 13px;
}

.banner--error {
  border: 1px solid rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
}

.banner--success {
  border: 1px solid rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.12);
  color: #14532d;
}

.expertise-field {
  position: relative;
}

.multi-trigger {
  height: 44px;
  width: 100%;
  border: 1px solid #d8d1cb;
  background: #f8f5f2;
  color: #111827;
  border-radius: 0;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.multi-trigger--open {
  border-color: #111827;
}

.multi-trigger__arrow {
  font-size: 11px;
  color: #6b7280;
}

.multi-panel {
  margin-top: 8px;
  border: 1px solid #d8d1cb;
  background: #ffffff;
  border-radius: 0;
  padding: 10px;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.06);
}

.input--search {
  margin-bottom: 8px;
}

.multi-options {
  max-height: 220px;
  overflow: auto;
  display: grid;
  gap: 6px;
}

.multi-option {
  height: 36px;
  border: 1px solid #d8d1cb;
  background: #f8f5f2;
  color: #111827;
  border-radius: 0;
  padding: 0 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.multi-option--active {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}

.multi-option__state {
  font-size: 11px;
  opacity: 0.8;
}

.multi-empty {
  border: 1px dashed #d1d5db;
  background: #fafafa;
  color: #6b7280;
  padding: 10px;
  font-size: 12px;
}

.selected-chips {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-chip {
  height: 30px;
  border: 1px solid #111827;
  background: #111827;
  color: #ffffff;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  font-size: 12px;
  cursor: pointer;
}

.selected-chip__remove {
  font-size: 14px;
  line-height: 1;
}

.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}

.toolbar-title .list-note {
  margin: 4px 0 0;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: min(320px, 50vw);
}

.list-note {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.state {
  margin-top: 12px;
  padding: 10px 0;
}

.muted {
  color: #6b7280;
}

.table-wrap {
  margin-top: 12px;
  overflow-x: auto;
  border: 1px solid #eceff3;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: #ffffff;
}

.table th,
.table td {
  padding: 11px 14px;
  text-align: left;
  border-bottom: 1px solid #eceff3;
  vertical-align: top;
}

.table th {
  font-weight: 700;
  color: #4b5563;
  background: #fafafa;
  white-space: nowrap;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.th-id {
  width: 180px;
}

.th-actions {
  width: 260px;
}

.mono {
  font-family: ui-monospace, monospace;
}

.weak {
  font-size: 12px;
  color: #6b7280;
}

.name-cell {
  font-weight: 600;
}

.expertise-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.summary-chip {
  border: 1px solid #d8d1cb;
  background: #f8f5f2;
  color: #374151;
  font-size: 12px;
  padding: 2px 8px;
}

.summary-chip--more {
  border-color: #111827;
  color: #111827;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  height: 26px;
  padding: 0 10px;
  border: 1px solid #d8d1cb;
  background: #f8f5f2;
  color: #374151;
  font-size: 12px;
  font-weight: 700;
}

.status-badge--active {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}

.status-badge--inactive {
  border-color: #a94442;
  background: #a94442;
  color: #ffffff;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  height: 32px;
  min-width: 78px;
  padding: 0 12px;
  border: 1px solid #d8d1cb;
  border-radius: 0;
  background: #f8f5f2;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.action-btn--active {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}

.action-btn--danger {
  border-color: #a94442;
  background: #a94442;
  color: #ffffff;
}

@media (max-width: 980px) {
  .create-grid {
    grid-template-columns: 1fr;
  }

  .toolbar-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .list-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
