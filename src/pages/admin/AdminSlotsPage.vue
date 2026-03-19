<template>
  <section class="page">
    <header class="page__header">
      <h1>时段管理</h1>
      <p class="muted">维护咨询可用时段/规则（先做 slots CRUD 也可）。</p>
    </header>

    <div class="card">
      <div class="title">接口（建议）</div>
      <div class="muted small">POST /specialist/slots</div>
      <div class="muted small">PATCH /specialist/slots/:id</div>
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

