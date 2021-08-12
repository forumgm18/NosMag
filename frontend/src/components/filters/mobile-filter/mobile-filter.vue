<template lang="pug">
  .mobile-filters(v-if="filters")
    .mobile-filter.open(:class="{'subfilter-open': selectedFilterId}")
      .mobile-filter_close(@click="closeAllFilters")
      .mobile-filter_modal
        .mobile-filter_title
          span.title Фильтры
          span.close(@click="closeAllFilters")
            svg.icon.icon-close <use href="#icon-close"/>

        .mobile-filter_body
          .mobile-filter_content
            .mobile-list
              scroll-bar.mobile-filter_scroll
                div
                  .mobile-filter_item(v-for="f in filters" :key="f.id" @click.stop="selectFirst(f.id)")
                    span.title {{f.name}}
                    span.title_selected-items {{printSelectedItems(f.id)}}
                    span.link.mla(v-if="currentFilterLength(f.id)" @click.stop="clearAllFilterItems(f.id)") {{$options.RESET_TEXT}}
          .mobile-filter_footer
            .btn.btn-mobile-filter.btn-base2-transparent(@click="clearAllFilters") {{$options.RESET_TEXT}}
            .btn.btn-mobile-filter(@click.stop="applyFilter") {{$options.APPLY_TEXT}}



    .mobile-filter(v-for="f in filters" :key="f.id" :class="{open: selectedFilterId === f.id}")
      .mobile-filter_modal(:class="{price: f.type===$options.FILTER_PRICE}")
        .mobile-filter_title(:class="{price: f.type===$options.FILTER_PRICE}")
          span.come-back(@click="closeSubFilter")
            svg.icon.icon-arrow-default.left <use href="#icon-arrow-default"/>
          span.title {{f.name}}
          span.close(@click="closeSubFilter")
            svg.icon.icon-close <use href="#icon-close"/>

        .mobile-filter_body
          .mobile-filter_content(v-if="f.type===$options.FILTER_PRICE")
            input-number.price-filter(
              :has-label="true"
              :min="f.values.min"
              :max="f.values.max"
              :step="$options.PRICE_STEP"
              v-model="model[`${f.id}`].active_min"
              :val="f.values.min"
              label="от"
              border-color="currentColor"
              style="margin-right: 10px;"

              )
            input-number.price-filter(
              label="до"
              :has-label="true"
              :min="f.values.min"
              :max="f.values.max"
              :step="$options.PRICE_STEP"
              :val="f.values.max"
              v-model="model[`${f.id}`].active_max"
              border-color="currentColor"

            )

          .mobile-filter_content(v-else)
            .mobile-filter_item.jcsb
              span.link(@click="selectAllFilterItems(f.id)") {{$options.CHOOSE_ALL_TEXT}}
              span.link(@click="clearAllFilterItems(f.id)") {{$options.RESET_TEXT}}
            .mobile-list
              vnm-select-list(
                v-if="f.values"
                :id="f.id"
                :multiple="true"
                item-type='checkbox'
                :options="f.values" 
                v-model="model[`${f.id}`]"
                
                )
                template(#optText="{opt}" ) 
                  span.filter-option_item-color(v-if="opt.code && (opt.code === 'multicolor' || opt.code === 'bw')"
                    :class="{'is-border': opt.border,  multicolor: opt.code === 'multicolor', 'black-white is-border' : opt.code === 'bw'}")
                  span.filter-option_item-color( v-else-if="opt.code" :class="{'is-border': opt.border}" :style="`background-color: ${opt.code}`" )
                  span.filter-option_item-text {{opt.name}}

          .mobile-filter_footer
            .btn.btn-mobile-filter.btn-base2-transparent(@click="clearAllFilterItems(f.id)") {{$options.RESET_TEXT}}
            .btn.btn-mobile-filter(@click.stop="applyFilter") {{$options.APPLY_TEXT}}


</template>

<script>
  import ScrollBar from 'vue2-scrollbar'
  import vnmSelectList from '~/components/common/forms/vnm-select-list/vnm-select-list'
  import inputNumber from '~/components/common/forms/input-number/input-number'

  export default {
    name: 'mobile-filter',
    components: {
      ScrollBar,
      vnmSelectList,
      inputNumber,
    },
    props: {
      filters: {
        type: [Array, Object],
        required: true
      },
      value: {
        type: [Array, Object]
      }
    },
    data: () => ({
      selectedFilterId: null,
    }),
    PRICE_STEP: 100,
    RESET_TEXT: 'Сбросить',
    APPLY_TEXT: 'Применить',
    CHOOSE_ALL_TEXT: 'Выбрать все',
    FILTER_PRICE: 'price',
    created(){
      // Подготавливаем объект выбранных фильтров и делаем его реактивным
      this.filters.forEach(el => {
        if (el.type!=this.$options.FILTER_PRICE) {
          this.$set(this.model, el.id, [])
        } else {
          this.$set(this.model, el.id, {active_min : el.values.min, active_max : el.values.max})
        }
      });
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('change', val);
        },
      },

    },
    methods: {
      prepareFilters() {
        let filters = Object.fromEntries(
                        Object.entries(this.model)
                          .filter(el => el[1].length > 0)
                        )
        const pf = this.filters.find(el => el.type===this.$options.FILTER_PRICE) // Цену обрабатываем отдельно
        const priceF = this.model[pf.id]                // Находим выбранный диапазон цен
        if (priceF.active_min > pf.values.min || priceF.active_max < pf.values.max) 
          // Если выбранный диапазон цен "внутри" разрешенного то добавляем фильтр цены  
          filters[pf.id] = priceF
        return filters
      },
      applyFilter() {
        this.closeSubFilter()
        this.$emit('apply-filter', this.prepareFilters())
        // this.$emit('filters-close', false)
      },
      currentFilterLength(id) {
        if (this.model[id]) return this.model[id].length > 0
        return false
        },
      selectFirst(id) {this.selectedFilterId = id},
      selectAllFilterItems(id) {
        const v = this.filters.find(el => el.id === id).values
        v.forEach(el => {
          if (!this.model[id].includes(el)) this.model[id].push(el) 
        }) 

      },
      clearAllFilterItems(id) {
        const pf = this.filters.find(el => el.type===this.$options.FILTER_PRICE)
        // console.log('pf: ', pf)
        if (id === pf.id) {
          this.model[id] = {active_min : pf.values.min, active_max : pf.values.max}
        }
        else {this.model[id] = []}
        
      },
      printSelectedItems(id) {
        if (!this.filters) return ''
        const pf = this.filters.find(el => el.type===this.$options.FILTER_PRICE)
        const arr = this.model[id]
        // console.log('pf: ', pf)
        // console.log('arr: ', arr)
        if (pf && id === pf.id ) {
          return `от ${arr.active_min}руб. до ${arr.active_max}руб.`
        }

        if (!arr || !arr.length ) return ''
        let str = arr.reduce((s, el) => s + el.name + ', ', '').trim()
        str = str.slice(0, str.length - 1)
        return str
      },
      clearAllFilters(){
        const pf = this.filters.find(el => el.type===this.$options.FILTER_PRICE)
        // console.log('pf: ', pf)
        this.filters.forEach(el => {
          if (el.id === pf.id) {
            this.model[el.id] = {active_min : el.values.min, active_max : pf.values.max}
        }
        else {this.model[el.id] = [] }
        });
      },

      clearFilter(id){},
      closeSubFilter() {this.selectedFilterId = null},
      closeAllFilters() {
        this.selectedFilterId = null
        this.$emit('filters-close', false)
      },

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
