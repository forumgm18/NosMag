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
            //- mobile-filter( 
              v-if="filters"
              :filters="filters"            
              :class="{open: isFilterOpen}"            
              v-model="selectedFilters"
              @filters-close="isFilterOpen=false" 
              @apply-filter="applyFilter"
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
                  popper-class="filter-item_popper-container filter-price_popper-container"
                  )
                  .filter-item_title(:tabindex="1")
                    span.text {{filtersPrice.name}}
                    .filter-item_close(v-close-popper)
                      svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
                  template(#popper)
                    .filter-item_price
                      .filter-price-block
                        v-input-number.filter-price_item(
                          v-model="priceFilter[0]"
                          before-text="от"
                          :append-text="currencyShort"
                          :has-spin-btn="false"
                          :min="filtersPrice.values.min"
                          :max="priceFilter[1]"
                          border-color="var(--base-color4)"
                          focus-border-color="var(--base-color1)"
                          hover-border-color="var(--base-color3)"
                          )
                        v-input-number.filter-price_item(
                          v-model="priceFilter[1]"
                          before-text="до"
                          :append-text="currencyShort"
                          :has-spin-btn="false"
                          :min="priceFilter[0]"
                          :max="filtersPrice.values.max"
                          border-color="var(--base-color4)"
                          focus-border-color="var(--base-color1)"
                          hover-border-color="var(--base-color3)"
                          )
                      .filter-price_slider
                        vue-slider(
                          v-model="priceFilter"
                          :min="filtersPrice.values.min"
                          :max="filtersPrice.values.max"
                          tooltip="none"
                          @drag-start="priceFilterChangeStart"
                          @drag-end="priceFilterChangeEnd"
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
      data: {},
      priceFilter: [0, 0],
      // priceFilter: [this.filtersPrice.values.min || 0, this.filtersPrice.values.max || 0],
      selectedFilters: {},
      sortBy: null,
      // loading: true,
      loading: false,
      loadingFiltered: false,
      filterCollapse: true,
      isFilterOpen: false,
      //=========================
      items_only: 0,
      limitDefault: 8, // количество товаров на страницу
      // limit: 24, // количество товаров на страницу
      // offset: 0, // Странца пагинации
      // queryFilters: [],
      queryFiltersChange: 0,
      isNewFilter: 0,
      canMonitor: false,  // Компонент инициализирован и можно следить за Переменными

    }
  },
  SHOW_MORE_BTN: 'Показать далее',
  PRICE_STEP: 100,
  async fetch() {
    this.$store.commit('setBreadcrumbs', [])

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
  head() {
    return {
      title: this.data.title || 'Каталог',
      meta: [
        { hid: 'description', name: 'description', content: this.data.description || 'Каталог' }
      ]
    }
  },

  created() {
    if (this.data.sortmodes) this.sortBy = this.data.sortmodes.filter(el => el.active)[0]
    console.log('created', this.filtersPrice, this.data)
  },
  mounted(){
    this.canMonitor = false // Запрещаем следить за Переменными
    this.$nextTick(() => { 
      // Подготавливаем объект выбранных фильтров и делаем его реактивным
      if ( this.data.filters ) {
          this.data.filters.filter(v => v.type != 'price')
                      .forEach( v => this.$set(this.selectedFilters, v.id, []) )
      }
      console.log('mounted', this.filtersPrice, this.data)
      if (this.filtersPrice) this.priceFilter = [this.filtersPrice.values.min, this.filtersPrice.values.max]
      // this.queryFiltersChange = -1
      this.queryFiltersChange = -3
      this.canMonitor = true  
    })
  },
  computed: {
    ...mapState('token', ['session_id']),
    ...mapState('settings', ['currencyShort']),

    pageTitle() {return this.data.h1 || this.data.name || null},
    filtersPrice() { 
      return this.data && this.data.filters ? this.data.filters.find(f => f.type === 'price') : null
      },
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
      
      // if (pf.active_min != 0 || pf.active_max != 0) {
      //   res.push({
      //           id: this.filtersPrice.id,
      //           value: [pf.active_min, pf.active_max ]
      //         })
      // }
      if (pf[0] != 0 || pf[1] != 0) {
        res.push({
                id: this.filtersPrice.id,
                value: pf
              })
      }
      return res

    }
  },
  methods: {
    setData (val) {
      console.log('alias setProductList', val)
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



    // applyFilter(v){
    //   console.log('applyFilter: ', v)
    // },
    
    filterToggle() {
      this.isFilterOpen = !this.isFilterOpen
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

      // if (this.filtersChange != this.queryFiltersChange) {
      //   this.isNewFilter = this.queryFiltersChange
      // }

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
    priceFilterChangeStart() {
      this.canMonitor = false
    },
    priceFilterChangeEnd() {
      this.canMonitor = true
      this.queryFiltersChange++ 
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
      console.log('wach queryFiltersChange', val, val < 0,this.canMonitor)

      if (!process.browser || val < 0) return

      if (val) this.showFilteredProducts()
    }

  }
}
</script>

<style lang="scss" >
/*@import '~/components/products/product';*/
@import 'razdel';
.vue-slider-dot-handle {
  border: 2px solid #{$themeColor};
  box-shadow: none;
}
.filter {
  &-price {
    &_popper-container {
      .v-popper__inner {padding: 1em;}
    }
    &-block {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    &_item{
      font-size: .7rem;
      // border-color: var(--base-color4);
      padding: .5em .3571em;
      min-width: 3rem;
      &:first-child{margin-right: .5rem;}
      &:last-child{margin-left: .5rem;}
      .number-input-block {
        margin: 0;
        span {
          &:first-child {
            padding-left: 0;
            padding-right: .25em;  
            }
        }
      }
      
      // .input-field {
      //   --input-height: 1.4rem;        
      //   padding: 0 .3571em ;
      //   // padding: 0;
      // }
      // input {padding: 0 .1em ;}
    }
  }
}

</style>
