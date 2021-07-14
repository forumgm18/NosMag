<template lang="pug">
  main.container
    section
      breadcrumbs(v-if="breadcrumbs"  :items="breadcrumbs")
    section
      h1.page-title  {{title}}
    section.container.content-section
      sidebar.sidebar-left
        sublinks-menu(v-if="sublinks_menu" :items="sublinks_menu.items")


      section.main-content
        section.razdel-filter(:class="{collapse: filterCollapse}")
          .razdel-filter-collapse(:class="{collapse: filterCollapse}")
            vnm-select.is-sort(
              :options="sortmodes"
              :settings="sortmodesSettings"
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
              :settings="filterSettings"
              :options="fs.values"
              :title="fs.name"
              v-on:input="changeFilter"
              )
              template(#option="{opt}")
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

          .razdel-filter-collapse-btn(:class="{collapse: filterCollapse}" @click="filterCollapseToggle")



        section.razdel-content
          loading.static(v-if="loading")
          product-list(v-else :items="products" :is-btn="true" :is-sizes="true")
          client-only
            paginate(
              v-if="pageCount > 1"
              v-model="currentPage"
              :page-count="pageCount"
              :click-handler="pageChangeHandler"
              :prev-text="`<icons class='icon'><use href='#icon-arrow-left'></use></icons>`"
              :next-text="`<icons class='icon'><use href='#icon-arrow-right'></use></icons>`"
              :container-class="'pagination'"
              :page-link-class="'pagination-link'"
              :prev-link-class="'pagination-link prev'"
              :next-link-class="'pagination-link next'"
              :hide-prev-next="true"
              )


</template>

<script>
import Breadcrumbs from '~/components/common/breadcrumbs/breadcrumbs'
// import SublinksMenu from '~/components/common/sublinks-menu/sublinks-menu'
import ProductList from '~/components/products/product-list'
import FilterSelect from '~/components/filters/filter-select/filter-select'
import SortSelect from '~/components/sorts/sort-select/sort-select'
import VnmSelect from '~/components/common/forms/vnm-select/vnm-select'
import { mapActions, mapGetters } from 'vuex'



export default {
  name: 'Razdel',
  components: {
    Breadcrumbs,
    // SublinksMenu,
    ProductList,
    FilterSelect,
    SortSelect,
    VnmSelect,
    // Paginate
  },
  props: ['title'],
  data: () => ({
    BreadcrumbsItems: [
      {name: 'Главная', alias: '/'},
      {name: 'Раздел', alias: '/razdel'},
      {name: 'Носки', alias: ''},
    ],
    loading: true,
    filterCollapse: true,
    selectedFilters: [],
    sortBy: null,
    filterSettings: {
      multiple: true,
      titleCount: true
    },
    sortmodesSettings: {
      titleCount: false
    }
  }),
  computed: {
    ...mapGetters('razdel',['products', 'page', 'pageCount']),
    ...mapGetters('settings',['sortmodes']),
    filters() { return this.$store.state.content.data.filters},
    breadcrumbs() {return this.$store.state.content.data.breadcrumbs || null},
    currentPage: {
      get: function() { return this.page},
      set: function(value) { this.$store.commit('razdel/setPage', value) }
    },
  },
  created() {
    this.currentPage = 1
    this.pageChangeHandler(1)
  },
  methods: {
    ...mapActions('razdel',['fetchContent']),
    async pageChangeHandler(page) {
      this.loading = true
      await this.fetchContent()
      this.loading = false
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







  }
}
</script>

<style lang="scss" >
@import '~/components/products/product';
@import 'styles';
.pagination {
  margin-top: 2em;
  .active {
    .pagination-link { background-color: var(--base-color2);}
  }
}
</style>
