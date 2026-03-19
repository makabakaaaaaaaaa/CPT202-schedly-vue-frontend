<script setup>
defineProps({
  id: { type: String, required: true }
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>预约详情</h1>
      <p class="muted">bookingId: {{ id }}</p>
    </header>

    <div class="card">
      <div class="title">状态与操作</div>
      <div class="muted small">接口：GET /bookings/{{ id }}</div>
      <div class="muted small">取消：POST /bookings/{{ id }}/cancel</div>
      <div class="muted small">改期：POST /bookings/{{ id }}/reschedule</div>
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
.card {
  margin-top: 14px;
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

