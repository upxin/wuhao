import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('TOKEN', () => {
  const token = ref()

  function setToken(val) {
    token.value = val
  }
  
  return {
    token,
    setToken
  }
})
