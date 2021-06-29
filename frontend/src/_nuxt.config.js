const imageminMozjpeg = require('imagemin-mozjpeg')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const isDev = process.env.NODE_ENV !== 'production'
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
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
    prefetchLinks: false,
  },
  // Customize the progress-bar color
  // loading: { color: 'blue' },
  // loading: '~/components/common/loading.vue',
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
    { src: '~~/plugins/vue-modal.js', mode: 'client' },
    { src: '~~/plugins/paginate.js', mode: 'client' },
    // { src: '~~/plugins/vuebar.js', mode: 'client' },
    // { src: '~~/plugins/vue-awesome-swiper.js', mode: 'client' },
    '~~/plugins/loading.js',
    '~~/plugins/btn-go-back.js',
    '~~/plugins/generate.uuid.js',
    '~~/plugins/filters.js',
    '~~/plugins/v-mask.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

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
    'cookie-universal-nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/router',
    '@nuxtjs/universal-storage',
    // ['nuxt-vuex-localstorage', {
    //   mode: 'debug',
    //   localStorage:['catalog'],
    //   // sessionStorage: ['token']
    // }]
  ],
  storage: {
    localStorage: { prefix: '' },
    // initialState,  // Object {}
    // ignoreExceptions //
  },
  webfontloader: {
    events: false,
    google: {
      // families: ['PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap'],
      families: ['Roboto:wght@400;500;700&display=swap'],
    },
    timeout: 5000,
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},
  // render: {
  //   // http2: {
  //   //     push: true,
  //   //     pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
  //   //     .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
  //   //   },
  //   // compressor: false,
  //   resourceHints: false,
  //   etag: false,
  //   static: { etag: false }
  // },
  // Build Configuration: https://go.nuxtjs.dev/config-build
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
          minifyJS: true,
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
      minimize: !isDev,
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
    // extend(config, ctx) {
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
    //   // const svgRule = {
    //   //   test: /\.svg$/,
    //   //   // use: ['babel-loader', 'vue-icons-loader', 'url-loader']
    //   //   oneOf: [
    //   //     {
    //   //       resourceQuery: /inline/,
    //   //       use: vueSvgLoader,
    //   //     },
    //   //     {
    //   //       resourceQuery: /data/,
    //   //       loader: 'url-loader',
    //   //     },
    //   //     {
    //   //       resourceQuery: /raw/,
    //   //       loader: 'raw-loader',
    //   //     },
    //   //     {
    //   //       loader: 'file-loader', // By default, always use file-loader
    //   //     },
    //   //   ],
    //   // }
    //
    //   // config.module.rules.push(svgRule) // Actually add the rule
    // },
    extend(config, { loaders }){
      loaders.scss.additionalData = '@use "sass:math";'
    },
  },
}
