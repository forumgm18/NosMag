import Vue from 'vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from '../layouts/error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_plugin_219062be from 'nuxt_plugin_plugin_219062be' // Source: ./components/plugin.js (mode: 'all')
import nuxt_plugin_storage_3fae24dc from 'nuxt_plugin_storage_3fae24dc' // Source: ./storage.js (mode: 'all')
import nuxt_plugin_router_54326150 from 'nuxt_plugin_router_54326150' // Source: ./router.js (mode: 'all')
import nuxt_plugin_cookieuniversalnuxt_7b071642 from 'nuxt_plugin_cookieuniversalnuxt_7b071642' // Source: ./cookie-universal-nuxt.js (mode: 'all')
import nuxt_plugin_webfontloader_76677b92 from 'nuxt_plugin_webfontloader_76677b92' // Source: ./webfontloader.js (mode: 'client')
import nuxt_plugin_axios_53aa2337 from 'nuxt_plugin_axios_53aa2337' // Source: ./axios.js (mode: 'all')
import nuxt_plugin_datefns_29263735 from 'nuxt_plugin_datefns_29263735' // Source: ./date-fns.js (mode: 'all')
import nuxt_plugin_vuemodal_46b5cf07 from 'nuxt_plugin_vuemodal_46b5cf07' // Source: ../plugins/vue-modal.js (mode: 'client')
import nuxt_plugin_paginate_1ee734ea from 'nuxt_plugin_paginate_1ee734ea' // Source: ../plugins/paginate.js (mode: 'client')
import nuxt_plugin_loading_baa1819e from 'nuxt_plugin_loading_baa1819e' // Source: ../plugins/loading.js (mode: 'all')
import nuxt_plugin_btngoback_3bd830d2 from 'nuxt_plugin_btngoback_3bd830d2' // Source: ../plugins/btn-go-back.js (mode: 'all')
import nuxt_plugin_generateuuid_81b98f4e from 'nuxt_plugin_generateuuid_81b98f4e' // Source: ../plugins/generate.uuid.js (mode: 'all')
import nuxt_plugin_filters_2dd71012 from 'nuxt_plugin_filters_2dd71012' // Source: ../plugins/filters.js (mode: 'all')
import nuxt_plugin_vmask_3c04b27e from 'nuxt_plugin_vmask_3c04b27e' // Source: ../plugins/v-mask.js (mode: 'all')
import nuxt_plugin_auth_774679ce from 'nuxt_plugin_auth_774679ce' // Source: ./auth.js (mode: 'all')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    const globalNuxt = this.$root.$options.$nuxt
    if (process.client && !globalNuxt && typeof window !== 'undefined') {
      return window.$nuxt
    }
    return globalNuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

const originalRegisterModule = Vuex.Store.prototype.registerModule

function registerModule (path, rawModule, options = {}) {
  const preserveState = process.client && (
    Array.isArray(path)
      ? !!path.reduce((namespacedState, path) => namespacedState && namespacedState[path], this.state)
      : path in this.state
  )
  return originalRegisterModule.call(this, path, rawModule, { preserveState, ...options })
}

async function createApp(ssrContext, config = {}) {
  const router = await createRouter(ssrContext, config)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Fix SSR caveat https://github.com/nuxt/nuxt.js/issues/3757#issuecomment-414689141
  store.registerModule = registerModule

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"nosmag-site","htmlAttrs":{"lang":"ru"},"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1, maximum-scale=1 shrink-to-fit=no"},{"hid":"description","name":"description","content":""}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"}],"style":[],"script":[]},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (typeof nuxt_plugin_plugin_219062be === 'function') {
    await nuxt_plugin_plugin_219062be(app.context, inject)
  }

  if (typeof nuxt_plugin_storage_3fae24dc === 'function') {
    await nuxt_plugin_storage_3fae24dc(app.context, inject)
  }

  if (typeof nuxt_plugin_router_54326150 === 'function') {
    await nuxt_plugin_router_54326150(app.context, inject)
  }

  if (typeof nuxt_plugin_cookieuniversalnuxt_7b071642 === 'function') {
    await nuxt_plugin_cookieuniversalnuxt_7b071642(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_webfontloader_76677b92 === 'function') {
    await nuxt_plugin_webfontloader_76677b92(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_53aa2337 === 'function') {
    await nuxt_plugin_axios_53aa2337(app.context, inject)
  }

  if (typeof nuxt_plugin_datefns_29263735 === 'function') {
    await nuxt_plugin_datefns_29263735(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuemodal_46b5cf07 === 'function') {
    await nuxt_plugin_vuemodal_46b5cf07(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_paginate_1ee734ea === 'function') {
    await nuxt_plugin_paginate_1ee734ea(app.context, inject)
  }

  if (typeof nuxt_plugin_loading_baa1819e === 'function') {
    await nuxt_plugin_loading_baa1819e(app.context, inject)
  }

  if (typeof nuxt_plugin_btngoback_3bd830d2 === 'function') {
    await nuxt_plugin_btngoback_3bd830d2(app.context, inject)
  }

  if (typeof nuxt_plugin_generateuuid_81b98f4e === 'function') {
    await nuxt_plugin_generateuuid_81b98f4e(app.context, inject)
  }

  if (typeof nuxt_plugin_filters_2dd71012 === 'function') {
    await nuxt_plugin_filters_2dd71012(app.context, inject)
  }

  if (typeof nuxt_plugin_vmask_3c04b27e === 'function') {
    await nuxt_plugin_vmask_3c04b27e(app.context, inject)
  }

  if (typeof nuxt_plugin_auth_774679ce === 'function') {
    await nuxt_plugin_auth_774679ce(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // Wait for async component to be resolved first
  await new Promise((resolve, reject) => {
    const { route } = router.resolve(app.context.route.fullPath)
    // Ignore 404s rather than blindly replacing URL
    if (!route.matched.length && process.client) {
      return resolve()
    }
    router.replace(route, resolve, (err) => {
      // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
      if (!err._isRouter) return reject(err)
      if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

      // navigated to a different route in router guard
      const unregister = router.afterEach(async (to, from) => {
        if (process.server && ssrContext && ssrContext.url) {
          ssrContext.url = to.fullPath
        }
        app.context.route = await getRouteData(to)
        app.context.params = to.params || {}
        app.context.query = to.query || {}
        unregister()
        resolve()
      })
    })
  })

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
