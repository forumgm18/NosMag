<template lang="pug">
  main.clarifying-page
    section.container
      breadcrumbs(:items="BreadcrumbsItems")
      h1.page-title(v-if="sublinks_menu") {{sublinks_menu.header}}
    section.container.content-section
      sidebar.sidebar-left(v-if="sublinks_menu")
        sublinks-menu(:items="sublinks_menu.items")


      .main-content
        .main-tile(v-if="links")
          nuxt-link.main-tile-item(v-for="(lnk, iLnk) in links" :to="lnk.link")
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
import SublinksMenu from '~/components/common/sublinks-menu/sublinks-menu'
import Breadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'
export default {
  name: 'clarifying-selection-page',
  components: {SublinksMenu, Breadcrumbs},
  data: () => ({
    sublinks_menu: null,
    BreadcrumbsItems: [
      {name: 'Главная', alias: '/'},
      {name: 'Раздел', alias: '/razdel'},
      {name: 'Носки', alias: ''},
    ],

  }),
  computed: {
    content: s => s.$store.getters['getContentData'],

    // showcase() { return this.content.showcase},
    links() { return this.content.hasOwnProperty('sublinks') ? this.content.sublinks : undefined},

    // showcase: {
    //   get: function() { return this.content.showcase},
    //   set: function(v) {return }
    // }
  },
  async mounted () {
    this.sublinks_menu = await this.content.sublinks_menu
  }

}
</script>

<style lang="scss">
@import '~/pages/main-page/main-page';
@import 'styles';

</style>
