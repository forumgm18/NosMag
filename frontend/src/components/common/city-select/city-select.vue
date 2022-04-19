<template lang="pug">
  v-dropdown.city-select-block( 
    theme="header_menu" 
    popper-class="city-select" 
    :shown="shown"
    :triggers="[]"
    auto-hide
    handleResize
    @auto-hide="shown=false"
    @apply-show="inputFocused++"

    )
    .header-link.location(@click="shown=!shown")
      svg.icon.icon-location <use href="#icon-location"/>
      span(v-if="value.name" ) {{value.name}}
      span(v-else) {{$options.CITY_DEFAULT_TEXT}}

    template(#popper)
      .city-select-title {{$options.CITY_TITLE_TEXT}}
      v-input-field.city-search-input(
        ref="input"
        v-model="citySearch"
        type="text"
        :placeholder="$options.INPUT_PLACEHOLDER"
        :error-text="$options.INPUT_ERROR_TEXT"
        :is-error="citySearchError"
        :set-focus="shown"
        :tabindex="1"
        :key="inputFocused"
        @keydown.down.stop.prevent="keyDown"
        )
      v-city-search(
        ref="searchResult"
        :search-str="citySearch" 
        :min-serch-length="minSerchLength"
        v-model="selectedCity"
        list-class="city-search-result"
        list-item-class="city-search-item"
        list-scroll-class="city-result-scroll"
        list-item-focus-class="focus"
        :tab-index="2"
        @item-select="shown = false"
        @first-up="inputFocused++"
        )



</template>

<script>
//  import { debounce } from 'lodash'
  import { mapState } from 'vuex'
  export default {
  components: {
    // scrollBar
  },
  props: {
    value: {
      type: Object,
      default: {id: null, name: ''}
    },
    minSerchLength: {
      type: Number,
      default: 3
    },
  },
  data() {
    return {
      citySearch: '',
      citySearchError: false,
      selectedCity: {},
      shown: false,
      inputFocused: 0,
    }
  },
  INPUT_PLACEHOLDER: 'Введите название населённого пункта',
  INPUT_ERROR_TEXT: 'Для поиска введите хотя бы 3 символа',
  CITY_TITLE_TEXT: 'Ваш регион доставки',
  CITY_AUTO_SELECT_TEXT: 'Автоматическое определение:',
  CITY_DEFAULT_TEXT: 'ваш город',
  computed: {
    ...mapState('token',['session_id'])
  },
  methods: {
    async setCity () {
      const res = await this.$axios.$get('/set_city', {
          params: {
            session_id: this.session_id,
            city_id: this.selectedCity.id
          }
        }
      )
      // console.log('res', res)
      if (res.status === 'ok') {
        // dispatch('settings/fetch', null, { root: true })
        this.$store.commit('settings/setNewCity', {id: this.selectedCity.id, name:res.city_name})
      } else {
        if (res.error) console.log('Ошибка смены города:', res.error)
      }
    },
    
    keyDown(){
      if (this.$refs.searchResult) {
        const list = this.$refs.searchResult.$refs.list
        if (list && list.firstChild) {
          list.firstChild.focus()
        }
      }
    },
    inputSetFocus(){
      if (this.$refs.input) {
        const list = this.$refs.searchResult.$refs.list
        if (list && list.firstChild) {
          list.firstChild.focus()
        }
      }
    },
    showDropDown(e) {
      // this.shown = true
      debugger
      this.$refs.input.$refs.input.focus()
    }
  },
  watch: {
    selectedCity(val){
      // this.$store.dispatch('cities/setCity', val.id )
      this.setCity()
      this.$emit('change', val) 

    }
  }  
  }
</script>

<style lang="scss" >
@import 'city-select'
</style>