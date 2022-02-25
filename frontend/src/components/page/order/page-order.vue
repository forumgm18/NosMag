<template lang="pug">
section  
  v-preloader.in-page(v-if="$fetchState.pending")
  .order-content(v-else id="order" :class="{ show: showOrder }") 
    .order-form
      .order-section-label {{$options.LABELS.DELIVERY_METHOD}}
      .order-item-label {{$options.LABELS.ADDRESS.TOWN}}
      //- div ================== Выбор Города ============================
      .order-form-section
        .order-form-row
          .order-form-item.mb-1_5rem
            client-only  
              v-dropdown2.order-item-input(
                ref="town"
                :class="{ focus: cityFocuse }"
                :is-open="cityInputOpened"
                :title="$options.PLACEHOLDERS.ADDRESS.TOWN"
                :multiple="false"
                )
                template(#title) 
                  input.dropdown-input(
                    ref="cityInput"
                    type="text"
                    v-model="citiesSearchStr"
                    :placeholder="$options.PLACEHOLDERS.TOWN"
                    @focus="cityFocused"
                    @blur="cityBlur"
                    @keydown="inputKeyDown"
                  )
                template( #content )
                  perfect-scrollbar.search-result-list(v-if="cities" :key="citiesSearchStr")    
                    ul.city-search-result(ref="cityList" tabindex="-1")
                      li.city-search-item(
                        v-for="(city, index) in cities" 
                        :key="city.id"
                        :tabindex="index"
                        @click="citySelected(city)"
                        v-html="$searchHighlight(citiesSearchStr, city.name)"
                        @keydown.prevent="cityListKeyDown($event, city)"
                      ) 
        //- div ================== Выбор Типа Доставки (Курьер/ПВЗ) ============================
    
        //- .order-form-section
        .order-form-row.order-toggle-btn(v-if="deliveryTarifs")
          v-check-btn.order-form-item(
            v-for="(dt, index) in deliveryTarifs.types" :key="index"
            v-model="delivery" 
            :value="dt"
            ) {{dt.name}}
          .order-form-item(v-if="deliveryTarifs.comment")
            v-note(:note="deliveryTarifs.comment" :link="deliveryTarifs.comment_link")
        

        //- div ================== Выбор Тарифа Доставки ============================
        
        
        .order-form-row.delivery-opt(v-if="deliveryTarifs")
          v-check-item(
            v-for="(d, i) in delivery.items" :key="i"
            type="radio" 
            v-model="deliveryService" 
            :value="d" 
            :is-checked="!!d.active" 
            :has-footer="true"
            )
            template(#icon)
              svg.icon(:class="[getDeliveryServiceIcon(d.type), {base: d.type==='samovyvoz'}]") 
                use(:href="`#${getDeliveryServiceIcon(d.type)}`")
            template(#title) {{d.name}}
            //- template(#descr) {{d.info}}
            template(#offer)
              div.prop-item(v-html="formatDeliveryProp('srok', d.srok)")
              div.prop-item(v-html="formatDeliveryProp('price', d.price)")

        //- div ================== Кнопка Выбор ПВЗ ============================
        .order-form-row( v-if="showSelectPvzBtn" )
          .btn.order-form-btn( @click="showMapClick" ) {{showMapText}}

        //- div ================== Инфо о ПВЗ ============================
        template( v-if="deliveryInfo && delivery.group_type==='pvz'" )
          .order-section-label {{$options.LABELS.PVZ}}  
          .order-form-row.m-to-0
            //- .order-form-item.col-2
            v-pvz-info(
              :pvz-info="deliveryInfo" 
              :service-name="deliveryService.type"
              :icon="getDeliveryServiceIcon(deliveryService.type)"
              :icon-class="deliveryService.type === 'samovyvoz' ? 'base': ''"
              @change-pvz="showMapClick"
              @show-details="showMapDetail"
              )
        //- div ================== Поля формы ============================
        //- div ================== Адрес ============================
      template(v-if="delivery.group_type === 'courier' || deliveryService.type === 'post'")  
        .order-section-label {{$options.LABELS.ADDRESS_LABEL}}  
        .order-form-section
          .order-form-row.address
            .order-form-item.col-2
              .order-item-label
                span {{$options.LABELS.ADDRESS.ADDR}}
                span(v-if="fieldsIsRequired.addr.req").req *
              v-input-field.order-item-input(
                v-model="address.addr"
                :is-valid.sync="fieldsIsRequired.addr.valid"
                type="text"
                :placeholder="$options.PLACEHOLDERS.ADDRESS.ADDR"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
                :set-error-state="setErrorState"
              )
            .order-form-item(v-if="deliveryService.type === 'post'")
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
                :set-error-state="setErrorState"

              )

      .order-section-label {{$options.LABELS.USER_DATA}}
      .order-form-section
        .order-form-row
          .order-form-item(v-if="deliveryService.type != 'samovyvoz'")
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
              :set-error-state="setErrorState"
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
              :set-error-state="setErrorState"
            )

          .order-form-item(v-if="deliveryService.type === 'post'")
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
              :set-error-state="setErrorState"
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

      .order-section-label {{$options.LABELS.PAYMENT_METHOD}}
      .order-form-section
        .order-form-row.order-toggle-btn
          v-check-btn.order-form-item(v-model="prePay" :value="1" :is-checked="true") {{$options.PREPAY_CARD_TEXT}}
          v-check-btn.order-form-item(v-model="prePay" :value="0") {{$options.PREPAY_MONEY_TEXT}}
          .order-form-item(v-if="payments.comment")
            v-note(:note="payments.comment" :link="payments.comment_link")
      
        template(v-if="prePay === 1 && payments")
          .order-form-row
            v-check-item.order-form-item(
              v-for="(pt, index) in payments.types" :key="index"
              type="radio" 
              v-model="prePayType" 
              :value="pt.code" 
              :is-checked="pt.active"
              )
              template(#icon)
                svg.icon(:class="getPaymentsIcon(pt.code)") 
                  use(:href="`#${getPaymentsIcon(pt.code)}`")
              template(#title) Пластиковой картой
          //- .order-form-row(v-if="orderFormIsValid")
              .btn.order-form-btn Оплатить заказ
      .order-form-section
        .order-form-row
          .order-form-item.col-2.comment
            .order-item-label {{$options.LABELS.ORDER_COMMENT}}
            .order-item-input.input-field
              textarea(v-model="orderComment")

      div 
        span Форма Валидна: 
        span {{orderFormIsValid}}
    client-only
      modal(
        name="pvz-select"
        :width="1690" 
        :height="820"
        @closed="pvzModalClose"
        )
        .pvz-select(@wheel.prevent.stop)
          .pvz-select-sidebar    
          v-yamap-sidebar.pvz-select-sidebar(
            :pvz-list="markers"
            :show-detail-only="showPvzDetailOnly"
            :pvz-info="deliveryInfo"
            :marker="selectedMarker"
            v-model="lastDeliveryInfo"

            @modal-close="$modal.hide('pvz-select')"
            @marker-select="markerPreSelectFromList"
            @select-pvz="pvzSelect"
            )
          .pvz-select-map(v-if="yandexApiKey" :class="{ show: showMap }" ref="mapContainer")
            yandex-map.yamap(
              :settings="$options.static.yamap.settings"  
              :options="$options.static.yamap.options"  
              :coords="$options.static.yamap.coords"
              :controls="$options.static.yamap.controls"
              :zoom="$options.static.yamap.zoom"
              :cluster-options="$options.static.clusterOptions"
              :cluster-callbacks="$options.static.clusterCallbacks"
              :scroll-zoom="true"
              :show-all-markers="showAllMarkers"
              @map-was-initialized="mapInitialized"
              )
              ymap-marker(
                v-for="m in markers" :key="m.id" 
                :marker-id="m.id"
                :coords="m.coord"
                :icon="$options.static.marker.icon"
                :properties="{...m.data, ...$options.static.marker.props}"
                :options="$options.static.marker.options"
                :balloon-component-props="m.data"
                cluster-name="1"
                :hint-content="m.data.name"
                @click="markerPreSelect(m, $event)"
                )

</template>

<script>
  import { required, minValue, email } from 'vuelidate/lib/validators'
  import yamap from './yamaps-options/yamap'
  import clusterOptions from './yamaps-options/cluster-options'
  import clusterCallbacks from './yamaps-options/cluster-callbacks'
  import marker from './yamaps-options/marker'
  import PLACEHOLDERS from './labels-text/placeholders'
  import LABELS from './labels-text/labels'
  import { debounce, isEqual } from 'lodash'
 
  export default {
    props: {
      showOrder: {
        type: Boolean,
        default: false
      },
      orderClick: {
        type: Number,
        default: 0
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
      deliveryService: { required },
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
        setErrorState: false,
        showPvzDetailOnly: false,
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
        delivery: '',
        deliveryService: '',
        deliveryInfo: null,
        lastDeliveryInfo: null, // Кэш для последнего выбранного ПВЗ чтобы не повторять запрос к api
        prePay: 1,   // 1 - Предоплата; 0 - Оплата при получении
        prePayType: '',
        citiesSearchStr: '',
        cityFocuse: false,
        cityInputOpened: false,
        orderFormError: true,
        // documentWidth: 0,
        selectedMarker: null,
        // showMapLinkVisible: 'hidden',
        showMapLinkVisible: false,
        fieldsIsRequired: {
          name:{ req: true, valid: false },
          tel:{ req: true, valid: false },
          town:{ req: true, valid: false },
          // deliveryService:{ req: true, valid: false },
          prePay:{ req: true, valid: true },
          sname: { req:false, valid: false },
          tname: { req:false, valid: false },
          email: { req:false, valid: false },
          addr: { req:false, valid: false },
          zip: { req:false, valid: false },
          orderComment: { req:false, valid: false },
          deliveryType: { req:true, valid: false },
          deliveryService: { req:true, valid: false },
          pvz: { req:false, valid: false },
        },
        payments: null
      }
    },
    async fetch() {
      const params = {city_id: this.userDefaultCity.id, prepay: this.prePay}
      await this.$store.dispatch('delivery/getDeliveryOptions', params)
      const payments = await this.$axios.$get('/get_payments', { session_id: this.$store.state.token.session_id })
      if (payments.status === 'ok') this.payments = payments.payments
      this.delivery = this.deliveryTarifs.types.find(item => item.active)
      this.deliveryService = this.delivery.items.find(item => item.active)

    },    
 
    computed: {
      pvzList() { return this.$store.getters['pvz/pvzList'] },
      userDefaultCity() { return this.$store.getters['settings/userDefaultCity'] },
      phoneMask() { return this.$store.getters['settings/phoneMask'] },
      deliveryTarifs() { return this.$store.getters['delivery/getTarifs'] },
      // deliveryServiceTarifs() {return null},

      cities() {  return this.$store.state.cities.cities || null },
      currency() { return this.$store.state.settings.currency },
      currencyShort() {return this.$store.state.settings.currencyShort},
      yandexApiKey() {return this.$store.state.settings.yandexApiKey},
      showMapText() { return this.showMap ? 'Скрыть карту' : 'Выбрать пункт выдачи' },
      // balloonComponent() { return () => import('~/components/yamap/yamap-baloon/yamap-baloon') },
      orderFormIsValid() {
        const requiredFields = Object.values(this.fieldsIsRequired).filter(item => item.req)
        const valid = requiredFields.reduce((res, current) => res && current.valid, true)   
        this.$emit('form-valid', valid)
        return valid
      },
      showSelectPvzBtn() {
        return this.delivery.group_type === 'pvz' && 
                this.deliveryService.type != 'post' && 
                !!this.pvzList && this.pvzList.length && 
                !this.deliveryInfo
        
      },

    },
    methods: {
      inputKeyDown(e) {
        if( !this.cityInputOpened) this.cityInputOpened = true
        if (e.key === 'ArrowDown') {
          // console.log('inputKeyDown', this.$refs.cityList)
          if (this.$refs.cityList.childNodes && this.$refs.cityList.childNodes.length) {
            this.$refs.cityList.childNodes[0].focus()
            this.$refs.cityList.childNodes[0].classList.add('focus')
          } 
          if (!this.cityInputOpened) this.cityInputOpened = true
        }
      },
      cityListKeyDown(e, val){
        let el = e.target
        switch(e.key) {
          case 'ArrowDown':
            if ( el.nextSibling ) {
              el.classList.remove('focus')
              el.nextSibling.focus()
              el.nextSibling.classList.add('focus')
            }  
            break
          case 'ArrowUp' :  
            if ( el.previousSibling ) {
              el.classList.remove('focus')
              el.previousSibling.focus()
              el.previousSibling.classList.add('focus')
            } else {
              this.$refs.cityInput.focus()
              this.$refs.cityInput.selectionStart = this.$refs.cityInput.value.length
            } 
          break
          case 'Enter' :  
            this.citySelected(val)
            this.cityInputOpened = false
          break

        }
        // console.log('cityListKeyDown', e)
      },

      cityFocused() { 
        this.cityFocuse = true 
        this.cityInputOpened = true
        },
      cityBlur() { this.cityFocuse = false },
      citySelected(val) {this.address.town = val},
      formatDeliveryProp(key, val) {
        let s = ''
        let v = ''
        switch(key) {
          case 'srok': 
            s = 'Срок доставки:'
            v = val
            break  
          case 'price': 
            s = 'Стоимость доставки:'
            v = val ? val + this.$store.state.settings.currency : 'Бесплатно'
            break  
        }  
        return `<span>${s}</span> ${v}`
      },

      setRequiredFields(v) {
        // setRequiredFields([ 'name', 'tel', 'town', 'prePay', 'sname', 'tname', 'email', 'addr', 'zip', 'orderComment', 'deliveryService']),
        // const obj = this.fieldsIsRequired
        console.log('v', v)
        if (v instanceof Array) {
          Object.entries(this.fieldsIsRequired).forEach( itm => {
            // console.log('itm', itm)
            itm[1].req = false
            })
          // debugger
          v.forEach(item => {
            if (this.fieldsIsRequired.hasOwnProperty(item)) this.fieldsIsRequired[item].req = true
            })
        } else {
          if (this.fieldsIsRequired.hasOwnProperty(v)) this.fieldsIsRequired[v].req = true
        }
      },
      showMapClick() { 
        this.showAllMarkers = true
        this.showPvzDetailOnly = false
        this.markers = this.pvzList 
        this.deliveryInfo = null
        this.$modal.show('pvz-select',{ width: 1690, height: 820})
        },
      showMapDetail(val) { 
        this.showAllMarkers = false
        this.showPvzDetailOnly = true
        this.markers = val 
        this.$options.static.yamap.coords = val[0].coord
        this.$modal.show('pvz-select',{ width: 1690, height: 820})

        },
        pvzModalClose() {
          if (!(!!this.deliveryInfo)) {
            this.deliveryInfo = this.lastDeliveryInfo
            this.selectedMarker = null
          }
        },
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
      // async markerSelect(val) {
      //   this.selectedMarker = val
      //   this.yMap.balloon.close()
      //   await this.$store.dispatch('pvz/setPvz', val)
      // },
      async pvzSelect(val) {
        this.selectedMarker = null
        const res = await this.$store.dispatch('pvz/setPvz', val.code)
        // console.log('pvz installed: ', res)
      },
      markerSelectClear(val) {
        // Ищем ранее отмеченные маркеры (рыжего цвета)
        const go = this.yMap.geoObjects
                      .get(0).getGeoObjects()
                      .filter(item => item.options.get('iconMoreClassesForGodClasses', '') === val)
        if (go && go.length ) { // если такие есть то сбрасываем отметку
          go.forEach(item => item.options.set('iconMoreClassesForGodClasses', ''))
        }
      },
      markerPreSelect(val, e) {
        console.log('markerPreSelect', val)
        // this.deliveryInfo = {name: val.data.name, code: val.data.code}
        // this.lastDeliveryInfo = {name: val.data.name, code: val.data.code}

        // Очищаем ранее отмеченные маркеры (рыжего цвета)
        this.markerSelectClear('icon-mouse-enter')
        this.selectedMarker = {name: val.data.name, code: val.data.code}

        // Помечаем макрер как "выбранный"
        e.get('target').options.set('iconMoreClassesForGodClasses', 'icon-mouse-enter')
      },
      markerPreSelectFromList(val) {
        // Очищаем ранее отмеченные маркеры (рыжего цвета)
        this.markerSelectClear('icon-mouse-enter')
        // Ищем все маркеры
        const go = this.yMap.geoObjects.get(0).getGeoObjects()
        if (go && go.length ) { // если такие есть то ищем нужный маркер
          const currentMarker = go.filter(item => item.properties.get('code') === val.code)
          // Помечаем макрер как "выбранный"
          if (currentMarker) {

            currentMarker[0].options.set('iconMoreClassesForGodClasses', 'icon-mouse-enter')
            const coord = currentMarker[0].geometry.getCoordinates()
            // debugger
            // this.yMap.setCenter(coord, 15, { checkZoomRange: true })
            this.yMap.setZoom( 15, { duration: 2000 } )
            this.yMap.panTo(coord, { checkZoomRange: true, flying:1, duration: 2000 })
          }
        }
      },

      getTarif(t) {
        // return this.deliveryTarifs ? this.deliveryTarifs.find(item => item.type === t) : null
        return null
        },
      getTarifFooter(t) {
        // const tarif = this.deliveryTarifs.find(item => item.type === t)
        // if (!(!!tarif)) return ''
        const price = t.price ? t.price + this.$store.state.settings.currency : 'Бесплатно'
        return `${price} ${t.srok}`
      },
      fileldFlexOrder(fld) {
        if (fld === 'email') {
          if(this.delivery === 'samovyvoz') return 5
        }
        return 'auto'
      },
      getDeliveryServiceIcon(t) {
        let icn = false
        switch(t) {
          case 'cdek': 
          case 'cdek_pvz': 
          case 'cdek_courier': 
            icn = 'icon-logo-cdek'
            break
          case 'doctavista': 
            icn = 'icon-logo-doctavista'
            break
          case 'ya-go': 
            icn = 'icon-logo-ya-go'
            break
          case 'post': 
          case 'express': 
            icn = 'icon-logo-pochta'
            break
          case 'samovyvoz': 
            icn = 'icon-logo'
            break
        } 
        return icn
      },
      getPaymentsIcon(t) {
        let icn = false
        switch(t) {
          case 'sber': 
            icn = 'icon-visa-mastercard'
            break
          case 'yoomoney': 
            icn = 'icon-yoomoney-pay'
            break
        } 
        return icn
      },
    },
    mounted(){ 
      // this.yamapSettings.apiKey = this.yandexApiKey || ''
      this.$nextTick(function () {
        this.$options.static.yamap.settings.apiKey = this.yandexApiKey || ''
        this.address.town = this.userDefaultCity
        // this.delivery = this.deliveryTarifs.types.find(item => item.active)
        // this.deliveryService = this.delivery.items.find(item => item.active)
        })
    },
    beforeDestroy() {
      if (process.browser) window.removeEventListener('resize', this.mapFullscreenExit)
    },
    watch:{
      'address.town' : async function(val) {
        this.citiesSearchStr = val.name
        this.lastDeliveryInfo = null
        if (val.id) {
          await this.$store.dispatch('pvz/getPvzList', {city_id: val.id} )
          // this.markers = this.pvzList 
          this.showAllMarkers = true 
          await this.$store.dispatch('delivery/getDeliveryOptions', {city_id: val.id, prepay: this.prePay} )
          // this.$emit('select-delivery-type', this.getTarif(this.delivery))
  
          this.fieldsIsRequired.town.valid = true // Тип Доставки выбран

          this.delivery = this.deliveryTarifs.types.find(item => item.active)
          this.deliveryService = this.delivery.items.find(item => item.active)

        }
      },
      delivery(val) {
        this.deliveryService  = val.items.find(item => item.active) || val.items[0]
      },
      deliveryService(val, oldVal) {
        this.deliveryInfo = val.type === 'samovyvoz' ? val : this.lastDeliveryInfo

        if (!isEqual(val, oldVal)) {
          console.log('set_delivery_type', val, oldVal)
          this.$store.dispatch('delivery/setDeliveryType', val.type)
          this.$emit('need-update-cart', this.prePay)
        }  

        let reqFieldsArr = ['name', 'tel', 'town', 'deliveryType', 'prePay']
        switch(val.type){
          case 'samovyvoz':
            reqFieldsArr.push('deliveryService') 
            break
          
          case 'cdek_pvz':
            reqFieldsArr.push('sname', 'deliveryService')
            if (!!this.pvzList && this.pvzList.length) reqFieldsArr.push('pvz')
            break
          
          case 'cdek_courier':
            reqFieldsArr.push('sname','addr')
            // reqFieldsArr = ['name', 'sname', 'tel', 'addr', 'deliveryService', 'prePay']  
            break
          
          case 'post':
            reqFieldsArr.push('sname','tname','addr','zip' )
            // reqFieldsArr = ['name', 'sname', 'tname', 'tel', 'addr', 'zip', 'deliveryService', 'prePay']  
            break
          
          case 'express':
            reqFieldsArr.push('addr')
            // reqFieldsArr = ['name', 'tel', 'addr', 'deliveryService', 'prePay']  
            break

        }
        this.setRequiredFields(reqFieldsArr)
          
        this.fieldsIsRequired.deliveryType.valid = (val && val.type) ? true : false
        // this.fieldsIsRequired.deliveryService.valid = (this.deliveryService.type !='samovyvoz' ) ? true : false
        this.fieldsIsRequired.deliveryService.valid = !!val 
        

      },
      lastDeliveryInfo(val){
        this.deliveryInfo = val 
        this.selectedMarker = null
        let v = false

        if (this.delivery.group_type === 'pvz') {
          if (this.deliveryService.type !='samovyvoz' && !!val ) v = true
        }  
        this.fieldsIsRequired.pvz.valid = v

      },
      pvzList(val) {
        this.fieldsIsRequired.pvz.req =  (!!val && val.length ) 
      },
      async prePay(val) {
        await this.$store.dispatch('delivery/getDeliveryOptions', {city_id: val.id, prepay: val} )
        this.$emit('select-delivery-type', this.getTarif(this.delivery))
      },
      orderClick(val) {
        console.log('orderClick', val)
        // setErrorState
        if (this.orderFormIsValid) {
            let param = {}
              param.name = this.name
              param.sname = this.sname
              param.tname = this.tname
              param.phone = this.tel
              param.email = this.email
              param.comment = this.orderComment
              param.post_index = this.address.zip
              param.address = this.address.addr
              param.city_id = this.address.town.id
              param.pvz_code = this.lastDeliveryInfo.code
              param.tarif_type = this.deliveryService.type
              param.prepay = this.prepay

            // [session_id] => test
            // [tarif_type] => pvz
            // [auth-token] => api-test

        } else {
          if (val > 1) this.setErrorState = !this.orderFormIsValid
        }  
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
  // .qqq { height: 100%; width: 100%;}
  .prop-item {
    &:not(:last-child){margin-bottom: .7em;}
    span {font-weight: 500;}
  }
  .pvz-select {
    display: flex;
    align-items: stretch;
    height: 820px;
    width: 1690px;
    &-sidebar {
      flex-shrink: 0;
    }
    &-map {
      background: gray;
      flex-grow: 1;

    }
  }
  .search-result-list {
    height: min-content;
    height: fit-content;
    max-height: calc(22em - 3.2em);
  }
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