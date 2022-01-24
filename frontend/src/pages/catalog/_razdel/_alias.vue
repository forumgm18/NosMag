<template lang="pug">
  div
    v-preloader.in-page(v-if="$fetchState.pending")
    main.container.razdel-page(v-else)
      section
        h1.page-title {{title}}
      section.content-section
        aside.sidebar-left
          sublinks-menu(v-if="sublinks_menu" :items="sublinks_menu.items")
          //- v-radio-set(
            :options="sortmodes" 
            v-model="sortBy" 
            )


        article.main-content
          section.razdel-filter(:class="{collapse: filterCollapse}" v-if="1==1" )
            .filter-btn-block
              .sort-block
                .btn-icon(@click="sortOpen")
                  svg.icon.icon-sort <use href="#icon-sort"/>
                .mobile-sort(:class="{open: isSortOpen}" data-mobile-sort)
                  v-radio-set(
                    :multiple="false"
                    item-type='radio'
                    :options="sortmodes" 
                    v-model="sortBy" 
                    @input="sortOpen"
                  )
              .btn-icon(@click="filterOpen")
                svg.icon.icon-filter <use href="#icon-filter"/>
      

            //- mobile-filter( 
              v-if="filters"
              :filters="filters"            
              :class="{open: isFilterOpen}"            
              v-model="selectedFilters"
              @filters-close="isFilterOpen=false" 
              @apply-filter="applyFilter"
              )
            desktop-filter(
              v-if="filters"
              :filters="filters"            
              :class="{open: isFilterOpen}" 
              v-model="selectedFilters"         
              )
              template(#sort)
                v-dropdown.is-sort(
                  title="Сортировать по"
                  :multiple="false"
                  key="sort-1"
                )
                  template(#content)
                    v-radio-set(
                      :options="sortmodes" 
                      v-model="sortBy" 
                    )

          section.razdel-content(v-if="loadingFiltered")
            v-preloader.in-page
          section.razdel-content(v-else)

            product-list(
              v-if="products" 
              :items="products" 
              :is-btn="true" 
              :is-sizes="true"
              )
            .pagination(v-if="products.length < itemsTotal")
              v-preloader.in-page(v-if="loading")
              .pagination-descr(v-if="!loading") {{getPaginateText}}
              .btn.btn-4(@click="showMore") {{$options.SHOW_MORE_BTN}}
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Razdel',
  components: { },
  data() {
    return {
      selectedFilters: {},
      // loading: true,
      loading: false,
      loadingFiltered: false,
      filterCollapse: true,
      sortBy: null,
      isFilterOpen: false,
      isSortOpen: false,
      //=========================
      limit: 10, // количество товаров на страницу
      offset: 0, // Странца пагинации
      queryFilters: [],
      queryFiltersChange: false,
      selModel: [],
      // selModel: [{id:1519, name: 'AROS' },{id:428, name: 'Atlantic' },],

      }
  },
  SHOW_MORE_BTN: 'Показать далее',
  async fetch() {
    await this.$store.dispatch('productList/fetchProductList', {
      params:{
        alias: this.$route.params.alias,
        items_only: 0,
        limit: this.limit,
        offset: this.offset
      },
      isFilter: false  
    })
    // if (this.$contentError(this.$store.state.content.type)) error({ statusCode: 404, message: '' })
  },

  computed: {
    ...mapGetters('settings',['sortmodes']),
    title() {return this.$store.getters['productList/getTitle']},
    products() { return this.$store.getters['productList/getProductList']},
    filters() { return this.$store.getters['productList/getFilters']},
    breadcrumbs() {return this.$store.getters['getBreadcrumbs']},
    sublinks_menu() { return this.$store.getters['productList/getSublinksMenu'] },
    itemsTotal() {return this.$store.getters['productList/getProductsTotal']},
    getPaginateText() { 
      return `Отображается 
        ${Math.min(this.limit + this.offset, this.itemsTotal)} из ${this.itemsTotal}` 
    }
  },
  created() {
    if (this.sortmodes) this.sortBy = this.sortmodes.filter(el => el.active)[0]
    // if (this.sortmodes) this.sortBy = this.sortmodes.filter(el => el.active)[0].name
  },
  beforeMount() {
    if (process.client) document.addEventListener('click', this.hideSort, true)
  },
  beforeDestroy(){
    if (process.client) document.removeEventListener('click', this.hideSort)
  },
  methods: {
    hideSort(e){
      if (e.target.closest('[data-mobile-sort]')) return
      this.isSortOpen = false
    },
    applyFilter(v){
      console.log('applyFilter: ', v)
    },
    
    filterOpen() {
      this.isFilterOpen = !this.isFilterOpen
    },
    sortOpen() {
      this.isSortOpen = !this.isSortOpen
    },
    async loadProducts(offset, items_only, isFilter = false) {
      // this.offset = isFilter ? 0 : this.offset + this.limit
      let queryParams = {
        alias: this.$route.params.alias,
        items_only,
        limit: this.limit,
        offset,
      }
      if (this.queryFilters && this.queryFilters.length) queryParams['filters'] = this.queryFilters

      await this.$store.dispatch('productList/fetchProductList', {params: queryParams, isFilter})
    },
    async showMore() {
      this.loading = true
      this.offset += this.limit
      await this.loadProducts(this.offset, 1)
      this.loading = false
    },
    async showFilteredProducts() {
      console.log('showFilteredProducts')
      this.loadingFiltered = true
      this.offset = 0 
      await this.loadProducts(this.offset, 1, true)
      this.loadingFiltered = false
    },
  },
  watch: {
    selectedFilters: {
      handler(val) {
        return
        if (!process.browser) return
        this.queryFilters = []
          // цикл по ключам и значениям
        for (let [key, v] of Object.entries(val)) {
          if ( Array.isArray(v) ){
            if (v.length) {
              this.queryFilters.push({
                id: key,
                value: v.map(item => item.id)
              }) 
            }
          } else {
              // this.queryFilters.push({
              //   id: key,
              //   value: [v.active_min, v.active_max ]
              // }) 
          }
          
        }
      },
      deep: true
    },
    queryFilters: {
      handler(val) {
        if (!process.browser) return
        console.log('queryFilters')
        if (this.queryFiltersChange) this.showFilteredProducts()
        this.queryFiltersChange = true
      },
      deep: true
    },

  }
}
</script>

<style lang="scss" >
/*@import '~/components/products/product';*/
@import 'razdel';
</style>
