<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'

const page = ref({ items: [], total: 0 })
const loading = ref(false)
const error = ref('')
const missingApi = ref(false)

async function load() {
  error.value = ''
  missingApi.value = false
  loading.value = true
  try {
    page.value = await api.adminListBookings({ pageSize: 100 })
  } catch (e) {
    if (e?.status === 404) {
      missingApi.value = true
      error.value = 'Admin bookings endpoint is not available (404)'
    } else {
      error.value = e?.message || 'Failed to load'
    }
    page.value = { items: [], total: 0 }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Booking Management</h1>
    </header>

    <div class="toolbar card">
      <button type="button" class="btn" :disabled="loading" @click="load">Refresh</button>
    </div>

    <div v-if="error" class="banner" :class="missingApi ? 'banner--warn' : 'banner--error'" role="alert">
      {{ error }}
    </div>

    <div v-if="loading && !(page.items || []).length" class="card muted">Loading…</div>

    <div v-else-if="!(page.items || []).length && !missingApi" class="empty">
      <div class="empty__title">No booking data</div>
    </div>

    <div v-else-if="(page.items || []).length" class="table-wrap card">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Time</th>
            <th>Customer</th>
            <th>Specialist</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in page.items" :key="b.id">
            <td class="mono">{{ b.id }}</td>
            <td>{{ b.status }}</td>
            <td>{{ b.time ?? b.startTime ?? '—' }}</td>
            <td>{{ b.customerName ?? b.customerId ?? '—' }}</td>
            <td class="mono">{{ b.specialistId ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.page__header h1 {
  margin: 0 0 6px;
  font-size: 22px;
}
.muted {
  opacity: 0.8;
}
.toolbar {
  margin-top: 14px;
  padding: 14px;
  display: flex;
  justify-content: flex-end;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}
.btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
}
.card {
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}
.table-wrap {
  margin-top: 14px;
  overflow-x: auto;
  padding: 0;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.table th,
.table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.mono {
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.banner {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 12px;
}
.banner--error {
  border: 1px solid rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
}
.banner--warn {
  border: 1px solid rgba(251, 191, 36, 0.45);
  background: rgba(251, 191, 36, 0.12);
}
.empty {
  margin-top: 16px;
  padding: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  border-radius: 14px;
}
.empty__title {
  font-weight: 700;
}
</style>
