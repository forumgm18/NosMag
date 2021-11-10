<template lang="pug">
  div.city-select-block
    .header-link.location(@click="citySelectShow")
      svg.icon.icon-location <use href="#icon-location"/>
      span(v-if="value.name" ) {{value.name}}
      span(v-else) {{$options.CITY_DEFAULT_TEXT}}

    app-popup.city-select(
      v-model="isCitySelectShow"
      v-on:close-popup="citySelectClose"
    )
      .city-select-title {{$options.CITY_TITLE_TEXT}}
      input-field.city-search-input(
        v-model="citySearch"
        type="text"
        :placeholder="$options.INPUT_PLACEHOLDER"
        :error-text="$options.INPUT_ERROR_TEXT"
        :is-error="citySearchError"
        @input="inputChange"
        
      )
      .city-auto-select {{$options.CITY_AUTO_SELECT_TEXT}}
      scroll-bar.city-result-scroll(v-if="cities" :key="citySearch")
        ul.city-search-result
          li.city-search-item(
            v-for="city in cities" 
            :key="city.id"
            @click="citySelected(city.id)"
          ) {{city.name}}




</template>

<script>
  import appPopup from '~/components/common/popup/app-popup'
  import inputField from '~/components/common/forms/input-field/input-field'
  import scrollBar from 'vue2-scrollbar'

  export default {
  components: {
    appPopup,
    inputField,
    scrollBar
  },
  props: {
    value: {
      type: Object,
      default: {id: null, name: ''}
    }
  },
  fetch: async function(){
    // console.log('cities/getCities')
    await this.$store.dispatch('cities/getCities')
  },
  data() {
    return {
      // citySelected: {},
      isCitySelectShow: false,
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
      return this.$store.state.cities.cities || null
      // return this.$store.getters.cities || null
    }
  },
  methods: {
    citySelectShow() { this.isCitySelectShow = true },
    citySelectClose() { this.isCitySelectShow = false },
    citySelected(val) { 
      this.$store.dispatch('cities/setCity', val )
      this.$emit('change', val) 
      this.citySelectClose()

    },
    inputChange() { return this.$store.dispatch('cities/searchCity', this.citySearch ) },
  }  
  }
</script>

<style lang="scss" >
@import 'city-select'
</style>