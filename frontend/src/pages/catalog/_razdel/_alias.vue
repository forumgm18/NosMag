<template lang="pug">
  div
    v-preloader.in-page(v-if="$fetchState.pending")
    main.container.razdel-page(v-else)
      section
        h1.page-title {{pageTitle}}
      section.content-section
        aside.sidebar-left
          sublinks-menu(v-if="sublinks_menu" :items="sublinks_menu.items")
          //- v-listbox2(
            :options="testOpt" 
            v-model="test" 
            )
            template(#text="{opt}" ) {{opt}}

        article.main-content
          section.razdel-filter(:class="{collapse: filterCollapse}" v-if="1==1" )
            //- .filter-btn-block
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
              .btn-icon(@click="filterToggle")
                svg.icon.icon-filter <use href="#icon-filter"/>
      

            //- mobile-filter( 
              v-if="filters"
              :filters="filters"            
              :class="{open: isFilterOpen}"            
              v-model="selectedFilters"
              @filters-close="isFilterOpen=false" 
              @apply-filter="applyFilter"
              )
            //- v-desktop-filter(
              v-if="filters"
              :filters="filters"            
              :class="{open: isFilterOpen}" 
              v-model="test2"
              
              )
            v-desktop-filter2(
              v-if="filters"
              :filters="filters"            
              :class="{open: isFilterOpen}" 
              v-model="selectedFilters"
              )
              template(#sort)
                v-dropdown.filter-item.is-sort(
                  key="sort-1"
                  :distance="0"
                  placement="bottom-start"
                  popper-class="filter-item_popper-container"
                  )
                  .filter-item_title(:tabindex="1")
                    span.text Сортировать по
                    .filter-item_close(v-close-popper)
                      svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
                  template(#popper)
                    v-radio-set(
                      :options="sortmodes" 
                      v-model="sortBy" 
                      container-class="listbox"
                    )
              template(#price v-if="filtersPrice")
                v-dropdown.filter-item(
                  key="price-1"
                  :distance="0"
                  placement="bottom-start"
                  popper-class="filter-item_popper-container"
                  )
                  .filter-item_title(:tabindex="1")
                    span.text {{filtersPrice.name}}
                    .filter-item_close(v-close-popper)
                      svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
                  template(#popper)
                    .filter-item_price
                      .filter-price-block
                        v-input-number.price-filter(
                          :has-label="true"
                          :min="filtersPrice.values.min"
                          :max="priceFilter.active_max"
                          :step="$options.PRICE_STEP"
                          v-model="priceFilter.active_min"
                          label="от"
                          border-color="currentColor"
                          style="margin-right: 10px;"
                          )
                        v-input-number.price-filter(
                          label="до"
                          :has-label="true"
                          :min="priceFilter.active_min"
                          :max="filtersPrice.values.max"
                          :step="$options.PRICE_STEP"
                          v-model="priceFilter.active_max"
                          border-color="currentColor"
                        )


          section.razdel-content(v-if="loadingFiltered")
            v-preloader.in-page
          section.razdel-content(v-else)

            product-list.noselect(
              v-if="products" 
              :items="products" 
              :is-btn="true" 
              :is-sizes="true"
              )
            .pagination(v-if="products && products.length < itemsTotal")
              v-preloader.in-page(v-if="loading")
              template(v-if="!loading")
                .pagination-descr {{getPaginateText}}
                .btn.btn-4(@click="showMore") {{$options.SHOW_MORE_BTN}}
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Catalog',
  data() {
    return {
      testChb: false,
      testOpt: ['val-1', 'val-2', 'val-3', 'val-4'],
      test:[],
      // test:[{id:387,name:'зима'},{id:413,name:'лето'}],
      
      test2:[],
      priceFilter: {active_min: 0, active_max: 0},
      selectedFilters: {},
      sortBy: null,
      // loading: true,
      loading: false,
      loadingFiltered: false,
      filterCollapse: true,
      isFilterOpen: false,
      isSortOpen: false,
      //=========================
      items_only: 0,
      limit: 24, // количество товаров на страницу
      offset: 0, // Странца пагинации
      // queryFilters: [],
      queryFiltersChange: 0,
      isNewFilter: 0,
      canMonitor: false,  // Компонент инициализирован и можно следить за Переменными
      // selModel: [],
      // selModel: [{id:1519, name: 'AROS' },{id:428, name: 'Atlantic' },],

      }
  },
  SHOW_MORE_BTN: 'Показать далее',
  PRICE_STEP: 100,
  async fetch() {
    const res = await this.loadProducts()
    if (res ==='error') return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
  },
  created() {
    // this.canMonitor = false
    if (this.sortmodes) this.sortBy = this.sortmodes.filter(el => el.active)[0]
  },
  mounted(){
    this.canMonitor = false // Запрещаем следить за Переменными
    this.queryFiltersChange = 0
    // Подготавливаем объект выбранных фильтров и делаем его реактивным
    this.filters.filter(v => v.type != 'price')
                .forEach( v => this.$set(this.selectedFilters, v.id, []) )
    this.$nextTick(() => { this.canMonitor = true  })
    // console.log('catalog selectedFilters', this.selectedFilters)
    // debugger
  },
  computed: {
    ...mapGetters('settings',['sortmodes']),
    // pageTitle() {return this.$store.getters['productList/getPageTitle']},
    pageTitle() {return this.$store.getters['getPageTitle']},
    products() { return this.$store.getters['productList/getProductList']},
    filters() { return this.$store.getters['productList/getFilters']},
    filtersPrice() { 
      // return null
      return this.filters ? this.filters.find(f => f.type === 'price') : null
      },
    // priceRange() {
    //   if (this.filters) {
    //     const priceFilter = this.filters.find(v => v.type === 'price')
    //     if (priceFilter) return priceFilter.max - priceFilter.min
    //   }
    //   return 0
    // },

    isFilter() { // Если выбран какой-либо фильтр
      return this.queryFilters && this.queryFilters.length 
      },
    sublinks_menu() { return this.$store.getters['productList/getSublinksMenu'] },
    itemsTotal() {return this.$store.getters['productList/getProductsTotal']},
    getPaginateText() { 
      return `Отображается 
        ${Math.min(this.limit + this.offset, this.itemsTotal)} из ${this.itemsTotal}` 
    },
    queryFilters(){
      const res = Object.entries(this.selectedFilters)
                        .filter(([key, v]) => v.length)
                        .map(([key,v]) => {
                          return {
                            id: key,
                            value: v.map(item => item.id)
                          }
                        })
      const pf = this.priceFilter
      
      if (pf.active_min != 0 || pf.active_max != 0) {
        res.push({
                id: this.filtersPrice.id,
                value: [pf.active_min, pf.active_max ]
              })
      }
      return res

    }
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
    
    filterToggle() {
      this.isFilterOpen = !this.isFilterOpen
    },
    sortOpen() {
      this.isSortOpen = !this.isSortOpen
    },
    async loadProducts() {
      let queryParams = {
        alias: this.$route.params.alias,
        items_only: this.items_only,
        limit: this.limit,
        offset: this.offset,
      }
      if (this.isFilter) queryParams['filters'] = this.queryFilters
      // Проверяем Обновился фильтр или нет
      // При изменении фильтра значение this.queryFiltersChange инкрементируется 
      let isNewFilter = this.isNewFilter != this.queryFiltersChange

      if (this.filtersChange != this.queryFiltersChange) {
        this.isNewFilter = this.queryFiltersChange
      }

      return await this.$store.dispatch('productList/fetchProductList', {params: queryParams, isFilter: this.isFilter, isNewFilter})
    },
    async showMore() {
      this.loading = true
      this.offset += this.limit
      this.items_only = 1
      // await this.loadProducts(this.offset, 1)
      await this.loadProducts()
      // await this.$fetch()
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
        if (!process.browser || !this.canMonitor) return
        this.queryFiltersChange++ 
      },
      deep: true
    },
    priceFilter: {
      handler(val){
        if (!process.browser || !this.canMonitor) return
        this.queryFiltersChange++ 
      },
      deep: true
    },
    queryFiltersChange(val){
      if (!process.browser) return
      if (val) this.showFilteredProducts()
    }

  }
}
</script>

<style lang="scss" >
/*@import '~/components/products/product';*/
@import 'razdel';
</style>
