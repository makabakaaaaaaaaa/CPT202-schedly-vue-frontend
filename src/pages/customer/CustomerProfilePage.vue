<template>
  <section class="page">
    <header class="page__header">
      <h1>个人资料</h1>
      <p class="muted">接口：GET /me & PATCH /me</p>
    </header>

    <div class="card">
      <div class="title">资料维护</div>
      <div class="muted small">后续在这里展示 name/email/phone 等字段。</div>
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

