// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  
  modules: ['@nuxthub/core'],
  
  nitro: {
    experimental: {
      openAPI: false,  // Enables OpenAPI functionality
    },
  },
  
  app: {
    head: {
      meta: [
        { name: 'description', content: '33. Garaboncás napok és diáknapos Trefort stáb weboldala.' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'author', content: 'Varga Máté' }
      ],
      script: [
        { src: "https://www.google.com/recaptcha/enterprise.js", defer: true }
      ]
    }
  },
  
  hub: {
    database: true  // Enables the database feature in NuxtHub
  }
});
