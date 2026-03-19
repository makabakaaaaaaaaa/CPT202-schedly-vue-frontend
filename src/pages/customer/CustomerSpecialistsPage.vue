<script setup>
import { ref } from 'vue'

const query = ref('')
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>专家列表</h1>
      <p class="muted">这里将支持按专长/等级/可用性筛选（后续接接口）。</p>
    </header>

    <div class="panel">
      <label class="field">
        <div class="label">搜索</div>
        <input v-model="query" placeholder="按姓名/专长关键词..." />
      </label>
      <div class="muted small">接口：GET /specialists?query=...</div>
    </div>

    <div class="empty">
      <div class="empty__title">暂无数据</div>
      <div class="muted">接入后端后在这里展示专家卡片列表。</div>
    </div>
  </section>
</template>

<style scoped>
.page__header h1 {
  margin: 0 0 6px;
  font-size: 22px;
}
.panel {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}
.field {
  display: grid;
  gap: 6px;
}
.label {
  font-size: 13px;
  opacity: 0.85;
}
input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: #ffffff;
  color: #111827;
  outline: none;
}
.muted {
  opacity: 0.8;
}
.small {
  font-size: 12px;
  margin-top: 8px;
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
