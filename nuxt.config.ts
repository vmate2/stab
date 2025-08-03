export default defineNuxtConfig({
  compatibilityDate: '2024-11-08',
  devtools: { enabled: true },


  nitro: {
    experimental: {
      openAPI: false,  // Disables OpenAPI functionality
    },
  },

  app: {
    head: {
      title: 'FinalDeal - Trefort',
      meta: [
        { name: 'description', content: 'A 33. Garabonciás Napokon induló FinalDeal csapat hivatalos weboldala - programok, csapattagok, információk a BSZC Trefort képviseletében.' },
        { name: 'og:description', content: '33. Garaboncás napok és diáknapos Trefort stáb weboldala.' },
         { name: 'og:title', content: 'FinalDeal - Trefort' },
         { name: 'og:image', content: 'https://finaldeal.hu/img/finaldeallogo.png' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'author', content: 'Varga Máté' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/img/finaldeallogo.ico' },
      ],
      script: [
        { src: "https://www.google.com/recaptcha/enterprise.js", defer: true },
        {
          type: 'application/ld+json',
          tagPosition: 'head',
          textContent: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://finaldeal.hu", // Your domain
            "logo": "https://finaldeal.hu/img/finaldeallogo.png" // URL to your logo image (host it publicly)
          }),
        }
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
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAPIkey: process.env.SUPABASE_ANON_API_KEY,
    },
    supabaseKey: process.env.SUPABASE_KEY,
    jwtSecret: process.env.JWT_SECRET,
    secret_header: process.env.SECRET_HEADER,
    pepper: process.env.PEPPER,
    privateKey: process.env.PRIVATE_KEY,
    secretValue: process.env.SECRET_VALUE,
    emailPass: process.env.APP_PASSWORD,
    zohomailPass: process.env.ZOHO_PASSWORD,
    qrSecret: process.env.QR_SECRET,
  },

  routeRules: {
    '/stab/**': { appMiddleware: 'auth' }, // Apply auth middleware to all /stab/ routes
  },

  css: [
    '~/assets/css/main.css',
  ],

  imports: {
    dirs: ['types'] // Ensure Nuxt loads custom types
  },

  plugins: [
    '~/plugins/dialog.ts',
    '~/plugins/notifications.ts',
    // other plugins
  ],

  future: {
    compatibilityVersion: 4,
  },

  vite: {
    build: {
      rollupOptions: {
        external: [
          '/public/img/logo.jpeg' // Explicitly add the problematic file to external
        ]
      }
    }
  },

  modules: ['@formkit/auto-animate']
});
