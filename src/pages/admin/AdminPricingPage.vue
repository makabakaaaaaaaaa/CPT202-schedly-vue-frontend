<script setup>
import { computed, ref } from 'vue'
import { api } from '@/api/client'

const specialistId = ref('')
const duration = ref(60)
const type = ref('online')
const loading = ref(false)
const error = ref('')
const quote = ref(null)
const history = ref([])
const durationOptions = [30, 45, 60, 90]

const hasQuote = computed(() => !!quote.value)
const quoteAmount = computed(
  () => quote.value?.amount ?? quote.value?.totalAmount ?? quote.value?.total ?? quote.value?.price ?? null
)
const quoteCurrency = computed(() => quote.value?.currency ?? 'USD')
const quoteSpecialist = computed(() => quote.value?.specialistId ?? specialistId.value)
const quoteDuration = computed(() => {
  const fallback = Number(duration.value)
  return quote.value?.duration ?? (Number.isFinite(fallback) ? fallback : 0)
})
const quoteType = computed(() => quote.value?.type ?? type.value)

function formatCurrency(amountValue, currencyValue = 'USD') {
  const amount = Number(amountValue)
  if (!Number.isFinite(amount)) return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyValue || 'USD',
      maximumFractionDigits: 2
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currencyValue || ''}`.trim()
  }
}

function buildQuoteSummary(durationValue, typeValue) {
  const mins = Number(durationValue)
  const typeText = String(typeValue || '').toLowerCase() === 'offline' ? 'offline' : 'online'
  if (!Number.isFinite(mins) || mins <= 0) return `Consultation session (${typeText})`
  if (mins % 60 === 0) {
    const hours = mins / 60
    return `${hours} hour${hours > 1 ? 's' : ''} ${typeText} session`
  }
  return `${mins} minute ${typeText} session`
}

const formattedAmount = computed(() => {
  return formatCurrency(quoteAmount.value, quoteCurrency.value)
})

const quoteSummary = computed(() => {
  return buildQuoteSummary(quoteDuration.value, quoteType.value)
})

function appendHistoryItem() {
  const amount =
    quote.value?.amount ?? quote.value?.totalAmount ?? quote.value?.total ?? quote.value?.price ?? null
  const currency = quote.value?.currency ?? 'USD'
  const rowDuration = quote.value?.duration ?? (Number.isFinite(Number(duration.value)) ? Number(duration.value) : 0)
  const rowType = quote.value?.type ?? type.value
  history.value.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    specialistId: quote.value?.specialistId ?? specialistId.value.trim(),
    duration: rowDuration,
    type: rowType,
    amount,
    currency,
    summary: buildQuoteSummary(rowDuration, rowType),
    createdAt: new Date().toISOString()
  })
}

function clearHistory() {
  history.value = []
}

async function onQuote() {
  error.value = ''
  quote.value = null
  if (!specialistId.value.trim()) {
    error.value = 'Please enter specialistId'
    return
  }
  loading.value = true
  try {
    quote.value = await api.quotePricing({
      specialistId: specialistId.value.trim(),
      duration: duration.value ? Number(duration.value) : undefined,
      type: type.value.trim() || undefined
    })
    appendHistoryItem()
  } catch (e) {
    error.value = e?.message || 'Failed to get quote'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Pricing Calculator</h1>
      <p class="subtitle">
        Calculate consultation pricing based on specialist, duration, and session type.
      </p>
    </header>

    <div class="calculator-layout">
      <section class="calc-card">
        <h2 class="card-title">Quote Setup</h2>
        <label class="field">
          <span class="label">Specialist ID</span>
          <input v-model="specialistId" class="input" placeholder="Enter specialist ID (e.g. sp-1)" />
        </label>

        <div class="field">
          <span class="label">Duration</span>
          <div class="option-row">
            <button
              v-for="mins in durationOptions"
              :key="mins"
              type="button"
              class="option-btn"
              :class="{ 'option-btn--active': Number(duration) === mins }"
              @click="duration = mins"
            >
              {{ mins }}m
            </button>
          </div>
        </div>

        <div class="field">
          <span class="label">Session Type</span>
          <div class="option-row type-row">
            <button
              type="button"
              class="option-btn option-btn--type"
              :class="{ 'option-btn--active': type === 'online' }"
              @click="type = 'online'"
            >
              Online
            </button>
            <button
              type="button"
              class="option-btn option-btn--type"
              :class="{ 'option-btn--active': type === 'offline' }"
              @click="type = 'offline'"
            >
              Offline
            </button>
          </div>
        </div>

        <button type="button" class="btn-primary" :disabled="loading" @click="onQuote">
          {{ loading ? 'Calculating…' : 'Calculate Quote' }}
        </button>

        <div v-if="error" class="banner banner--error" role="alert">{{ error }}</div>
      </section>

      <section class="calc-card preview-card">
        <h2 class="card-title">Quote Preview</h2>

        <template v-if="hasQuote">
          <div class="amount-block">
            <div class="amount-label">Total Price</div>
            <div class="amount">{{ formattedAmount }}</div>
          </div>

          <p class="summary">{{ quoteSummary }}</p>

          <div class="detail-list">
            <div class="detail-row">
              <span class="detail-key">Specialist</span>
              <span class="detail-value">{{ quoteSpecialist || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Duration</span>
              <span class="detail-value">{{ quoteDuration || '—' }} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Type</span>
              <span class="detail-value">{{ quoteType || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-key">Currency</span>
              <span class="detail-value">{{ quoteCurrency || '—' }}</span>
            </div>
          </div>
        </template>

        <div v-else class="empty-preview">
          Configure quote setup and click Calculate Quote to preview pricing.
        </div>
      </section>
    </div>

    <section class="history-card">
      <div class="history-head">
        <div>
          <h2 class="history-title">Recent Calculations</h2>
          <p class="history-note">Temporary history. It resets when the page is refreshed.</p>
        </div>
        <button
          type="button"
          class="clear-btn"
          :disabled="!history.length"
          @click="clearHistory"
        >
          Clear History
        </button>
      </div>

      <div v-if="!history.length" class="history-empty">
        No calculations yet. Successful quotes will appear here.
      </div>

      <div v-else class="history-list">
        <article v-for="row in history" :key="row.id" class="history-item">
          <div class="history-main">
            <div class="history-amount">{{ formatCurrency(row.amount, row.currency) }}</div>
            <div class="history-summary">{{ row.summary }}</div>
          </div>
          <div class="history-meta">
            <span><b>Specialist:</b> {{ row.specialistId || '—' }}</span>
            <span><b>Duration:</b> {{ row.duration || '—' }} minutes</span>
            <span><b>Type:</b> {{ row.type || '—' }}</span>
            <span><b>Currency:</b> {{ row.currency || '—' }}</span>
          </div>
        </article>
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

.calculator-layout {
  margin-top: 0;
  display: grid;
  grid-template-columns: minmax(300px, 0.95fr) minmax(320px, 1.05fr);
  gap: 14px;
}

.calc-card {
  background: #ffffff;
  border: 1px solid rgba(17, 24, 39, 0.1);
  border-radius: 0;
  padding: 16px;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.06);
}

.card-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
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
}

.option-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-btn {
  min-width: 62px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #d8d1cb;
  border-radius: 0;
  background: #f8f5f2;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
}

.option-btn--type {
  min-width: 110px;
}

.option-btn--active {
  border-color: #202124;
  background: #202124;
  color: #ffffff;
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

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.preview-card {
  display: flex;
  flex-direction: column;
  min-height: 332px;
}

.amount-block {
  border: 1px solid #e5e7eb;
  background: #fafafa;
  border-radius: 0;
  padding: 14px;
}

.amount-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.amount {
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.05;
  font-weight: 800;
  color: #111827;
}

.summary {
  margin: 12px 0 0;
  color: #374151;
  font-size: 14px;
}

.detail-list {
  margin-top: 14px;
  border-top: 1px solid #eceff3;
  padding-top: 10px;
  display: grid;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.detail-key {
  color: #6b7280;
  font-size: 13px;
}

.detail-value {
  font-size: 13px;
  color: #111827;
  font-weight: 600;
}

.empty-preview {
  margin-top: 2px;
  border: 1px dashed #d1d5db;
  border-radius: 0;
  background: #fafafa;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
  padding: 16px 14px;
}

.history-card {
  margin-top: 14px;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}

.history-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.history-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.history-note {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.clear-btn {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #000000;
  border-radius: 0;
  background: #000000;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.clear-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.clear-btn:hover:not(:disabled) {
  filter: brightness(0.92);
}

.history-empty {
  margin-top: 12px;
  padding: 14px;
  border: 1px dashed #d1d5db;
  background: #fafafa;
  color: #6b7280;
  font-size: 13px;
}

.history-list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.history-item {
  border: 1px solid #d8d1cb;
  background: #ffffff;
  padding: 12px 14px;
  display: grid;
  gap: 8px;
}

.history-main {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.history-amount {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.history-summary {
  font-size: 13px;
  color: #4b5563;
}

.history-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px 10px;
  font-size: 12px;
  color: #374151;
}

@media (max-width: 980px) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }
  .preview-card {
    min-height: auto;
  }
  .history-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .history-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .history-head {
    flex-direction: column;
  }
}
</style>
