<template lang="pug">
  div
    v-preloader.in-page(v-if="$fetchState.pending")
    main.container.clarifying-page(v-else)
    section.content-section
      aside.sidebar-left(v-if="sublinks_menu")
        .sidebar-scroll
          v-sublinks-menu(:items="sublinks_menu.items")


      article.main-content
        .main-tile(v-if="links")
          nuxt-link.main-tile-item(v-for="(lnk, iLnk) in links" :key="iLnk" :to="lnk.link")
            .main-tile-item-img
              .img-box.hover
                .button-select Выбрать
              .img-box
                picture
                  source( media="(min-width: 993px)" :srcset="`${lnk.images.xl}, ${lnk.images.xl_x2} x2`")
                  source( media="(max-width: 992px)" :srcset="`${lnk.images.lg}, ${lnk.images.lg_x2} x2`")
                  source( media="(max-width: 576px)" :srcset="`${lnk.images.sm}, ${lnk.images.sm_x2} x2`")
                  img(:src="lnk.images.sm" :alt="lnk.name")
            .main-tile-item-title {{lnk.name}}

</template>

<script>
// import ScrollBar from 'vue2-scrollbar'

export default {
  name: 'clarifying-selection-page',
  components: {
    // ScrollBar, 
    },
  data: function () {
    return {
      loading: true,
    }
  },
  // fetch: async function ({app, store, params, error}) {
  //   console.log('catalog/_alias params', params)
  //   // console.log('process.env', process.env)
  //   this.loading = true
  //   // const path = this.$route.path.split('/')
  //   // const alias = path[path.length - 1]

  //   await store.dispatch('fetchContent', params.alias)
  //   if (app.$contentError(store.state.content.type)) error({ statusCode: 404, message: '' })
  //   this.loading = false
  // },

  async fetch() {
    await this.$store.dispatch('fetchContent', this.$route.params.alias)
    if (this.$contentError(this.$store.state.content.type)) error({ statusCode: 404, message: '' })
  },


  computed: {
    content: s => s.$store.getters['getContentData'],
    title() {return this.content.data.name || ''},
    breadcrumbs() {return this.content.breadcrumbs || null},
    sublinks_menu() {return this.$store.state.content.data.sublinks_menu || null},

    // showcase() { return this.content.showcase},
    links() { return this.content.hasOwnProperty('sublinks') ? this.content.sublinks : undefined},

    // showcase: {
    //   get: function() { return this.content.showcase},
    //   set: function(v) {return }
    // }
  },
  async mounted () {
    // this.sublinks_menu = await this.content.sublinks_menu
  }

}
</script>

<style lang="scss">
@import '~/pages/main-page';
@import 'catalog';

</style>
