<template lang="pug">
  .site-boby
    app-icons
    app-header(v-if="!loading")
    section.container(v-if="breadcrumbs && breadcrumbs.length")
      v-breadcrumbs(:items="breadcrumbs")

    nuxt
    app-footer(v-if="!loading")
</template>

<script>
import appIcons from '~/components/common/app-icons'
import AppHeader from '~/components/header/app-header/app-header'
import AppFooter from '~/components/footer/app-footer/app-footer'
import vBreadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'


export default {
  components: {
    appIcons,
    vBreadcrumbs,
    AppHeader,
    AppFooter,
  },
  // asyncData: async function ({store, params}) {
  //   await this.checkToken()
  //   await store.dispatch('settings/fetch')

  // },
  data: () => ({
    loading: false
  }),
  computed: {
    breadcrumbs() {return this.$store.getters['getBreadcrumbs'] || null},
    meta() {
      return [
        { hid: 'description1', name: 'description1', content: 'Главная1' }
      ]
    },
  },
  methods: {
    // async checkToken() {
    //   if (process.browser) {
    //     let token = localStorage.getItem('token')
    //     if (token) token = JSON.parse(token)
    //     console.log('token', token)

    //     if (token && token.hasOwnProperty('session_id') && token.session_id.length > 0) {
    //       console.log('token old')
    //       token.sessionDate = new Date()
    //       await this.$store.commit('token/setToken', token)
    //     } else {
    //       console.log('token new')
    //       token = await this.$store.dispatch('token/setNewToken')
    //       localStorage.setItem('token', JSON.stringify(token))
    //     }
    //   }

    // }

  },
  async mounted() {
    // await this.checkToken()
  }
}
</script>

<style>

</style>
