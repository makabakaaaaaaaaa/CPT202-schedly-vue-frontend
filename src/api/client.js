import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'booking.auth.token'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function unwrap(res) {
  return res?.data ?? res
}

function normalizeError(err) {
  const status = err?.response?.status
  const data = err?.response?.data
  const code = data?.code
  const message = data?.message || err?.message || '请求失败'
  return { status, code, message, raw: err, data }
}

async function request(promise) {
  try {
    return unwrap(await promise)
  } catch (err) {
    throw normalizeError(err)
  }
}

export const api = {
  // Auth & User
  // 发送注册邮箱验证码
  sendRegisterEmailCode: (payload) => request(http.post('/auth/send-email-code', payload)),
  // 携带邮箱验证码完成注册
  register: (payload) => request(http.post('/auth/register', payload)),
  login: (payload) => request(http.post('/auth/login', payload)),
  logout: () => request(http.post('/auth/logout')),
  getMe: () => request(http.get('/me')),
  updateMe: (payload) => request(http.patch('/me', payload)),

  // Expertise & Specialists
  listExpertise: () => request(http.get('/expertise')),
  listSpecialists: (params) => request(http.get('/specialists', { params })),
  getSpecialist: (id) => request(http.get(`/specialists/${id}`)),
  listSpecialistSlots: (id, params) => request(http.get(`/specialists/${id}/slots`, { params })),

  // Bookings (Customer)
  createBooking: (payload) => request(http.post('/bookings', payload)),
  listMyBookings: (params) => request(http.get('/bookings', { params })),
  getBooking: (id) => request(http.get(`/bookings/${id}`)),
  cancelBooking: (id, payload) => request(http.post(`/bookings/${id}/cancel`, payload)),
  rescheduleBooking: (id, payload) => request(http.post(`/bookings/${id}/reschedule`, payload)),

  // Specialist workflow
  listBookingRequests: (params) => request(http.get('/specialist/booking-requests', { params })),
  confirmBooking: (id) => request(http.post(`/specialist/bookings/${id}/confirm`)),
  rejectBooking: (id, payload) => request(http.post(`/specialist/bookings/${id}/reject`, payload)),
  completeBooking: (id) => request(http.post(`/specialist/bookings/${id}/complete`)),

  // Admin (optional)
  adminCreateSpecialist: (payload) => request(http.post('/admin/specialists', payload)),
  adminUpdateSpecialist: (id, payload) => request(http.patch(`/admin/specialists/${id}`, payload)),
  adminSetSpecialistStatus: (id, payload) => request(http.post(`/admin/specialists/${id}/status`, payload)),
  adminCreateExpertise: (payload) => request(http.post('/admin/expertise', payload)),
  adminUpdateExpertise: (id, payload) => request(http.patch(`/admin/expertise/${id}`, payload)),

  // Pricing
  quotePricing: (payload) => request(http.post('/pricing/quote', payload))
}

