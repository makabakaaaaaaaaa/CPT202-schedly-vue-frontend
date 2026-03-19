<template>
  <section class="page">
    <header class="page__header">
      <h1>管理员概览</h1>
      <p class="muted">后续接入报表与关键指标。</p>
    </header>

    <div class="card">
      <div class="title">快速入口</div>
      <div class="muted small">专家 / 类目 / 时段 / 定价 / 预约管理</div>
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

