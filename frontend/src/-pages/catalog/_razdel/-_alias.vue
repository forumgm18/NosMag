<template lang="pug">
  main.container
    section
      breadcrumbs(v-if="breadcrumbs"  :items="breadcrumbs")
    section
      h1.page-title  {{title}}
    //loading.center(v-if="loading")
    //section.content-section(v-else)
    section.content-section
      aside.sidebar-left
        sublinks-menu(v-if="sublinks_menu" :items="sublinks_menu.items")


      article.main-content
        section.razdel-filter(:class="{collapse: filterCollapse}" v-if="1==1" )
          .filter-btn-block
            .btn-icon
              svg.icon.icon-sort <use href="#icon-sort"/>
            .btn-icon(@click="filterOpen")
              svg.icon.icon-filter <use href="#icon-filter"/>

          mobile-filter(:filters="filters" :class="{open: isFilterOpen}" v-on:filters-close="isFilterOpen=false")
          .razdel-filter-collapse(:class="{collapse: filterCollapse}")
            //.filter-title
              span Фильтры
              .btn-icon
                svg.icon.icon-close <use href="#icon-close"/>

            vnm-select.is-sort(
              :options="sortmodes"
              :settings="sortmodesSettings"
              contentType="list"
              title="Сортировать по"
              v-on:input="changeSort"
            )
              template(#option="{opt}")
                span.check
                span.vnm-option_item-text {{opt.name}}

            vnm-select(
              v-for="fs in filters"
              :key="fs.id"
              :id="fs.id"
              :contentType="selectContentType(fs.type)"
              :settings="filterSettings"
              :options="fs.values"
              :title="fs.name"
              :class="{'is-price' : selectContentType(fs.type)==='price'}"
              v-on:input="changeFilter"
            )
              template(v-slot:option="{opt}" v-if="selectContentType(fs.type)==='list'")
                span.check.border
                span.vnm-option_item-color(
                  v-if="opt.code && opt.code === 'multicolor'"
                  :style="`background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)`"
                  )
                span.vnm-option_item-color.is-border(
                  v-else-if="opt.code && opt.code === 'bw'"
                  :style="`background: linear-gradient(to right, #000 0%, #000 50%, #fff 50%, #fff 100%)`"
                  )
                span.vnm-option_item-color(
                  v-else-if="opt.code"
                  :style="`background-color: ${opt.code}`"
                  )
                span.vnm-option_item-text {{opt.name}}

              template(v-slot:price="{pr}" v-else-if="selectContentType(fs.type)==='price'")
                input-number.price-filter(
                  :id="fs.id"
                  name="price-do"
                  label="от"
                  :has-label="true"
                  :min="pr.min"
                  :max="pr.max"
                  :step="100"
                  :val="pr.min"
                  border-color="currentColor"
                  style="margin-right: 10px;"
                  v-on:input:number="changeFilterPrice"

                )
                input-number.price-filter(
                  :id="fs.id"
                  name="price-ot"
                  label="до"
                  :has-label="true"
                  :min="pr.min"
                  :max="pr.max"
                  :step="100"
                  :val="pr.max"
                  border-color="currentColor"
                  v-on:input:number="changeFilterPrice"
                )


          .razdel-filter-collapse-btn(:class="{collapse: filterCollapse}" @click="filterCollapseToggle")
            svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>



        section.razdel-content
          //loading.center(v-if="loading")
          product-list( :items="products" :is-btn="true" :is-sizes="true")
          //client-only
            paginate(
              v-if="pageCount > 1"
              v-model="currentPage"              :page-count="pageCount"              :click-handler="pageChangeHandler"              :prev-text="`<icons class='icon'><use href='#icon-arrow-left'></use></icons>`"              :next-text="`<icons class='icon'><use href='#icon-arrow-right'></use></icons>`"              :container-class="'pagination'"              :page-link-class="'pagination-link'"              :prev-link-class="'pagination-link prev'"              :next-link-class="'pagination-link next'"              :hide-prev-next="true"              )

</template>

<script>
  import Loading from '~/components/common/preloader/preloader'
import Breadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'
// import SublinksMenu from '~/components/common/sublinks-menu/sublinks-menu'
import ProductList from '~/components/products/product-list/product-list'
// import FilterSelect from '~/components/filters/filter-select/filter-select'
import SortSelect from '~/components/sorts/sort-select/sort-select'
import VnmSelect from '~/components/common/forms/vnm-select/vnm-select'
import InputNumber from '~/components/common/forms/input-number/input-number'
import MobileFilter from '~/components/filters/mobile-filter/mobile-filter'

import { mapActions, mapGetters } from 'vuex'



export default {
  name: 'Razdel',
  components: {
    Loading,
    Breadcrumbs,
    // SublinksMenu,
    ProductList,
    // FilterSelect,
    SortSelect,
    VnmSelect,
    InputNumber,
    MobileFilter,
    // Paginate
  },
  data: () => ({
    // loading: true,
    loading: false,
    filterCollapse: true,
    selectedFilters: [],
    sortBy: null,
    isFilterOpen: false,
    filterSettings: {
      multiple: true,
      titleCount: true
    },
    sortmodesSettings: {
      titleCount: false
    },
    price: null
  }),
  // fetch: async function ({store, params}) {
  //   console.log('catalog/_razdel/_alias params', params)
  //   this.loading = true
  //   // const path = this.$route.path.split('/')
  //   // const alias = path[path.length - 1]
  //   await store.dispatch('fetchContent', params.alias)
  //   // await ctx.$store.dispatch('fetchContent', params.alias)
  //   this.loading = false
  // },

  computed: {
    // ...mapGetters('razdel',['products', 'page', 'pageCount']),
    ...mapGetters('settings',['sortmodes']),
    title() {return this.$store.state.content.data.name || ''},
    products() { return this.$store.state.content.data.items || null},
    filters() { return this.$store.state.content.data.filters || null},
    // breadcrumbs() {return this.$store.state.content.data.breadcrumbs || null},
    breadcrumbs() {return this.$store.getters['getBreadcrumbs']},
    sublinks_menu() {return this.$store.state.content.data.sublinks_menu || null},
    currentPage: {
      get: function() { return this.page},
      set: function(value) { this.$store.commit('razdel/setPage', value) }
    },
  },
  // created() {
  //   this.currentPage = 1
  //   this.pageChangeHandler(1)
  // },
  methods: {
    // ...mapActions('razdel',['fetchContent']),
    // async pageChangeHandler(page) {
    //   this.loading = true
    //   await this.fetchContent()
    //   this.loading = false
    // },
    selectContentType(v) {

      if (v === 'list' || v === 'color') return 'list'
      if (v === 'price') return 'price'
      return 'block'
    },
    filterCollapseToggle() {this.filterCollapse = !this.filterCollapse},
    changeFilter(v) {
      console.log('changeFilter v: ',v)
      const cur = this.selectedFilters.find(item => item.id === v.id)
      if (cur) {
        cur.values = v.values
      } else {
        this.selectedFilters.push(v)
      }
    },
    changeFilterPrice(v){
      console.log('changeFilterPrice: ', v)
      // debugger
      const cur = this.selectedFilters.find(item => item.id === v.id)
      if (cur) {
        if (v.name === "price-ot") cur.values.active_min = v.val
        if (v.name === "price-do") cur.values.active_max = v.val
      } else {
        const arrV = {id: v.id, values:{active_min:null, active_max:null}}
        if (v.name === "price-ot") arrV.values.active_min = v.val
        if (v.name === "price-do") arrV.values.active_max = v.val
        this.selectedFilters.push(arrV)
      }

      //if (v.name==="price-ot")
    },
    changeSort(v) {
      console.log('changeSort v: ',v)
      this.sortBy = v.values.id
      // const cur = this.selectedFilters.find(item => item.id === v.id)
      // if (cur) {
      //   cur.values = v.values
      // } else {
      //   this.selectedFilters.push(v)
      // }
    },
    filterOpen() {
      this.isFilterOpen = !this.isFilterOpen
    }
  }
}
</script>

<style lang="scss" >
/*@import '~/components/products/product';*/
@import 'razdel';

.product-list {
  --col: 4;
  --m: 9px;
  @include media-max-width2(1700) {--col: 3;}
  @include media-max-width2(991) {--col: 2;}
}



.pagination {
  margin-top: 2em;
  .active {
    .pagination-link { background-color: var(--base-color2);}
  }
}
</style>
