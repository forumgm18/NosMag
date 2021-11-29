<template lang="pug">
  section.order-content(id="order" :class="{ show: showOrder }") 
    h1.page-title {{$options.ORDER_TITLE}}
    .order-form
      .order-form-section
        .order-form-item
          .order-item-label
            span {{$options.LABELS.FAM}}
            span.req *
          v-input-field.order-item-input(
            v-model="fam"
            type="text"
            :placeholder="$options.PLACEHOLDERS.FAM"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :required="true"
          )
        .order-form-item
          .order-item-label
            span {{$options.LABELS.NAME}}
            span.req *
          v-input-field.order-item-input(
            v-model="name"
            type="text"
            :placeholder="$options.PLACEHOLDERS.NAME"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :required="true"
          )

        .order-form-item
          .order-item-label
            span {{$options.LABELS.OTCH}}
          v-input-field.order-item-input(
            v-model="otch"
            type="text"
            :placeholder="$options.PLACEHOLDERS.OTCH"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
          )
      
        .order-form-item
          .order-item-label
            span {{$options.LABELS.EMAIL}}
            span.req *
          v-input-field.order-item-input(
            v-model="email"
            type="email"
            :placeholder="$options.PLACEHOLDERS.EMAIL"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :is-error.sync="orderFormError" 
          )
        .order-form-item
          .order-item-label
            span {{$options.LABELS.TEL}}
            span.req *
          v-input-field.order-item-input(
            v-model="tel"
            type="text"
            :placeholder="$options.PLACEHOLDERS.TEL"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :required="true"
            :v-mask="$options.TEL_MASK"
          )
        .order-form-item
          .order-item-label
            span {{$options.LABELS.RECIPIENT}}
            span.req *
          v-input-field.order-item-input(
            v-model="recipient"
            type="text"
            :placeholder="$options.PLACEHOLDERS.RECIPIENT"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
          )




      .order-item-label {{$options.LABELS.DELIVERY_METHOD}}
      .order-form-section
        v-check-item(type="radio" v-model="orderDelivery" value="1")
          template(#icon)
            svg.icon.icon-box <use href="#icon-box"/>
          template(#title) Самовывоз
          template(#descr) Cо склада в Москве

        v-check-item(type="radio" v-model="orderDelivery" value="2")
          template(#icon)
            svg.icon.icon-pvz <use href="#icon-pvz"/>
          template(#title) Пункт выдачи
          template(#descr) Доставка по РФ

        v-check-item(type="radio" v-model="orderDelivery" value="3")
          template(#icon)
            svg.icon.icon-home <use href="#icon-home"/>
          template(#title) Курьер
          template(#descr) Доставка по РФ

        v-check-item(type="radio" v-model="orderDelivery" value="4")
          template(#icon)
            svg.icon.icon-mailbox <use href="#icon-mailbox"/>
          template(#title) Почта России
          template(#descr) Доставка по РФ



      .order-form-section.address
        .order-form-item
          .order-item-label
            span {{$options.LABELS.ADDRESS.TOWN}}
          client-only  
            v-dropdown.order-item-input(
              :class="{ focus: cityFocuse }"
              :title="$options.PLACEHOLDERS.ADDRESS.TOWN"
              :multiple="false"
              
              )
              template(#title) 
                input.dropdown-input(
                  type="text"
                  v-model="citiesSearchStr"
                  :placeholder="$options.PLACEHOLDERS.TOWN"
                  @focus="cityFocused"
                  @blur="cityBlur"
                  @input="filterCities"
                )
              template( #content )
                vnm-select-list(
                  v-if="cities"
                  :multiple="false"
                  item-type='radio'
                  :options="cities" 
                  :class="{'set-max-height' : cities.length > 9}"
                  v-model="address.town" 
                  :show-icon="false"
                  )
                  
                  template(#optText="{opt}" ) 
                    span.filter-option_item-text {{opt.name}}
        .order-form-item
          .order-item-label
            span {{$options.LABELS.ADDRESS.STREET}}
          v-input-field.order-item-input(
            v-model="address.street"
            type="text"
            :placeholder="$options.PLACEHOLDERS.ADDRESS.STREET"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
          )
        .order-form-item
          .order-item-label
            span {{$options.LABELS.ADDRESS.DOM}}
          v-input-field.order-item-input(
            v-model="address.dom"
            type="text"
            :placeholder="$options.PLACEHOLDERS.ADDRESS.DOM"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
          )
        .order-form-item.kv-zip
          .order-item-label
            span {{$options.LABELS.ADDRESS.KV}}
          v-input-field.order-item-input(
            v-model="address.kv"
            type="text"
            :placeholder="$options.PLACEHOLDERS.ADDRESS.KV"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
          )
        .order-form-item.kv-zip
          .order-item-label
            span {{$options.LABELS.ADDRESS.ZIP}}
          v-input-field.order-item-input(
            v-model="address.zip"
            type="text"
            :placeholder="$options.PLACEHOLDERS.ADDRESS.ZIP"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
          )
        .order-form-item.kv-zip
          .order-item-label(style="opacity:0")
            span q
          .map-show(@click="showMapClick") {{showMapText}}
      client-only
        .map-section(v-if="yandexApiKey" :class="{ show: showMap }")
          //- v-yandex-map(:markers="[yamapCoords]" :coords="yamapCoords")
          yandex-map.yamap(
            :settings="$options.static.yamap.settings"  
            :options="$options.static.yamap.options"  
            :coords="$options.static.yamap.coords"
            :controls="$options.static.yamap.controls"
            :zoom="$options.static.yamap.zoom"
            :cluster-options="$options.static.clusterOptions"
            :cluster-callbacks="$options.static.clusterCallbacks"
            :scroll-zoom="false"
            :show-all-markers="showAllMarkers"
            :balloon-component="balloonComponent"
            @map-was-initialized="mapInitialized"
            )
            ymap-marker(
              v-for="m in pvzList" :key="parseInt(m.id, 10)" 
              :marker-id="parseInt(m.id, 10)"
              :coords="m.coord"
              :icon="$options.static.marker.icon"
              :properties="$options.static.marker.props"
              :options="$options.static.marker.options"
              :balloon-component-props="m.data"
              cluster-name="1"
              @mouseenter="yamapMouseEnter"
              @mouseleave="yamapMouseLeave"
              @balloon-click="markerSelect"
              )
              //- v-yamap-baloon.bal-class(slot="balloon")
              //- template(#balloon)

              
      
    .order-item-label {{$options.LABELS.PAYMENT_METHOD}}
    .order-form-section
      v-check-item(type="radio" v-model="orderPay" value="1")
        template(#icon)
          svg.icon.icon-paycard <use href="#icon-paycard"/>
        template(#title) Оплата онлайн
        template(#descr) На сайте картой

      v-check-item(type="radio" v-model="orderPay" value="2")
        template(#icon)
          svg.icon.icon-paymoney <use href="#icon-paymoney"/>
        template(#title) При получении
        template(#descr) Наличкой/терминал
    .order-form-section
      .order-form-item.comment
        .order-item-label Если требуется, можете оставить комментарий:
        .order-item-input.input-field
          textarea(v-model="orderComment")

</template>

<script>
  import vnmSelectList from '~/components/forms/vnm-select-list/vnm-select-list'
  // import { yandexMap, ymapMarker } from 'vue-yandex-maps'
  import { required, minValue, email } from 'vuelidate/lib/validators'
// import ScrollBar from 'vue2-scrollbar'
 import {clone as cloneArray} from 'lodash'

  export default {
    components: {
      // yandexMap, ymapMarker,
      vnmSelectList,
      // ScrollBar,
    },
    props: {
      showOrder: {
        type: Boolean,
        default: false
      }
    },

    ORDER_TITLE: 'оформление заказа',  
    INPUT_ERROR_TEXT_DEFAULT: 'Это поле обязательно',  
    INPUT_TOWN_TOOLTIP_LABEL: 'Начните вводить название города',  
    TEL_MASK: '+7 (###) ###-##-##',
    PLACEHOLDERS: {
      NAME: 'Иван',  
      FAM: 'Иванов',  
      OTCH: 'Иванович',  
      EMAIL: 'ioanio1987@mail.ru',  
      TEL: '+7 912 000 00 00',  
      TOWN: 'Москва',  
      ADDRESS: {
        TOWN: 'Город',
        STREET: 'Улица',
        DOM: 'Дом',
        KV: 'Квартира',
        ZIP: 'Индекс',
        }, 
      RECIPIENT: 'Получатель', 
    },  
    LABELS: {
      NAME: 'Имя',  
      FAM: 'Фамилия',  
      OTCH: 'Отчество',  
      EMAIL: 'E-mail',  
      TEL: 'Телефон',  
      DELIVERY_METHOD: 'Способ доставки',  
      PAYMENT_METHOD: 'Способ оплаты',  
      ADDRESS: {
        TOWN: 'Город',
        STREET: 'Улица',
        DOM: 'Дом',
        KV: 'Квартира',
        ZIP: 'Индекс',
        }, 
      RECIPIENT: 'Получатель', 
    },  
    validations: {
      name: { required, minValue: minValue(1) },
      fam: { required, minValue: minValue(1) },
      tel: { required, minValue: minValue(12) },
      town: { required, minValue: minValue(12) },
      address: { required, minValue: minValue(12) },
      email: { required, email },
      orderPay: { required },
      orderDelivery: { required },
    },
    static: {
      yMap: null,
      yamap: {
        settings: {
          // apiKey: this.yandexApiKey || '',
          apiKey: '',
          lang: 'ru_RU',
          coordorder: 'latlong',
          enterprise: false,
          version: '2.1',
        },
        options: {
          suppressMapOpenBlock: true,
        },
        zoom: 10,
        coords: [54, 39],
        controls: ['zoomControl'],
      },
      clusterOptions: {
        1: {
          // clusterIconColor: 'var(--base-color1)',
          clusterIconColor: '#326FCA',
          clusterDisableClickZoom: false,
          clusterOpenBalloonOnClick: false,
          // clusterIconContentLayout: '<div class="cluster-icon">{{ properties.geoObjects.length }}</div>',
          // clusterIconContentLayout: '<div class="cluster-icon">$[properties.geoObjects.length]</div>',
          // clusterNumbers: [20],
          // clusterIcons: [
          //     {
          //       href: '/ym-cluster.png',
          //       size: [60, 60],
          //       offset: [-30, -30],
          //       shape: {
          //         type: 'Circle',
          //         coordinates: [0, 0],
          //         radius: 30
          //       }                    
          //     },
          //     {
          //       href: '/ym-cluster.png',
          //       size: [80, 80],
          //       offset: [-40, -40],
          //       shape: {
          //         type: 'Circle',
          //         coordinates: [0, 0],
          //         radius: 40
          //       }                    
          //     }
          // ],
        },
      }, 
      clusterCallbacks: {
        1:{
          // mouseenter: this.clusterMouseEnter,
          // mouseleave: this.clusterMouseLeave,
          mouseenter: function(e){
            // e.get('target').options.set('iconColor', '#DD5500')
            console.log (e.get('target').getOverlaySync())
            
            
            },
          mouseleave: function(e){e.get('target').options.set('iconColor', '#326FCA')},
        }
      }, 
      marker: {
        icon: {
          layout: 'default#imageWithContent',
          imageHref: '',
          iconImageHref: '',
          imageSize: [62, 62],
          imageOffset: [-62, -62],
          contentLayout: '<svg class="icon icon-location in-map $[options.moreClassesForGodClasses]"><use href="#icon-location"/></svg>' 
        },
        props: {
          hintContent: 'markerProps - hint',
        },
        options: {
          balloonMinWidth: 400,
          balloonMinHeight: 400,
        },

      }

    },    
    data: function () {
      return {
        // ymapIconLayout: null,
        // markers:[],
        // showAllMarkers: false,
        showAllMarkers: true,
        name: '',
        fam: '',
        otch: '',
        tel: '',
        email: '',
        // town: {},
        showMap: false,
        address: {
          town: {},
          street: '',
          dom: '',
          kv: '',
          zip: ''
        },
        recipient: '',
        orderComment: '',
        orderDelivery: '',
        orderPay: '',
        citiesSearchStr: '',
        cityFocuse: false,
        // showOrder: false,
        orderFormError: false,
        documentWidth: 0,
        selectedMarker: null,
      }
    },
    computed: {
      pvzList() {  
        return this.$store.getters['pvz/pvzList']
        // const pvzs = this.$store.getters['pvz/pvzList']
        },
      cities() {  return this.$store.state.cities.cities || null },
      currency() { return this.$store.state.settings.currency },
      currencyShort() {return this.$store.state.settings.currencyShort},
      yandexApiKey() {return this.$store.state.settings.yandexApiKey},
      showMapText() { return this.showMap ? 'Скрыть карту' : 'Указать на карте' },
      balloonComponent() { return () => import('~/components/yamap/yamap-baloon/yamap-baloon') },

    },
    methods: {
    filterCities() { this.$store.dispatch('cities/searchCity', this.citiesSearchStr ) },
    cityFocused() { this.cityFocuse = true },
    cityBlur() { this.cityFocuse = false },
    showMapClick() { this.showMap = !this.showMap },
    yamapMouseEnter(e) { e.get('target').options.set('iconMoreClassesForGodClasses', 'icon-mouse-enter') },
    yamapMouseLeave(e) { e.get('target').options.set('iconMoreClassesForGodClasses', '') },
    clusterMouseEnter(e) { e.get('target').options.set('iconColor', '#DD5500') },
    clusterMouseLeave(e) { e.get('target').options.set('iconColor', '#326FCA') },
    mapInitialized(val){ this.yMap = val },
    markerSelect(val) {
      this.selectedMarker = val
      this.yMap.balloon.close()
      this.$store.dispatch('pvz/setPvz', val)
    },
    },
    mounted(){
      // this.yamapSettings.apiKey = this.yandexApiKey || ''
      this.$options.static.yamap.settings.apiKey = this.yandexApiKey || ''
    },
    watch:{
      'address.town' : async function(val, oldVal ) {
        this.citiesSearchStr = val.name
        // debugger
        // if (this.yMap.geoObjects.length) {
        //   this.yMap.geoObjects.removeFrom(clusterer)
        //   this.yMap.geoObjects.removeAll()
        // }
        // if (this.$options.static.yMap) this.$options.static.yMap.geoObjects[0].removeAll()
        await this.$store.dispatch('pvz/getPvzList', {city_id: val.id} )
        this.markers = cloneArray(this.pvzList)
        // this.yMap.geoObjects.remove(clusterer);
        // this.yMap.geoQueryResult.removeFrom(clusterer);
        // debugger
        // this.yMap.clusterer.removeAll()
        // const markersCoords = this.pvzList.map(p => p.coord)
        // console.log('markersCoords: ', markersCoords)
        // this.yMap.setBounds(markersCoords, { checkZoomRange: true })
      }
    },
    
  }
</script>

<style lang="scss">
  .in-map{
    font-size: 62px;
    color: var(--base-color1);
    --location-bgr: currentColor;
    --location-dot: #fff; 
    --location-dot-stroke: transparent;

    &.icon-mouse-enter {
      color: var(--base-color2);
      
    }
  }
  .cluster-icon {
    --cluster-bgr: var(--base-color1);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    // border: 5px solid black;
    background-color: var(--base-color1);
    color: #fff;
    // color: red;
    font-size: 30px;
    font-weight: 500;
  }
  ymaps[class*="-svg-icon"] {
    border-radius: 50%!important;
    background: var(--base-color1)!important;
    background-image: none!important;
    // background: red!important;
  }
  ymaps[class*="-svg-icon"]:hover {
    background: var(--base-color2)!important;
    background-image: none!important;
    // background: red!important;
  }
  ymaps[class$="-svg-icon-content"] {
    border-radius: 0!important;
    background: transparent!important;

    font-family: #{$mainFont}!important;
    font-size: 16px!important;
    font-weight: 500!important;
    line-height: 1!important;
    // color: var(--text-color-default)!important;
    color: #fff!important;
    }
  ymaps[class$="-balloon__content"] {
    padding: 0!important;
    margin-right: 0!important;
    }
  ymaps[class$="-balloon__close"] {
    margin: 0!important;
  }
  ymaps[class$="-balloon__close-button"] {
    height: 24px!important;
    width: 24px!important;
    }

</style>