<template lang="pug">
  .mobile-filters
    .mobile-filter.open(:class="{'subfilter-open': selectedFilterId}")
      .mobile-filter_close(@click="closeAllFilters")
      .mobile-filter_modal
        .mobile-filter_title
          span.title Фильтры
          span.close(@click="closeAllFilters")
            svg.icon.icon-close <use href="#icon-close"/>

        .mobile-filter_body
          .mobile-filter_content
            scroll-bar.mobile-filter_scroll
              div
                .mobile-filter_item(v-for="f in filters" :key="f.id" @click.stop="selectFirst(f.id)")
                  span.title {{f.name}}
                  span.link.mla(@click.stop="clearFilter(f.id)") Сбросить

    .mobile-filter(v-for="f in filters" :key="f.id" :class="{open: selectedFilterId === f.id}")
      //.mobile-filter_close
      .mobile-filter_modal
        .mobile-filter_title
          span.come-back(@click="closeSubFilter")
            svg.icon.icon-arrow-default.left <use href="#icon-arrow-default"/>
          span.title {{f.name}}
          span.close(@click="closeSubFilter")
            svg.icon.icon-close <use href="#icon-close"/>

        .mobile-filter_body
          .mobile-filter_content
            .mobile-filter_item.jcsb
              span.link Выбрать все
              span.link Сбросить
            scroll-bar.mobile-filter_scroll
              div
                .mobile-filter_item(v-for="v in f.values" :key="v.id")
                  //span.mobile-filter_item-text {{v.name}}
                  //span.check.border
                  //checkbox(v-model="f.checked" checked) {{v.name}}
                  //checkbox(:valueId="v.id" :filterId="f.id" @change="filterChange") {{v.name}}
                  checkbox(:value="v" v-model="selectedFilters") {{v.name}}

          .mobile-filter_footer
            .btn Сбросить
            .btn Применить


</template>

<script>
  // import VueSlickCarousel from 'vue-slick-carousel'
  // import 'vue-slick-carousel/dist/vue-slick-carousel.css'
  // import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
  import ScrollBar from 'vue2-scrollbar'
  import checkbox from "~/components/common/forms/checkbox/checkbox";
  export default {
    name: 'mobile-filter',
    components: {
      // VueSlickCarousel
      ScrollBar,
      checkbox
    },
    props: ['filters'],
    data: () => ({
      // loading: true
      selectedFilterId: null,
      selectedFilters: []
    }),
    methods: {
      selectFirst(id) {this.selectedFilterId = id},
      clearFilter(id){},
      closeSubFilter() {this.selectedFilterId = null},
      closeAllFilters() {
        this.selectedFilterId = null
        this.$emit('filters-close', false)
      },
      filterChange(val) {
        console.log(val)
      }
    },
  }
</script>

<style lang="scss">
  @import "mobile-filter";
  .vue-scrollbar__scrollbar-vertical {
    width: 2px;
    .scrollbar {
      width: 2px;
    }
  }
</style>
