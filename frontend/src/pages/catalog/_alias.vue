<template lang="pug">
  main.container.clarifying-page
    v-preloader.in-page(v-if="$fetchState.pending")
    section.content-section(v-else)
      aside.sidebar-left(v-if="data.sublinks_menu")
        .sidebar-scroll
          v-sublinks-menu(:items="data.sublinks_menu.items")

      article.main-content
        .main-tile(v-if="data.sublinks")
          nuxt-link.main-tile-item(v-for="(lnk, iLnk) in data.sublinks" :key="iLnk" :to="lnk.link")
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
  data() {
    return {
      data:{}
    }
  },
  async fetch() {
    const res = await this.$axios.$get(`/get_content`, {
      params: {
        alias: this.$route.params.alias,
        // session_id: rootState.token.session_id
      }
    })
    console.log('fetch res', res)
    if (!res.status ) return this.$nuxt.error({ statusCode: 404, message: 'Раздел Каталога не найден' })
      // цикл по ключам и значениям
    for (let [key, v] of Object.entries(res.data)) {
      if (key==='breadcrumbs') {
        this.$store.commit('setBreadcrumbs', v)
      } else {
        this.$set(this.data, key, v)
      }

    }
  },
}
</script>

<style lang="scss">
@import '~/pages/main-page';
@import 'catalog';

</style>
