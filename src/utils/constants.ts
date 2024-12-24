export const TOKEN ='TOKEN'
export const baseUrl = ''
export const dev = 'http://47.100.214.251:8181'
export const pro = 'http://47.100.214.251:8181'

// @ts-nocheck
export const host = process.env.NODE_ENV === "development" ? dev : pro;
