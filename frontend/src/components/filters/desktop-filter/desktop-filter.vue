<template lang="pug">
  .desktop-filter
    .desktop-filter-collapse(:class="{collapse: filterCollapse}")
      //vnm-select-list(:options="filters[0].values" :id="filters[0].id" v-model="selectList")
      filter-select.is-sort(
        :options="sortmodes"
        :settings="sortmodesSettings"
        contentType="list"
        title="Сортировать по"
        v-on:input="changeSort"
      )
        template(#option="{opt}")
          span.check
          span.filter-option_item-text {{opt.name}}

      filter-select(
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
          span.filter-option_item-color(v-if="opt.code && (opt.code === 'multicolor' || opt.code === 'bw')"
            :class="{'is-border': opt.border,  multicolor: opt.code === 'multicolor', 'black-white is-border' : opt.code === 'bw'}")
          span.filter-option_item-color( v-else-if="opt.code" :class="{'is-border': opt.border}" :style="`background-color: ${opt.code}`" )
          span.filter-option_item-text {{opt.name}}

        template(v-slot:price="{pr}" v-else-if="selectContentType(fs.type)==='price'")

    .desktop-filter-collapse-btn(:class="{collapse: filterCollapse}" @click="filterCollapseToggle")
      svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>




</template>

<script>
  import FilterSelect from '~/components/filters/filter-select/filter-select'
  import InputNumber from '~/components/common/forms/input-number/input-number'
  import vnmSelectList from '~/components/common/forms/vnm-select-list/vnm-select-list'
  export default {
    name: 'desktop-filter',
    props: ['filters', 'sortmodes'],
    components: {
      FilterSelect,
      InputNumber,
      vnmSelectList
    },
    data: () => ({
      // loading: true,
      // loading: false,
      selectList:[],
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
    }),

    methods: {
      selectContentType(v) {
        if (v === 'list' || v === 'color') return 'list'
        if (v === 'price') return 'price'
        return 'block'
      },
      filterCollapseToggle() {this.filterCollapse = !this.filterCollapse},
      changeFilter(v) {
        console.log('desktop-filter changeFilter v: ',v)
        const cur = this.selectedFilters.find(item => item.id === v.id)
        if (cur) {
          if (v.contentType === 'price'){
            cur.values = v.values
            return
          }
          if (v.values.length){
            cur.values = v.values
          } else {
            this.selectedFilters.splice(this.selectedFilters.findIndex(item => item.id === v.id), 1)
          }

        } else {
           this.selectedFilters.push(v)
        }
      },
      changeFilterPrice(v){
        console.log('desktop-filter changeFilterPrice: ', v)
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
      },
      changeSort(v) {
        console.log('desktop-filter changeSort v: ',v)
        this.sortBy = v.values.id
      },

    }

    }
</script>

<style lang="scss" scoped>
 @import "desktop-filter";
</style>
