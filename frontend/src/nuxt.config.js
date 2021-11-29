// const imageminMozjpeg = require('imagemin-mozjpeg')
// const ImageminPlugin = require('imagemin-webpack-plugin').default
const isDev = process.env.NODE_ENV !== 'production'
// const srcPath = 'src/'
export default {
  // runtimeCompiler: true,
  // srcDir: 'src/',
  // Global page headers: https://go.nuxtjs.dev/config-head
  // env: {
  //   baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  //   apiUrl: process.env.API_URL || '???',
  //   _AXIOS_BASE_URL_: process.env.API_URL || 'http://localhost:3000/api'
  // },
  publicRuntimeConfig: {
    // baseURL: process.env.NODE_ENV === 'production' ? '78.24.223.226' : 'http://nosmag-new.local',
    baseURL: process.env.BROWSER_BASE_URL,
    // axiosApiHost: 'nosmag.ru',
    // axiosApiPrefix: '/api',
    // axiosApiProtocol: 'https',
    // axiosApiPort: 443,

  //   axios: {
  //     prefix: `${process.env.API_PREFIX}/`,
  //     https: process.env.API_PROTOCOL === 'https',
  //     baseURL: `${process.env.API_PROTOCOL || 'https'}://${process.env.API_HOST}${process.env.API_PREFIX}`,
  //     browserBaseURL: `${process.env.API_PROTOCOL || 'https'}://${process.env.API_HOST}${process.env.API_PREFIX}`,
  // },
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



  css: ['./assets/scss/global-styles.scss'],
  styleResources: {
    // your settings here
    // scss: ['./assets/scss/global-variables.scss'], // alternative: scss
    scss: ['./assets/scss/utils/vars.scss', './assets/scss/utils/mixins.scss'], // alternative: scss
    less: [],
    stylus: [],
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/yamap.js',  mode: 'client' },
    { src: '~/plugins/vue-modal.js', mode: 'client' },
    { src: '~/plugins/v-mask.js', mode: 'client' },
    '~/plugins/vuelidate.js',
    // { src: '~/plugins/paginate.js', mode: 'client' },
    // { src: '~/plugins/popper.js', mode: 'client' },
    // { src: '~~/plugins/vuebar.js', mode: 'client' },
    // { src: '~~/plugins/vue-awesome-swiper.js', mode: 'client' },
    '~/plugins/loading.js',
    // '~/plugins/btn-go-back.js',
    // '~/plugins/-generate.uuid.js',
    '~/plugins/secondary-functions.js',
    '~/plugins/filters.js',
    '~/plugins/vuebar.js',
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
      prefix: ''
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
  // storage: {
  //   localStorage: { prefix: '' },
  //   // initialState,  // Object {}
  //   // ignoreExceptions //
  // },
  webfontloader: {
    events: false,
    google: {
      // families: ['PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap'],
      // families: ['Roboto:wght@400;500;700&display=swap'],
      families: ['Roboto:wght@400;500;600;700;800;900&display=swap'],
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
    //   const ORIGINAL_TEST = '/\\.(png|jpe?g|icons|webp)$/i'
    //   const vueSvgLoader = [
    //     {
    //       loader: 'vue-icons-loader',
    //       options: {
    //         svgo: false,
    //       },
    //     },
    //   ]
    //   const imageMinPlugin = new ImageminPlugin({
    //     pngquant: {
    //       quality: '5-30',
    //       speed: 7,
    //       strip: true,
    //     },
    //     jpegtran: {
    //       progressive: true,
    //     },
    //     gifsicle: {
    //       interlaced: true,
    //     },
    //     plugins: [
    //       imageminMozjpeg({
    //         quality: 70,
    //         progressive: true,
    //       }),
    //     ],
    //   })
    //   if (!ctx.isDev) config.plugins.push(imageMinPlugin)
    //
    //   config.module.rules.forEach((rule) => {
    //     if (rule.test.toString() === ORIGINAL_TEST) {
    //       rule.test = /\.(png|jpe?g|webp)$/i
    //       rule.use = [
    //         {
    //           loader: 'url-loader',
    //           options: {
    //             limit: 1000,
    //             name: ctx.isDev
    //               ? '[path][name].[ext]'
    //               : 'img/[contenthash:7].[ext]',
    //           },
    //         },
    //       ]
    //     }
    //   })
    //   //  Create the custom SVG rule
    //   const svgRule = {
    //     test: /\.svg$/,
    //     // use: ['babel-loader', 'vue-icons-loader', 'url-loader']
    //     oneOf: [
    //       {
    //         resourceQuery: /inline/,
    //         use: vueSvgLoader,
    //       },
    //       {
    //         resourceQuery: /data/,
    //         loader: 'url-loader',
    //       },
    //       {
    //         resourceQuery: /raw/,
    //         loader: 'raw-loader',
    //       },
    //       {
    //         loader: 'file-loader', // By default, always use file-loader
    //       },
    //     ],
    //   }
    //
    //   config.module.rules.push(svgRule) // Actually add the rule
    },
  },
}
