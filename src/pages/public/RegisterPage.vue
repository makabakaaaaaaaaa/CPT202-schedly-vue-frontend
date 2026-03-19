<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/api/client";

const auth = useAuthStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const verificationCode = ref("");
const loading = ref(false);
const error = ref("");
const sendingCode = ref(false);
const codeCountdown = ref(0);

async function onSendCode() {
  if (!email.value || sendingCode.value || codeCountdown.value > 0) return;
  error.value = "";
  sendingCode.value = true;
  try {
    await api.sendRegisterEmailCode({ email: email.value, scene: "register" });
    codeCountdown.value = 60;
    const timer = setInterval(() => {
      if (codeCountdown.value <= 1) {
        codeCountdown.value = 0;
        clearInterval(timer);
      } else {
        codeCountdown.value -= 1;
      }
    }, 1000);
  } catch (e) {
    error.value =
      e?.message ||
      e?.data?.message ||
      "The verification code failed to be sent.";
  } finally {
    sendingCode.value = false;
  }
}

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      verificationCode: verificationCode.value,
    });
    await router.replace(auth.defaultHomeRoute());
  } catch (e) {
    error.value = e?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="register-shell">
    <div class="background-layer" aria-hidden="true"></div>
    <div class="overlay-layer" aria-hidden="true"></div>

    <div class="foreground-layer">
      <article class="register-card">
        <h1>Create account</h1>
        <p class="subtitle">Register with Schedly</p>

        <form class="form" @submit.prevent="onSubmit">
          <label>
            <span class="sr-only">Name</span>
            <input
              v-model="name"
              type="text"
              autocomplete="name"
              placeholder="name"
              required
            />
          </label>

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
            <span class="sr-only">Verification code</span>
            <div class="code-row">
              <input
                v-model="verificationCode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="verification code"
                required
              />
              <button
                type="button"
                class="btn-secondary"
                :disabled="sendingCode || !email || codeCountdown > 0"
                @click="onSendCode"
              >
                {{
                  codeCountdown > 0
                    ? `Resend (${codeCountdown}s)`
                    : sendingCode
                      ? "Sending..."
                      : "Send Code"
                }}
              </button>
            </div>
          </label>

          <label>
            <span class="sr-only">Password</span>
            <input
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="password"
              required
            />
          </label>

          <div v-if="error" class="error">{{ error }}</div>

          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? "Registering..." : "Register" }}
          </button>
        </form>

        <p class="hint">
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.register-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #f0eae5;
}

.background-layer,
.overlay-layer {
  position: absolute;
  inset: 0;
}

.background-layer {
  background-image: url("/images/register-bg.jpg");
  background-size: cover;
  background-position: 16% 56%;
  background-repeat: no-repeat;
  filter: blur(6px) brightness(0.96);
  transform: scale(1.03);
}

.overlay-layer {
  background: rgba(240, 234, 229, 0.14);
}

.foreground-layer {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(72px, 12vh, 128px) clamp(80px, 10vw, 164px)
    clamp(36px, 7vh, 72px) clamp(28px, 6vw, 80px);
}

.register-card {
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

.code-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
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

.btn-secondary {
  height: 46px;
  padding: 0 12px;
  border: 1px solid #d8d1cb;
  border-radius: 0;
  background: #f0eeee;
  color: #111827;
  white-space: nowrap;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 500;
}

.btn-secondary:disabled {
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
    align-items: flex-start;
    padding: clamp(34px, 8vh, 56px) 20px 24px;
  }

  .register-card {
    width: min(360px, 100%);
    padding: 30px 24px;
  }
}
</style>
