<script setup>
defineProps({
  id: { type: String, required: true }
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>专家详情</h1>
      <p class="muted">specialistId: {{ id }}</p>
    </header>

    <div class="grid">
      <div class="card">
        <div class="title">专家信息</div>
        <div class="muted small">接口：GET /specialists/{{ id }}</div>
      </div>
      <div class="card">
        <div class="title">可用时段</div>
        <div class="muted small">接口：GET /specialists/{{ id }}/slots?from&to</div>
      </div>
      <div class="card">
        <div class="title">创建预约</div>
        <div class="muted small">接口：POST /bookings（specialistId + slotId + topic/notes）</div>
      </div>
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
}
.grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.card {
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}
.title {
  font-weight: 700;
  margin-bottom: 8px;
}
</style>

