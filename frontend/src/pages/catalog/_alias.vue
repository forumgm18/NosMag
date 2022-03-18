<template lang="pug">
  main.container.clarifying-page
    v-preloader.in-page(v-if="$fetchState.pending")
    section.content-section(v-else)
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
export default {
  name: 'clarifying-selection-page',
  async fetch() {
    const res = await this.$store.dispatch('fetchContent', this.$route.params.alias)
    if (res ==='error') return this.$nuxt.error({ statusCode: 404, message: '' })
  },
  computed: {
    breadcrumbs() {return this.$store.getters['getBreadcrumbs']},
    sublinks_menu() {return this.$store.getters['getSublinksMenu']},
    links() { return this.$store.getters['getSublinks']},
  },
}
</script>

<style lang="scss">
@import '~/pages/main-page';
@import 'catalog';

</style>
