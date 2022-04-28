<template lang="pug">
  div
    v-preloader.in-page(v-if="$fetchState.pending")
    main.container.razdel-page(v-else)
      section
        h1.page-title {{pageTitle}}
      section.content-section
        aside.sidebar-left
          sublinks-menu(v-if="data.sublinks_menu" :items="data.sublinks_menu.items")
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
              v-if="data.filters"
              :filters="data.filters"            
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
                      :options="data.sortmodes" 
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
              v-if="data.items" 
              :items="data.items" 
              :is-btn="true" 
              :is-sizes="true"
              )
            .pagination(v-if="data.items && data.items.length < itemsTotal")
              v-preloader.in-page(v-if="loading")
              template(v-if="!loading")
                .pagination-descr {{getPaginateText}}
                .btn.btn-4(@click="showMore") {{$options.SHOW_MORE_BTN}}
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Catalog',
  data() {
    return {
      testChb: false,
      testOpt: ['val-1', 'val-2', 'val-3', 'val-4'],
      test:[],
      // test:[{id:387,name:'зима'},{id:413,name:'лето'}],
      
      test2:[],

      data: {},

      priceFilter: {active_min: 0, active_max: 0},
      // selectedFilters: {},
      selectedFilters: [],
      sortBy: null,
      // loading: true,
      loading: false,
      loadingFiltered: false,
      filterCollapse: true,
      isFilterOpen: false,
      isSortOpen: false,
      //=========================
      items_only: 0,
      limitDefault: 8, // количество товаров на страницу
      // limit: 24, // количество товаров на страницу
      // offset: 0, // Странца пагинации
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
    let queryParams = {
      alias: this.$route.params.alias,
      items_only: this.items_only,
      limit: this.data.limit || this.limitDefault,
      offset: this.data.offset || 0,
    }
    const res = await this.loadData(queryParams)
    if (res && res !='error') this.setData(res)
    if (res ==='error') return this.$nuxt.error({ statusCode: 404, message: 'Раздел не найден' })
  },
  created() {
    if (this.data.sortmodes) this.sortBy = this.data.sortmodes.filter(el => el.active)[0]
  },
  mounted(){
    this.canMonitor = false // Запрещаем следить за Переменными
    this.$nextTick(() => { 
      // Подготавливаем объект выбранных фильтров и делаем его реактивным
      if ( this.data.filters ) {
          this.data.filters.filter(v => v.type != 'price')
                      .forEach( v => this.$set(this.selectedFilters, v.id, []) )
      }
      this.queryFiltersChange = -1
      this.canMonitor = true  
    })
  },
  computed: {
    ...mapState('token', ['session_id']),
    pageTitle() {return this.data.name || null},
    filtersPrice() { 
      return this.data.filters ? this.data.filters.find(f => f.type === 'price') : null
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
    itemsTotal() {return this.data.items_total_q || 0},
    getPaginateText() { 
      return `Отображается 
        ${Math.min(this.data.limit + this.data.offset, this.itemsTotal)} из ${this.itemsTotal}` 
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
  setData (val) {
    console.log('alias setProductList', val)
    if (val.status) this.$store.commit('setStatus', val.status)
    if (val.type) this.$store.commit('setType', val.type)
    // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val.data)) {
      if (key==='breadcrumbs' ) {
        this.$store.commit('setBreadcrumbs', v)
      } else {
        this.$set(this.data, key, v)
      }
        
    }
  },

  updateItems (val) {
    console.log('alias updateProductList', val)
    if (this.data.items) {
      this.data.items.push(...val.items)
    } else {
      this.$set(this.data, 'items', val.items)
    }
    val.limit ? this.data.limit = val.limit : this.$set(this.data, 'limit', val.limit)
    val.offset ? this.data.offset = val.offset : this.$set(this.data, 'offset', val.offset)
    val.items_page_q ? this.data.items_page_q = val.items_page_q : this.$set(this.data, 'items_page_q', val.items_page_q)
    val.items_total_q ? this.data.items_total_q = val.items_total_q : this.$set(this.data, 'items_total_q', val.items_total_q)
  // debugger
},



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



    async loadData(queryParam) {
      const c = await this.$axios.$get(`/get_content`, {
        params: {
          ...queryParam,
          session_id: this.session_id
          // session_id: this.$store.getters['token/getSessionId']
        }
      })
      // console.log('fetchProductList (content): ',c)

      if (c.status === 'ok') {
        if (c.type != 'razdel') return 'error'
        // Преобразуем строковые числа в числа
        const content = this.$parseJsonStrToNumbers(c)
        // добавляем поле active в фильтры
        if (content.data.filters && content.data.filters.length) { 
          content.data.filters.forEach(t => {
            if (Array.isArray(t.values)) {
              t.values = t.values.map((item) => {
                return item.hasOwnProperty('active') // если поле active уже есть
                  ? item                             // возвращаем как есть
                  : { ...item, active: 0 }           // если поля active нет то добавляем
              })
            }
          })
        }
        return content
      }

    },
    async loadProducts() {
      let queryParams = {
        alias: this.$route.params.alias,
        items_only: this.items_only,
        limit: this.data.limit || this.limitDefault,
        offset: this.data.offset || 0,
      }
      if (this.isFilter) queryParams['filters'] = this.queryFilters
      // Проверяем Обновился фильтр или нет
      // При изменении фильтра значение this.queryFiltersChange инкрементируется 
      let isNewFilter = this.isNewFilter != this.queryFiltersChange

      if (this.filtersChange != this.queryFiltersChange) {
        this.isNewFilter = this.queryFiltersChange
      }

      // return await this.$store.dispatch('productList/fetchProductList', {params: queryParams, isFilter: this.isFilter, isNewFilter})
      const data = await this.loadData(queryParams)

      if (this.isFilter && isNewFilter) {
        this.setData(data)
      } else {
        this.updateItems(data.data)
      }

    },
    async showMore() {
      this.loading = true
      this.data.offset += this.data.limit
      this.items_only = 1
      // await this.loadProducts(this.offset, 1)
      await this.loadProducts()
      // await this.$fetch()
      this.loading = false
    },
    async showFilteredProducts() {
      console.log('showFilteredProducts')
      this.loadingFiltered = true
      this.data.offset = 0 
      await this.loadProducts(this.offset, 1, true)
      this.loadingFiltered = false
    },
  },
  watch: {
    selectedFilters: {
      handler(val) {
        if (!process.browser || !this.canMonitor) return
        this.queryFiltersChange++ 
        console.log('wach selectedFilters', this.queryFiltersChange, this.canMonitor)

      },
      deep: true
    },
    priceFilter: {
      handler(val){
        if (!process.browser || !this.canMonitor) return
        this.queryFiltersChange++ 
        console.log('wach priceFilters', this.queryFiltersChange, this.canMonitor)
      },
      deep: true
    },
    queryFiltersChange(val){
      if (!process.browser) return
      console.log('wach queryFiltersChange', this.queryFiltersChange,this.canMonitor)

      if (val) this.showFilteredProducts()
    }

  }
}
</script>

<style lang="scss" >
/*@import '~/components/products/product';*/
@import 'razdel';
</style>
