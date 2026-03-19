<template>
  <section class="page">
    <header class="page__header">
      <h1>专家仪表盘</h1>
      <p class="muted">概览：今日预约、待确认、即将开始。</p>
    </header>

    <div class="card">
      <div class="title">待处理预约</div>
      <div class="muted small">接口：GET /specialist/booking-requests?status=Pending</div>
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

