<template lang="pug">
  v-dropdown.city-select-block( theme="header_menu" popper-class="city-select" )
    .header-link.location
      svg.icon.icon-location <use href="#icon-location"/>
      span(v-if="value.name" ) {{value.name}}
      span(v-else) {{$options.CITY_DEFAULT_TEXT}}

    //- v-app-popup.city-select(
      v-model="isCitySelectShow"
      v-on:close-popup="citySelectClose"
     )
    template(#popper)
      .city-select-title {{$options.CITY_TITLE_TEXT}}
      v-input-field.city-search-input(
        v-model="citySearch"
        type="text"
        :placeholder="$options.INPUT_PLACEHOLDER"
        :error-text="$options.INPUT_ERROR_TEXT"
        :is-error="citySearchError"
        
        
      )
      //- .city-auto-select {{$options.CITY_AUTO_SELECT_TEXT}}
      client-only
        perfect-scrollbar.city-result-scroll(v-if="cities" :key="citySearch" ref="cityScrollBar")
          ul.city-search-result
            li.city-search-item(
              v-for="city in cities" 
              :key="city.id"
              v-close-popper
              @click="citySelected(city.id)"
              v-html="$searchHighlight(citySearch, city.name)"
            ) 




</template>

<script>
 import { debounce } from 'lodash'

  export default {
  components: {
    // scrollBar
  },
  props: {
    value: {
      type: Object,
      default: {id: null, name: ''}
    }
  },
  fetch: async function(){
    await this.$store.dispatch('cities/getCities')
  },
  data() {
    return {
      // citySelected: {},
      // isCitySelectShow: false,
      // isCitySelectClose: false,
      citySearch: '',
      citySearchError: false,
    }
  },
  INPUT_PLACEHOLDER: 'Введите название населённого пункта',
  INPUT_ERROR_TEXT: 'Для поиска введите хотя бы 3 символа',
  CITY_TITLE_TEXT: 'Ваш регион доставки',
  CITY_AUTO_SELECT_TEXT: 'Автоматическое определение:',
  CITY_DEFAULT_TEXT: 'ваш город',
  // async mounted() {
  //   console.log('cities/getCities')
  //   await this.$store.dispatch('cities/getCities')
  // }, 
  computed: {
    cities() {
      return this.$store.getters['cities/getCities']
    }
  },
  methods: {
    citySelected(val) {
      this.$store.dispatch('cities/setCity', val )
      this.$emit('change', val) 
    },
  },
  watch: {
    citySearch: debounce(
                  function(val) { 
                    this.$store.dispatch('cities/searchCity', val ) 
                  }, 
                300 )
  }  
  }
</script>

<style lang="scss" >
@import 'city-select'
</style>