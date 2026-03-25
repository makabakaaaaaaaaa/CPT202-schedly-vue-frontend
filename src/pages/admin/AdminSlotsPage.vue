<script setup>
import { ref } from 'vue'
import { api } from '@/api/client'

const specialistId = ref('')
const slotDate = ref(new Date().toISOString().slice(0, 10))
const slots = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  if (!specialistId.value.trim()) {
    error.value = 'Please enter a specialist ID'
    return
  }
  error.value = ''
  loading.value = true
  try {
    slots.value = await api.listSpecialistSlots(specialistId.value.trim(), { date: slotDate.value })
  } catch (e) {
    error.value = e?.message || 'Failed to load'
    slots.value = []
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Slot Management</h1>
    </header>

    <div class="card">
      <label class="field">
        <span class="label">Specialist ID</span>
        <input v-model="specialistId" class="input" placeholder="sp-1" />
      </label>
      <label class="field">
        <span class="label">Date</span>
        <input v-model="slotDate" type="date" class="input" />
      </label>
      <button type="button" class="btn" :disabled="loading" @click="load">Search Slots</button>
    </div>

    <div v-if="error" class="banner banner--error" role="alert">{{ error }}</div>

    <div v-if="slots.length" class="card">
      <div class="title">Results ({{ slots.length }})</div>
      <ul class="list">
        <li v-for="sl in slots" :key="sl.slotId ?? sl.id" class="row">
          <span class="mono">{{ sl.slotId ?? sl.id }}</span>
          <span>{{ sl.start ?? sl.startTime }} — {{ sl.end ?? sl.endTime }}</span>
          <span v-if="sl.available === false" class="muted small">Full</span>
        </li>
      </ul>
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
.small {
  font-size: 12px;
  margin-left: 8px;
}
.card {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}
.title {
  font-weight: 700;
  margin-bottom: 10px;
}
.field {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
  max-width: 400px;
}
.label {
  font-size: 13px;
  opacity: 0.85;
}
.input {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: #ffffff;
  color: #111827;
}
.btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 14px;
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
</style>
