<template lang="pug">
  main.clarifying-page
    section.container.content-section
      sidebar.sidebar-left
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
export default {
  name: 'clarifying-selection-page',
  computed: {
    content: s => s.$store.getters['getContentData'],
    // showcase() { return this.content.showcase},
    links() { return this.content.hasOwnProperty('sublinks') ? this.content.sublinks : undefined},

    // showcase: {
    //   get: function() { return this.content.showcase},
    //   set: function(v) {return }
    // }
  },

}
</script>

<style lang="scss">
@import '~/pages/main-page/main-page';
.content-section {
  border: 1px solid red;
  display: flex;
  align-items: flex-start;
}
.main-content {
  max-width: 1170px;
  flex-grow: 1;
  margin-left: auto;
}
.sidebar{
  &-left {
    border: 1px solid green;
    flex-shrink: 0;
    flex-basis: 25%;
    /*width: 380px;*/

  }
}
.clarifying-page .main-tile {
  --col: 2;
  --m: 60px;
  &-item {
    max-width: 500px;
    &-img {
      &:before {
        padding-bottom: 100%;
      }
    }
  }
}

</style>
