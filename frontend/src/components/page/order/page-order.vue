<template lang="pug">
  section.order-content(id="order" :class="{ show: showOrder }") 
    //- h1.page-title {{$options.ORDER_TITLE}}
    .order-form
      .order-section-label {{$options.LABELS.ADDRESS.TOWN}}
      .order-form-section
        .order-form-item
          //- .order-item-label
            span {{$options.LABELS.ADDRESS.TOWN}}
            span(v-if="fieldsIsRequired.town.req").req *
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
                  
                )
              template( #content )
                v-select-list(
                  v-if="cities"
                  :multiple="false"
                  item-type='radio'
                  :options="cities" 
                  :class="{'set-max-height' : cities.length > 9}"
                  v-model="address.town" 
                  :show-icon="false"
                  )
                  
                  template(#optText="{opt}" ) 
                    //- span.filter-option_item-text {{opt.name}}
                    span(v-html="$searchHighlight(citiesSearchStr, opt.name)").filter-option_item-text
      .order-form-section.order-toggle-btn
        v-check-btn(v-model="deliveryType" value="pvz") {{$options.DELIVERY_PVZ_TEXT}}
        v-check-btn(v-model="deliveryType" value="courier") {{$options.DELIVERY_COURIER_TEXT}}


      .order-section-label {{$options.LABELS.DELIVERY_METHOD}}
      .order-form-section.delivery-opt(v-if="deliveryTarifs")
        v-check-item(
          v-for="(d, i) in deliveryTarifs" :key="i"
          type="radio" 
          v-model="deliveryType" 
          :value="d.type" 
          :is-checked="!!d.active" 
          :has-footer="true"
          )
          template(#icon)
            svg.icon(:class="getTarifIcon(d.type)") 
              use(:href="`#${getTarifIcon(d.type)}`")
          template(#title) {{getTarif(d.type).name}}
          template(#descr) {{getTarif(d.type).info}}
          template(#offer)
            span(v-html="getTarifFooter(d.type)")


      .order-text(v-if="deliveryType === 'samovyvoz'") 
        span Склад находится по адресу: 
        span.link(@click="showMapClick") {{getTarif('samovyvoz').address}}

      div(v-if="1===2 && deliveryType === 'courier' || deliveryType === 'express'")
        .order-section-label {{$options.LABELS.DELIVERY_SERVICE}}
        .order-form-section.delivery-opt(v-if="deliveryServiceTarifs")
          v-check-item.deivery-service(
            v-for="(d, i) in deliveryServiceTarifs" :key="i"
            type="radio" 
            v-model="deliveryService" 
            :value="d.type" 
            :is-checked="!!d.active" 
            :has-icon="false"
            :has-title="false"
            )
            template(#descr v-if="getDeliveryServiceIcon(d.type)")
              svg.deivery-service-logo.icon(:class="getDeliveryServiceIcon(d.type)") 
                use(:href="`#${getDeliveryServiceIcon(d.type)}`")

            template(#offer)
              span(v-html="getTarifFooter(d.type)")


      .order-form-section.address(v-if="deliveryType != 'samovyvoz'")
        .order-form-item
          .order-item-label
            span {{$options.LABELS.ADDRESS.ADDR}}
            span(v-if="fieldsIsRequired.addr.req").req *
          v-input-field.order-item-input(
            v-model="address.addr"
            type="text"
            :placeholder="$options.PLACEHOLDERS.ADDRESS.ADDR"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
          )
        .order-form-item
          .order-item-label
            span {{$options.LABELS.ADDRESS.ZIP}}
            span(v-if="fieldsIsRequired.zip.req").req *
          v-input-field.order-item-input(
            v-model="address.zip"
            type="text"
            :placeholder="$options.PLACEHOLDERS.ADDRESS.ZIP"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            v-mask="'######'"
            :minLength="6"
            :maxLength="6"
            :required="true"
            :is-valid.sync="fieldsIsRequired.zip.valid" 

          )
      .order-text(v-if="showMapLinkVisible")    
        .map-show(@click="showMapClick" ) {{showMapText}}

      client-only
        .map-section(v-if="yandexApiKey" :class="{ show: showMap }" ref="mapContainer")
          
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
              v-for="m in markers" :key="parseInt(m.id, 10)" 
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


      .order-section-label {{$options.LABELS.USER_DATA}}
      .order-form-section
        .order-form-item(v-if="deliveryType != 'samovyvoz'")
          .order-item-label
            span {{$options.LABELS.SNAME}}
            span(v-if="fieldsIsRequired.sname.req").req *
          v-input-field.order-item-input(
            v-model="sname"
            type="text"
            :placeholder="$options.PLACEHOLDERS.SNAME"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :required="true"
            :is-valid.sync="fieldsIsRequired.sname.valid" 

          )
        .order-form-item
          .order-item-label
            span {{$options.LABELS.NAME}}
            span(v-if="fieldsIsRequired.name.req").req *
          v-input-field.order-item-input(
            v-model="name"
            type="text"
            :placeholder="$options.PLACEHOLDERS.NAME"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :required="true"
            :is-valid.sync="fieldsIsRequired.name.valid" 

          )

        .order-form-item(v-if="deliveryType === 'post' || deliveryType === 'express'")
          .order-item-label
            span {{$options.LABELS.TNAME}}
            span(v-if="fieldsIsRequired.tname.req").req *
          v-input-field.order-item-input(
            v-model="tname"
            type="text"
            :placeholder="$options.PLACEHOLDERS.TNAME"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :is-valid.sync="fieldsIsRequired.tname.valid" 

          )
      
        .order-form-item(:style="{ order: fileldFlexOrder('email') }")
          .order-item-label
            span {{$options.LABELS.EMAIL}}
            span(v-if="fieldsIsRequired.email.req").req *
          v-input-field.order-item-input(
            v-model="email"
            type="email"
            :placeholder="$options.PLACEHOLDERS.EMAIL"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :is-valid.sync="fieldsIsRequired.email.valid" 
          )
        .order-form-item
          .order-item-label
            span {{$options.LABELS.TEL}}
            span(v-if="fieldsIsRequired.tel.req").req *
          v-input-field.order-item-input(
            v-model="tel"
            type="tel"
            :placeholder="$options.PLACEHOLDERS.TEL"
            :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
            :required="true"
            :v-mask="phoneMask"
            :is-valid.sync="fieldsIsRequired.tel.valid" 

          )

      .order-section-label {{$options.LABELS.PAYMENT_METHOD}}
      .order-form-section.order-toggle-btn
        v-check-btn(v-model="prePay" :value="1" :is-checked="true") {{$options.PREPAY_CARD_TEXT}}
        v-check-btn(v-model="prePay" :value="0") {{$options.PREPAY_MONEY_TEXT}}
      
      .order-form-section(v-if="prePay === 1")
        v-check-item(type="radio" v-model="prePayType" value="1" :is-checked="true")
          template(#icon)
            svg.icon.icon-visa <use href="#icon-visa"/>
            svg.icon.icon-mastercard <use href="#icon-mastercard"/>
          template(#title) Пластиковой картой
          //- template(#descr) На сайте картой

        v-check-item(type="radio" v-model="prePayType" value="0" )
          template(#icon)
            svg.icon.icon-yoomoney(style="--yoo: #8B3FFD;") <use href="#icon-yoomoney"/>
          template(#title) Электронный кошелек
          //- template(#descr) Наличкой/терминал
          
      .order-form-section
        .order-form-item.comment
          .order-item-label {{$options.LABELS.ORDER_COMMENT}}
          .order-item-input.input-field
            textarea(v-model="orderComment")
      div 
        span Форма Валидна: 
        span {{orderFormIsValid}}
</template>

<script>
  import { required, minValue, email } from 'vuelidate/lib/validators'
  import yamap from './yamaps-options/yamap'
  import clusterOptions from './yamaps-options/cluster-options'
  import clusterCallbacks from './yamaps-options/cluster-callbacks'
  import marker from './yamaps-options/marker'
  import PLACEHOLDERS from './labels-text/placeholders'
  import LABELS from './labels-text/labels'
  import { debounce } from 'lodash'
 
  export default {
    props: {
      showOrder: {
        type: Boolean,
        default: false
      }
    },

    ORDER_TITLE: 'оформление заказа',  
    INPUT_ERROR_TEXT_DEFAULT: 'Это поле обязательно',  
    DELIVERY_PVZ_TEXT: 'Пункт выдачи',  
    DELIVERY_COURIER_TEXT: 'Курьер',  
    PREPAY_CARD_TEXT: 'Оплата онлайн',  
    PREPAY_MONEY_TEXT: 'Оплата при получении',  
    PLACEHOLDERS, 
    LABELS,
    validations: {
      name: { required, minValue: minValue(1) },
      sname: { required, minValue: minValue(1) },
      tel: { required, minValue: minValue(12) },
      town: { required, minValue: minValue(12) },
      address: { required, minValue: minValue(12) },
      email: { required, email },
      prePay: { required },
      deliveryType: { required },
    },
    static: {
      yMap: null,
      yamap, 
      clusterOptions, 
      clusterCallbacks, 
      marker,
    }, 
    data: function () {
      return {
        showMap: false,
        showAllMarkers: true,
        markers: null,
        name: '',
        sname: '',
        tname: '',
        tel: '',
        email: '',
        address: {
          town: {},
          addr:'',
          zip: ''
        },
        orderComment: '',
        deliveryType: '',
        deliveryService: '',
        prePay: 1,
        prePayType: '',
        citiesSearchStr: '',
        cityFocuse: false,
        orderFormError: true,
        // documentWidth: 0,
        selectedMarker: null,
        // showMapLinkVisible: 'hidden',
        showMapLinkVisible: false,
        fieldsIsRequired: {
          name:{ req: true, valid: false },
          tel:{ req: true, valid: false },
          town:{ req: true, valid: false },
          deliveryType:{ req: true, valid: false },
          prePay:{ req: true, valid: true },
          sname: { req:false, valid: false },
          tname: { req:false, valid: false },
          email: { req:false, valid: false },
          addr: { req:false, valid: false },
          zip: { req:false, valid: false },
          orderComment: { req:false, valid: false },
          deliveryService: { req:false, valid: false },
        },

      }
    },
    async fetch() {
      const params = {city_id: this.userDefaultCity.id, prepay: this.prePay}
      await this.$store.dispatch('delivery/getDeliveryOptions', params)
    },    
 
    computed: {
      pvzList() { return this.$store.getters['pvz/pvzList'] },
      userDefaultCity() { return this.$store.getters['settings/userDefaultCity'] },
      phoneMask() { return this.$store.getters['settings/phoneMask'] },
      deliveryTarifs() { return this.$store.getters['delivery/getTarifs'] },
      deliveryServiceTarifs() {return null},

      cities() {  return this.$store.state.cities.cities || null },
      currency() { return this.$store.state.settings.currency },
      currencyShort() {return this.$store.state.settings.currencyShort},
      yandexApiKey() {return this.$store.state.settings.yandexApiKey},
      showMapText() { return this.showMap ? 'Скрыть карту' : 'Указать на карте' },
      balloonComponent() { return () => import('~/components/yamap/yamap-baloon/yamap-baloon') },
      orderFormIsValid() {
        // console.log('Object.entries(this.fieldsIsRequired) ', Object.entries(this.fieldsIsRequired))
        // const requiredFields = Object.entries(this.fieldsIsRequired).filter(item => item[1].req)
        // const valid = requiredFields.reduce((res, current) => res && current[1].valid, true)   
        const requiredFields = Object.values(this.fieldsIsRequired).filter(item => item.req)
        const valid = requiredFields.reduce((res, current) => res && current.valid, true)   
        // console.log('requiredFields', requiredFields)
        // console.log('valid', valid)
        this.$emit('form-valid', valid)
        return valid
      }
    },
    methods: {
      // filterCities() { this.$store.dispatch('cities/searchCity', this.citiesSearchStr ) },
      cityFocused() { this.cityFocuse = true },
      cityBlur() { this.cityFocuse = false },
      showMapClick() { this.showMap = !this.showMap },
      yamapMouseEnter(e) { e.get('target').options.set('iconMoreClassesForGodClasses', 'icon-mouse-enter') },
      yamapMouseLeave(e) { e.get('target').options.set('iconMoreClassesForGodClasses', '') },
      clusterMouseEnter(e) { e.get('target').options.set('iconColor', '#DD5500') },
      clusterMouseLeave(e) { e.get('target').options.set('iconColor', '#326FCA') },
      mapInitialized(val){ 
        val.container.events.add('fullscreenexit', this.mapFullscreenExit)
        this.yMap = val 
        if (process.browser) window.addEventListener('resize', this.mapFullscreenExit)
      },
      mapFullscreenExit(e) {
        // Получим контейнер карты.
        const mapContainer = this.yMap.container.getElement()
        // Установим width = '100%' для контейнера карты и его родителя.
        mapContainer.parentElement.style.width = '100%'
        mapContainer.style.width = '100%'
        // Инициируем пересчет размеров.
        this.yMap.container.fitToViewport()
      },
      async markerSelect(val) {
        this.selectedMarker = val
        this.yMap.balloon.close()
        await this.$store.dispatch('pvz/setPvz', val)
      },
      getTarif(t) {return this.deliveryTarifs ? this.deliveryTarifs.find(item => item.type === t) : null},
      getTarifFooter(t) {
        const tarif = this.deliveryTarifs.find(item => item.type === t)
        if (!(!!tarif)) return ''
        const price = tarif.price ? tarif.price + this.$store.state.settings.currency : 'Бесплатно'
        return `${price} ${tarif.srok}`
      },
      fileldFlexOrder(fld) {
        if (fld === 'email') {
          if(this.deliveryType === 'samovyvoz') return 5
        }
        return 'auto'
      },
      getTarifIcon(t) {
        let icn = ''
        switch(t) {
          case 'samovyvoz' : 
            icn = 'icon-box'
            break
          case 'pvz' : 
            icn = 'icon-pvz'
            break
          case 'courier' : 
            icn = 'icon-home'
            break
          case 'express' : 
            icn = 'icon-mailbox'
            break
          case 'post' : 
            icn = 'icon-mailbox'
            break
        } 
        return icn
      },
      getDeliveryServiceIcon(t) {
        let icn = false
        switch(t) {
          case 'cdek' : 
            icn = 'icon-logo-cdek'
            break
          case 'doctavista' : 
            icn = 'icon-logo-doctavista'
            break
          case 'ya-go' : 
            icn = 'icon-logo-ya-go'
            break
        } 
        return icn
      },
      updateFieldsIsRequired() {
        const f = this.fieldsIsRequired
        switch(this.deliveryType) { 
          case 'samovyvoz' :
            f.sname.req = false
            f.tname.req = false
            f.addr.req = false
            f.zip.req = false
            f.deliveryService.req = false
            break  
          case 'pvz' :
            f.sname.req = true
            f.tname.req = false
            f.addr.req = false
            f.zip.req = false
            f.deliveryService.req = true
            break  
          case 'courier' :
            f.sname.req = true
            f.tname.req = false
            f.addr.req = true
            f.zip.req = false
            f.deliveryService.req = false
            break  
          case 'express' :
            f.sname.req = false
            f.tname.req = false
            f.addr.req = true
            f.zip.req = false
            f.deliveryService.req = false
            break  
          case 'post' :
            f.sname.req = true
            f.tname.req = true
            f.addr.req = true
            f.zip.req = true
            f.deliveryService.req = false
            break  
          }
      },
    },
    mounted(){
      // this.yamapSettings.apiKey = this.yandexApiKey || ''
      this.$options.static.yamap.settings.apiKey = this.yandexApiKey || ''
      this.address.town = this.userDefaultCity
    },
    beforeDestroy() {
      if (process.browser) window.removeEventListener('resize', this.mapFullscreenExit)
    },
    watch:{
      'address.town' : async function(val, oldVal ) {
        this.citiesSearchStr = val.name
        // console.log('address.town val: ', val)
        if (val.id) {
          await this.$store.dispatch('pvz/getPvzList', {city_id: val.id} )
          this.markers = this.pvzList 
          this.showAllMarkers = true 
          await this.$store.dispatch('delivery/getDeliveryOptions', {city_id: val.id, prepay: this.prePay} )
          this.$emit('select-delivery-type', this.getTarif(this.deliveryType))
  
          this.fieldsIsRequired.town.valid = true // Тип Доставки выбран

        }
      },
      // deliveryType(val) {
      //   // debugger
      //   this.$emit('select-delivery-type', this.getTarif(val))
      //   this.updateFieldsIsRequired()
      //   if (val === 'samovyvoz' ) {
      //     // this.showMapLinkVisible = 'visible'
      //     // this.showMapLinkVisible = true
      //     const tarifSamovyvoz = this.getTarif(val)
      //     this.markers = [ {
      //       id: 'samovyvoz_id',
      //       coord: [tarifSamovyvoz.lat, tarifSamovyvoz.lon],
      //       data: { active : 1, code: 'SAM1', name: 'Самовывоз со склада в Москве'}
      //       }]
      //     this.showAllMarkers = false 
      //     if (this.yMap){
      //       this.yMap.setCenter(this.markers[0].coord, 17)
      //     }
      //     // return
      //   }
      //   if (val === 'post' || val === 'express' || val === 'courier' ) {
      //     this.showMap = false
      //     // this.showMapLinkVisible = 'hidden'
      //     this.showMapLinkVisible = false
      //   }
      //   if (val === 'pvz') {
      //     this.showAllMarkers = true 
      //     this.markers = this.pvzList
      //     // this.showMapLinkVisible = 'visible'
      //     this.showMapLinkVisible = true
      //   }
        
      // },
      deliveryType(val) {
        // debugger
        this.$emit('select-delivery-type', this.getTarif(val))
        this.updateFieldsIsRequired() // Обновляем список обязательных полей формы
        this.fieldsIsRequired.deliveryType.valid = true // Тип Доставки выбран
        switch(val){
          case 'samovyvoz':
            const tarifSamovyvoz = this.getTarif(val)
            this.markers = [ {
              id: 'samovyvoz_id',
              coord: [tarifSamovyvoz.lat, tarifSamovyvoz.lon],
              data: { active : 1, code: 'SAM1', name: 'Самовывоз со склада в Москве'}
              }]
            this.showAllMarkers = false 
            if (this.yMap){ this.yMap.setCenter(this.markers[0].coord, 17) }
            break

          case 'pvz':
            this.showAllMarkers = true 
            this.markers = this.pvzList
            // this.showMapLinkVisible = 'visible'
            this.showMapLinkVisible = true
            break
        
          default:  // (val === 'post' || val === 'express' || val === 'courier' ) 
            this.showMap = false
            // this.showMapLinkVisible = 'hidden'
            this.showMapLinkVisible = false
            }
        
      },
      deliveryService(val) {
        this.fieldsIsRequired.deliveryService.valid = !!val // Выбрана служба доставки
      },
      async prePay(val) {
        await this.$store.dispatch('delivery/getDeliveryOptions', {city_id: val.id, prepay: val} )
        this.$emit('select-delivery-type', this.getTarif(this.deliveryType))
      },
      citiesSearchStr: debounce(
                        function(val) {
                          this.$store.dispatch('cities/searchCity', val )
                        }, 
                        300 )
        
      
    },
    
  }
</script>

<style lang="scss">
  .icon.in-map{
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