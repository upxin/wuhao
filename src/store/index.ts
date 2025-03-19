import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('TOKEN', () => {
  const token = ref(uni.getStorageSync('TOKEN'))
  const phone = ref(uni.getStorageSync('loginName'))

  function setToken(val) {
    token.value = val
  }
  function setPhone(val) {
    phone.value = val
  }

  return {
    token,
    phone,
    setToken,
    setPhone,
  }
})
