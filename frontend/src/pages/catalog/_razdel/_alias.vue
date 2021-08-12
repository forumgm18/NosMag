<template lang="pug">
main.container
  section
    breadcrumbs(v-if="breadcrumbs"  :items="breadcrumbs")
  section
    h1.page-title {{title}}
  //-loading.center(v-if="loading")
  //-section.content-section(v-else)
  section.content-section
    aside.sidebar-left
      sublinks-menu(v-if="sublinks_menu" :items="sublinks_menu.items")


    article.main-content
      section.razdel-filter(:class="{collapse: filterCollapse}" v-if="1==1" )
        .filter-btn-block
          .sort-block
            .btn-icon(@click="sortOpen")
              svg.icon.icon-sort <use href="#icon-sort"/>
            .mobile-sort(:class="{open: isSortOpen}" data-mobile-sort)
              vnm-select-list(
                :multiple="false"
                item-type='radio'
                :options="sortmodes" 
                v-model="sortBy" 
                @input="sortOpen"
              )
          .btn-icon(@click="filterOpen")
            svg.icon.icon-filter <use href="#icon-filter"/>
  

        mobile-filter( 
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
            )
              template(#content)
                vnm-select-list(
                  :multiple="false"
                  item-type='radio'
                  :options="sortmodes" 
                  v-model="sortBy" 
                )

      section.razdel-content
        //-loading.center(v-if="loading")
        product-list( 
          v-if="products" 
          :items="products" 
          :is-btn="true" 
          :is-sizes="true"
        )
        //-client-only
          paginate(
            v-if="pageCount > 1"
            v-model="currentPage"              :page-count="pageCount"              :click-handler="pageChangeHandler"              :prev-text="`<icons class='icon'><use href='#icon-arrow-left'></use></icons>`"              :next-text="`<icons class='icon'><use href='#icon-arrow-right'></use></icons>`"              :container-class="'pagination'"              :page-link-class="'pagination-link'"              :prev-link-class="'pagination-link prev'"              :next-link-class="'pagination-link next'"              :hide-prev-next="true"              )

</template>

<script>
import Loading from '~/components/common/preloader/preloader'
import Breadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'
// import SublinksMenu from '~/components/common/sublinks-menu/sublinks-menu'
import ProductList from '~/components/products/product-list/product-list'
import MobileFilter from '~/components/filters/mobile-filter/mobile-filter'
import DesktopFilter from '~/components/filters/desktop-filter/desktop-filter'
import vDropdown from "~/components/common/v-dropdown/v-dropdown";
import vnmSelectList from '~/components/common/forms/vnm-select-list/vnm-select-list'

import { mapGetters } from 'vuex'



export default {
  name: 'Razdel',
  components: {
    Loading,
    Breadcrumbs,
    // SublinksMenu,
    ProductList,
    MobileFilter,
    DesktopFilter,
    vDropdown,
    vnmSelectList,
    // Paginate
  },
  data: () => ({
    selectedFilters: {},
    
    // loading: true,
    loading: false,
    filterCollapse: true,
    sortBy: null,
    isFilterOpen: false,
    isSortOpen: false,
  }),
  
  asyncData: async function ({store, params}) {
  // fetch: async function ({store, params}) {
    // console.log('catalog/_razdel/_alias params', params)
    // this.loading = true
    await store.dispatch('fetchContent', params.alias)
    // this.loading = false
    
  },
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
  created() {
    // this.currentPage = 1
    // this.pageChangeHandler(1)
    if (this.sortmodes) this.sortBy = this.sortmodes.filter(el => el.active)[0]
    
  },
  mounted(){
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
    }
  }
}
</script>

<style lang="scss" >
/*@import '~/components/products/product';*/
@import 'razdel';
</style>
