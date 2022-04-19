<template lang="pug">
  client-only
    perfect-scrollbar(
      v-if="cities" 
      :class="listScrollClass"
      )
      ul(:class="listClass" ref="list")
        li(
          v-for="(city, ind) in cities" 
          :key="city.id"
          :tabindex="ind + tabIndex"
          :class="listItemClass"
          v-html="$searchHighlight(searchStr, city[showKey])"
          @focus="itemFocus"
          @blur="itemBlur"
          @keydown.down.prevent.stop="keyDown"
          @keydown.up.prevent.stop="keyUp"
          @click="citySelected(city)"
          @keydown.enter.prevent.stop="citySelected(city)"

          ) 

</template>

<script>
  import { debounce } from 'lodash'
  import { mapState } from 'vuex'

  export default {
    name: 'city-search',
    props: {
      showKey: {
        type: String,
        default: 'name'
      },
      searchStr: {
        type: String,
        default: ''
      },
      minSerchLength: {
        type: Number,
        default: 3
      },
      value: {
        type: Object,
        default: {id: null, name: ''}
      },
      tabIndex: {
        type: Number,
        default: 1
      },
      listClass: {
        type: String,
        default: 'city-search_list'
      },
      listItemClass: {
        type: String,
        default: 'city-search_list-item'
      },
      listItemFocusClass: {
        type: String,
        default: 'focus'
      },
      listScrollClass: {
        type: String,
        default: 'city-search_scroll'
      },

    },
    async fetch(){
      // await this.$store.dispatch('cities/getCities')
      await this.getCities()
    },
    data() {
      return {
        cities: [],
        citySearch: '',
        citySearchError: false,
      }
    },
    computed: {
      ...mapState('token',['session_id']),
    },
    methods: {
      citySelected(val) {
        this.$emit('input', val)
        this.$emit('item-select')
      },

      async getCities() {
        let params = { session_id: this.session_id }
        if (this.searchStr.length) params.search = this.searchStr
      
        const data = await this.$axios.$get('/get_cities', { params } )
        if (data.status === 'ok' ){ 
          this.cities = data.cities
        } else {
          this.cities = []
        }
        return data.status
      },
      keyDown(e) {
        const item = e.target
        if (item.nextSibling) {
          item.nextSibling.focus()
        }else {
          this.$emit('last-down')
        }
      },
      keyUp(e) {
        const item = e.target
        if (item.previousSibling) {
          item.previousSibling.focus()
        } else {
          this.$emit('first-up')
        }
      },
      itemFocus(e){
        e.target.classList.add(this.listItemFocusClass)
      },
      itemBlur(e){
        e.target.classList.remove(this.listItemFocusClass)
      },

    },
    watch: {
      searchStr: debounce(function() {
                            const canGetData = this.searchStr.length >= this.minSerchLength || 
                                               this.searchStr.length === 0
                            if (canGetData) this.getCities()
                          },
                  300 )
    }  
  }
</script>

<style lang="scss" >
@import 'city-search';
.focus {
  color: red;
}
</style>