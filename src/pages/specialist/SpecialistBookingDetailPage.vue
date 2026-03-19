<script setup>
defineProps({
  id: { type: String, required: true }
})
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>预约详情（专家）</h1>
      <p class="muted">bookingId: {{ id }}</p>
    </header>

    <div class="card">
      <div class="title">操作</div>
      <div class="muted small">确认：POST /specialist/bookings/{{ id }}/confirm</div>
      <div class="muted small">拒绝：POST /specialist/bookings/{{ id }}/reject</div>
      <div class="muted small">完成：POST /specialist/bookings/{{ id }}/complete</div>
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

