// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  css:["bootstrap/dist/css/bootstrap.min.css"],
  devtools: { enabled: false },

  modules: ["@nuxtjs/supabase"],
  supabase: { redirect: false},
})
