<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    const next = typeof route.query.next === "string" ? route.query.next : "";
    if (next) await router.replace(next);
    else await router.replace(auth.defaultHomeRoute());
  } catch (e) {
    error.value = e?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="login-shell">
    <div class="background-layer" aria-hidden="true"></div>

    <div class="foreground-layer">
      <article class="login-card">
        <h1>Welcome back</h1>
        <p class="subtitle">Log in to Schedly</p>

        <form class="form" @submit.prevent="onSubmit">
          <label>
            <span class="sr-only">Email</span>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="email"
              required
            />
          </label>

          <label>
            <span class="sr-only">Password</span>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="password"
              required
            />
          </label>

          <div v-if="error" class="error">{{ error }}</div>

          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? "Logging in..." : "Log in" }}
          </button>
        </form>

        <p class="hint">
          Don’t have an account?
          <router-link to="/register">Sign up</router-link>
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.login-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #f0eae5;
}

.background-layer {
  position: absolute;
  inset: 0;
}

.background-layer {
  background-image: url("/images/login-bg.jpg");
  background-size: cover;
  background-position: 16% 56%;
  background-repeat: no-repeat;
  filter: blur(6px) brightness(0.9);
  transform: scale(1.03);
}

.foreground-layer {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: clamp(72px, 12vh, 128px) clamp(80px, 10vw, 164px)
    clamp(36px, 7vh, 72px) clamp(28px, 6vw, 80px);
}

.login-card {
  width: clamp(280px, 23vw, 330px);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 0;
  box-shadow: 0 14px 36px rgba(18, 22, 30, 0.14);
  padding: clamp(32px, 3vw, 40px);
}

h1 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
  color: #202124;
}

.subtitle {
  margin: 8px 0 26px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #202124;
}

.form {
  display: grid;
  gap: 13px;
}

input {
  width: 100%;
  height: 46px;
  border: 1px solid #d8d1cb;
  border-radius: 0;
  background: #f0eeee;
  color: #111827;
  padding: 0 13px;
  outline: none;
}

input::placeholder {
  color: #6b7280;
}

.btn {
  margin-top: 6px;
  height: 46px;
  border: 1px solid #d9533c;
  border-radius: 0;
  background: #d9533c;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error {
  border: 1px solid rgba(217, 83, 60, 0.4);
  background: rgba(217, 83, 60, 0.12);
  border-radius: 8px;
  padding: 10px 12px;
  color: #7f1d1d;
  font-size: 0.9rem;
}

.hint {
  margin: 20px 0 0;
  font-size: 0.92rem;
  color: #4b5563;
}

.hint a {
  color: #202124;
  font-weight: 600;
  text-decoration: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 900px) {
  .background-layer {
    background-position: 24% 56%;
  }

  .foreground-layer {
    justify-content: center;
    align-items: flex-start;
    padding: clamp(34px, 8vh, 56px) 20px 24px;
  }

  .login-card {
    width: min(360px, 100%);
    padding: 30px 24px;
  }
}
</style>
