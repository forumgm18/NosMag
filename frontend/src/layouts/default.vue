<template lang="pug">
  .site-boby(data-site-body)
    icons
    app-header(v-if="!loading")
    nuxt
    app-footer(v-if="!loading")
</template>

<script>
// import nsmConf from '~/static/site-settings/nos-mag-config.json'

import Icons from '~/components/common/icons'
import AppHeader from '~/components/header/app-header/app-header'
import AppFooter from '~/components/footer/app-footer/app-footer'

// import TabSize from '~/components/modals/tab-size'
// import BasketAddModal from '~~/components/modals/basket-add-modal'


export default {
  components: {
    Icons,
    AppHeader,
    AppFooter,
    // BasketAddModal, TabSize
  },

  data: () => ({
    // slogan: '',
    // headerPhone: '',
    // loading: true
    loading: false
  }),

  fetch: async function ({store, params}) {
    this.loading = true
    await this.checkToken()
    console.log('default params:', params)

    // //await this.$store.dispatch('settings/fetch')
    // await this.$store.dispatch('menu/fetch')
    //
    // // const path = this.$route.path.split('/')
    // // const alias = path[path.length - 1]
    //  await this.$store.dispatch('settings/fetch')
    // // await this.$store.dispatch('menu/fetch')
    // await store.dispatch('fetchContent', params.alias)

    this.loading = false
  },
  computed: {
    meta() {
      return [
        // { charset: 'utf-8' },
        // { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1 shrink-to-fit=no' },
        { hid: 'description1', name: 'description1', content: 'Главная1' }
      ]
    },
    // headerSettings() {return this.$store.getters['settings/headerSettings']},
    // users() {      return this.$store.getters['users/users']    }

  },
  methods: {
    async checkToken() {
      let token = this.$storage.getLocalStorage('token')
      console.log('token: ', token)
      if (token && token.session_id.length > 0) {
        console.log('token (if)')
        token.sessionDate = new Date()
        await this.$store.commit('token/setToken', token)
      } else {
        console.log('token (else)')
        token = await this.$store.dispatch('token/setNewToken')
        this.$storage.setLocalStorage('token', this.token)
      }

    }

  },
  // head () {
  //   // const canonical = `https://mysite.com${this.$route.path
  //   const canonical = `${this.$route.path
  //     .toLowerCase()
  //     .replace(/\/$/, '')}`
  //   return {
  //     // title: nsmConf.title,
  //     meta: [...this.meta],
  //     script: [
  //       // { src: 'https://markknol.github.io/console-log-viewer/console-log-viewer.js' }
  //     ],
  //     link: [{ rel: 'canonical', href: canonical }]
  //   }
  // }

}
</script>

<style>

</style>
