<template>
  <section class="page">
    <header class="page__header">
      <h1>专长类目管理</h1>
      <p class="muted">维护 expertise 主数据。</p>
    </header>

    <div class="card">
      <div class="title">接口</div>
      <div class="muted small">GET /expertise</div>
      <div class="muted small">POST /admin/expertise</div>
      <div class="muted small">PATCH /admin/expertise/:id</div>
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

