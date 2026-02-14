// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  typescript: {
    strict: true,
    typeCheck: false
  },
  colorMode: {
    preference: 'light'
  },
  ssr: true
})
