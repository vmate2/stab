export default defineNuxtConfig({
  compatibilityDate: '2024-11-08',
  devtools: { enabled: false },
  
  // modules: ['@nuxthub/core'],  //! Remove if not needed
  
  nitro: {
    experimental: {
      openAPI: false,  // Disables OpenAPI functionality
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
  
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  
  runtimeConfig: {
    public: {
      secretKey: process.env.SECRET_KEY,
      jwtSecret: process.env.JWT_SECRET,
      publicKey: process.env.PUBLIC_KEY,
    },
    secret_header: process.env.SECRET_HEADER,
    pepper: process.env.PEPPER,
    privateKey: process.env.PRIVATE_KEY,
  },
  
  routeRules: {
    '/stab/**': { appMiddleware: 'auth' }, // Apply auth middleware to all /stab/ routes
  },
  
  css: [
    '~/assets/css/main.css',
  ],
});