<template lang="pug">
  //loading(v-if="loading")
  //loading(v-if="$fetchState.pending")
  //div(v-else)
  div
    //main-page( )
    main-page(v-if="pageType === 'main'" :showcase="content.showcase" )
    clarifying-selection-page(v-else-if="pageType === 'sublinks'" :title="content.name")
    razdel(v-else-if="pageType === 'razdel'" :title="content.name")
    //catalog-item(v-else="pageType === 'catalog-item'" :prod="content")

</template>

<script>
import Loading from '~/components/common/loading'
// import AppHeader from '~/components/header/app-header/app-header'
// import MainPage from '~/pages/main-page'
const MainPage = () => import(/* webpackChunkName: "main-page" */ '~/pages/main-page/main-page')
const ClarifyingSelectionPage = () => import(/* webpackChunkName: "clarifying-selection-page" */ '~/pages/rout-pages/clarifying-selection-page')
const Razdel = () => import(/* webpackChunkName: "catalog" */ '~/pages/catalog/razdel/razdel')
//const CatalogItem = () => import(/* webpackChunkName: "catalog-item" */ '~/pages/catalog/catalog-item')
export default {
  components: { Loading, MainPage,
    ClarifyingSelectionPage,
    Razdel,
    //CatalogItem,
    // AppHeader
  },
  data: () => ({
    loading: true,
    // pageType: ''
  }),
  fetch: async function () {
    this.loading = true
    await this.checkToken()
    const path = this.$route.path.split('/')
    const alias = path[path.length - 1]
    await this.$store.dispatch('fetchContent', alias)
    this.loading = false
  },
  computed: {
    pageType: s => s.$store.getters['getPageType'],
    content: s => s.$store.getters['getContentData'],
    token: s => s.$store.getters['token/getToken'],
    meta() {
      return [
        { hid: 'description2', name: 'description2', content: 'Главная2' }
      ]
    },

  },
  head() {
    // const canonical = `https://mysite.com${this.$route.path
    const canonical = `${this.$route.path
      .toLowerCase()
      .replace(/\/$/, '')}`
    return {
      title: this.content.title || 'nosmag-new!',
      meta: [...this.meta],
      link: [{ rel: 'canonical', href: canonical }]
    }
  },

  async mounted() {
    await this.checkToken()
    console.log('pageType: ', this.pageType)
    console.log('content: ', this.content)
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
  }

}
</script>

<style lang="scss" scoped>
.verstka-main-link{
  display: block;
  margin-bottom: .5em;
}
</style>
