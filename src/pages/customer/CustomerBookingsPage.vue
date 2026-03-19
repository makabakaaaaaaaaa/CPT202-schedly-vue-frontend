<template>
  <section class="page">
    <header class="page__header">
      <h1>我的预约</h1>
      <p class="muted">接口：GET /bookings?status=...</p>
    </header>

    <div class="empty">
      <div class="empty__title">暂无预约</div>
      <div class="muted">后续这里会展示 Pending/Confirmed/Cancelled/Completed 列表。</div>
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
.empty {
  margin-top: 16px;
  padding: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  border-radius: 14px;
}
.empty__title {
  font-weight: 700;
  margin-bottom: 6px;
}
</style>

