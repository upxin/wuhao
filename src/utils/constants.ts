export const TOKEN ='TOKEN'
export const baseUrl = ''
export const dev = 'https://dameitec.com/dev-api'
export const pro = 'https://dameitec.com/dev-api'

// @ts-nocheck
export const host = process.env.NODE_ENV === "development" ? dev : pro;
