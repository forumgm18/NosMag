<template lang="pug">
  main.has-filter
    section.container.base-bgr-color
      h1.page-title.mb-0
        //btn-go-back
        span {{title}}
    section.container
      .catalog-detail
        section.catalog-filter
          filter-section(
            v-for="fs in $store.state.content.data.filters"
            :key="fs.id"
            :id="fs.id"
            :items="fs.values"
            v-on:input="changeFilter"
            ) {{fs.name}}


        loading(v-if="loading")
        section.catalog-content(v-else)
          .catalog-sort(v-if="products.length")
            .catalog-sort-label Сортировать по:
            label.catalog-sort-item
              input(type="checkbox" name="sortByRating" hidden)
              span.sort-direction
                span рейтингу
                svg.icon <use href="#icon-arrow-left"></use>
            label.catalog-sort-item
              input(type="checkbox" name="sortByPrice" hidden)
              span.sort-direction
                span цене
                svg.icon <use href="#icon-arrow-left"></use>

          product-list(:items="products" :is-btn="true" :is-sizes="true")
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
import ProductList from '~/components/products/product-list'
import FilterSection from '~/components/filters/filter-section'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CatalogDetail',
  components: {
    ProductList,
    FilterSection
    // Paginate
  },
  props: ['title'],
  data: () => ({
    loading: true,
    selectedFilters: []
  }),
  computed: {
    ...mapGetters('catalog',['products', 'page', 'pageCount']),
    currentPage: {
      get: function() { return this.page},
      set: function(value) { this.$store.commit('catalog/setPage', value) }
    },
  },
  created() {
    this.currentPage = 1
    this.pageChangeHandler(1)
  },
  methods: {
    ...mapActions('catalog',['fetchContent']),
    async pageChangeHandler(page) {
      this.loading = true
      await this.fetchContent()
      this.loading = false
    },
    changeFilter(v) {
      console.log('changeFilter v: ',v)
      const cur = this.selectedFilters.find(item => item.id === v.id)
      if (cur) {
        cur.values = v.values
      } else {
        this.selectedFilters.push(v)
      }


    }
  }
}
</script>

<style lang="scss" >
.pagination {
  margin-top: 2em;
  .active {
    .pagination-link { background-color: var(--base-color2);}
  }
}
</style>
