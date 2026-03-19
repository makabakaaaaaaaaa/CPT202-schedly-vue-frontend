<template>
  <section class="page">
    <header class="page__header">
      <h1>专家管理</h1>
      <p class="muted">CRUD 专家记录（name/expertise/level/fee/status）。</p>
    </header>

    <div class="card">
      <div class="title">接口</div>
      <div class="muted small">POST /admin/specialists</div>
      <div class="muted small">PATCH /admin/specialists/:id</div>
      <div class="muted small">POST /admin/specialists/:id/status</div>
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

