const isDev = process.env.NODE_ENV !== 'production'
// const srcPath = 'src/'
export default {
  publicRuntimeConfig: {
    // baseURL: process.env.NODE_ENV === 'production' ? '78.24.223.226' : 'http://nosmag-new.local',
    baseURL: process.env.BROWSER_BASE_URL,
    axios: {
      // prefix: `${process.env.API_PREFIX}/`,
      // https: process.env.API_PROTOCOL === 'https',
      // baseURL: process.env.SERVER_BASE_URL + process.env.API_PREFIX
      // browserBaseURL: process.env.SERVER_BASE_URL + process.env.API_PREFIX,
      browserBaseURL: process.env.BROWSER_BASE_URL + process.env.API_PREFIX,
      baseURL: process.env.SERVER_BASE_URL + process.env.API_PREFIX

  },

  },
  privateRuntimeConfig: {
    // apiSecret: process.env.API_SECRET
  },
  head: {
    title: 'nosmag-site',
    htmlAttrs: {
      lang: 'ru',
    },
    meta: [
      { charset: 'utf-8' },
      // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1 shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  rootDir: __dirname,
  serverMiddleware: [],
  router: {
    // prefetchLinks: false,
  },
  // Customize the progress-bar color
  // loading: {
  //   // color: 'blue',
  //   continuous: true,
  // },
  // loading: '~/components/common/loading.vue',
  // loadingIndicator: {
  //   name: 'circle',
  //   color: '#3B8070',
  //   background: 'white'
  // },

  // Global CSS: https://go.nuxtjs.dev/config-css



  styleResources: {
    scss: ['./assets/scss/utils/vars.scss', './assets/scss/utils/mixins.scss'], // alternative: scss
  },
  css: [
    '@/assets/scss/utils/reset.scss',
    '@/assets/scss/utils/css-vars.scss',
    '@/assets/scss/global-styles.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/yamap.js',  mode: 'client' },
    { src: '~/plugins/vue-modal.js', mode: 'client' },
    { src: '~/plugins/v-mask.js', mode: 'client' },
    { src: '~/plugins/vue-perfect-scrollbar.js', mode: 'client' },
    // { src: '~/plugins/vue-clamp.js', mode: 'client' },
    '~/plugins/vue-clamp.js',
    '~/plugins/vue-gallery.js',
    '~/plugins/vuelidate.js',
    '~/plugins/floating-vue.js',
    '~/plugins/loading.js',
    '~/plugins/secondary-functions.js',
    '~/plugins/filters.js',
    '~/plugins/directives/auto-min-width.client.js',

    // '~/plugins/v-mask.js',
    // '~/plugins/v-select.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,
  components: [
    {
      path: '~/components/common/',
      prefix: 'v',
      ignore: ['-*.vue'],
    },
    {
      path: '~/components/icons/',
      prefix: 'v',
      ignore: ['-*.vue'],
    },
    {
      path: '~/components/forms/',
      prefix: 'v',
      ignore: ['-*','-*.vue'],
    },
    {
      path: '~/components/header/',
      prefix: ''
    },
    {
      path: '~/components/footer/',
      prefix: ''
    },
    {
      path: '~/components/filters/',
      prefix: 'v'
    },
    {
      path: '~/components/products/',
      prefix: '',
      // ignore: ['-*','-*.vue'],
    },
    {
      path: '~/components/page/',
      prefix: 'page',
      // ignore: ['-*','-*.vue'],
    },
    {
      path: '~/components/yamap/',
      prefix: 'v',
      // ignore: ['-*','-*.vue'],
    },
    {
      path: '~/components/pvz-info/',
      prefix: 'v',
      ignore: ['-*.vue'],
      // ignore: ['-*','-*.vue'],
    },
    {
      path: '~/components/order/',
      // pattern: `**/*.vue`,
      prefix: 'v',
      // ignore: ['-*.vue'],
      // ignore: ['-*','-*.vue'],
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    '@nuxtjs/date-fns'
  ],
  dateFns: {
    locales: ['ru'],
    defaultLocale: 'ru'
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-trailingslash-module',
    'nuxt-webfontloader',
    // 'cookie-universal-nuxt',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    '@nuxtjs/style-resources',
    // '@nuxtjs/router',
    // '@nuxtjs/universal-storage',

  ],
  webfontloader: {
    events: false,
    google: {
      families: ['Roboto:wght@400;500;700;900&display=swap'],
    },
    timeout: 5000,
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios

  build: {
    optimizeCss: false,
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
      css: ({ isDev }) => (isDev ? '[name].css' : 'css/[contenthash].css'),
      img: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
      font: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
      video: ({ isDev }) =>
        isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]',
    },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ],
    },    
    ...(!isDev && {
      html: {
        minify: {
          collapseBooleanAttributes: true,
          decodeEntities: true,
          minifyCSS: true,
          // minifyJS: true,
          minifyJS: false,
          processConditionalComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          trimCustomFragments: true,
          useShortDoctype: true,
        },
      },
    }),
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true,
    },
    optimization: {
      // minimize: !isDev,
      minimize: false,
    },
    ...(!isDev && {
      extractCSS: {
        ignoreOrder: true,
      },
    }),
    transpile: ['vue-lazy-hydration', 'intersection-observer'],
    postcss: {
      plugins: {
        ...(!isDev && {
          cssnano: {
            preset: [
              'advanced',
              {
                autoprefixer: false,
                cssDeclarationSorter: false,
                zindex: false,
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }),
      },
      ...(!isDev && {
        preset: {
          browsers: 'cover 99.5%',
          autoprefixer: true,
        },
      }),

      order: 'cssnanoLast',
    },
    extend(config, ctx) {
      // config.resolve.alias['vue'] = 'vue/dist/vue.common'
      config.resolve.alias.vue = 'vue/dist/vue.common'
    },
  },
}
