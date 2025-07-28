
export default defineNuxtConfig({
  runtimeConfig: {
    API_URL: 'https://eth-mainnet.alchemyapi.io/v2',
    API_KEY: 'MV_Oh2fNciRN7IZ14QhR4VRDiF9VztlY',
    public: {
      NETWORK_ID: '0x89'
    }
  },
  css: [
    '~/assets/css/tailwind.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ['@ethersproject']
  },
  vite: {
    optimizeDeps: {
      include: ['bn.js', 'js-sha3', 'hash.js', 'aes-js', 'scrypt-js', 'bech32']
    },
    resolve: {
    }
  },
  modules: [
    '@vueuse/nuxt'
  ]
})
