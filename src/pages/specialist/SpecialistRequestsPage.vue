<template>
  <section class="page">
    <header class="page__header">
      <h1>待处理预约</h1>
      <p class="muted">对 Pending 的预约进行确认/拒绝。</p>
    </header>

    <div class="card">
      <div class="title">请求列表</div>
      <div class="muted small">接口：GET /specialist/booking-requests?status=Pending</div>
      <div class="muted small">确认：POST /specialist/bookings/:id/confirm</div>
      <div class="muted small">拒绝：POST /specialist/bookings/:id/reject</div>
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

