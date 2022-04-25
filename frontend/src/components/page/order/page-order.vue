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
          .order-form-item.col-2.mb-1_5rem
            v-select-single2(
              option-key="full_name"
              :placeholder="$options.PLACEHOLDERS.TOWN"
              :search-string.sync="citiesSearchStr"
              v-model="address.town"
            )
        //- div ================== Выбор Типа Доставки (Курьер/ПВЗ) ============================
    
        //- .order-form-section
        .order-form-row.order-toggle-btn(v-if="deliveryTarifs")
          v-check-btn.order-form-item(
            v-for="(dt, index) in deliveryTarifs.types" :key="index"
            v-model="delivery" 
            :value="dt"
            ) {{dt.name}}
          .order-form-item.has-note(v-if="deliveryTarifs && deliveryTarifs.comment")
            v-note(:note="deliveryTarifs.comment" :link="deliveryTarifs.comment_link")
        

        //- div ================== Выбор Тарифа Доставки ============================
        .order-form-row.delivery-opt(v-if="deliveryTarifs")
          v-check-item.order-form-item(
            v-for="(d, i) in delivery.items" :key="i"
            type="radio" 
            v-model="deliveryService" 
            :value="d" 
            :is-checked="!!d.active" 
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
        .order-form-row( v-if="showSelectPvzBtn" ref="pvz")
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
      template(v-if="deliveryService && deliveryService.type")
        .order-section-label(v-show="delivery.group_type === 'courier' || deliveryService.type === 'post'") {{$options.LABELS.ADDRESS_LABEL}}  
        .order-form-section(v-show="delivery.group_type === 'courier' || deliveryService.type === 'post'")  
          .order-form-row.address
            .order-form-item.col-2()
              .order-item-label
                span {{$options.LABELS.ADDRESS.ADDR}}
                span(v-if="fieldsIsRequired.addr.req").req *
              v-input-field.order-item-input(
                ref="addr"
                v-model="address.addr"
                type="text"
                :placeholder="$options.PLACEHOLDERS.ADDRESS.ADDR"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
                :is-valid.sync="fieldsIsRequired.addr.valid"
                :set-error-state="setErrorState"
                :required="fieldsIsRequired.addr.req"
              )
            .order-form-item(v-show="deliveryService.type === 'post'" )
              .order-item-label
                span {{$options.LABELS.ADDRESS.ZIP}}
                span(v-if="fieldsIsRequired.zip.req").req *
              v-input-field.order-item-input(
                ref="zip"
                v-model="address.zip"
                type="text"
                :placeholder="$options.PLACEHOLDERS.ADDRESS.ZIP"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
                v-mask="'######'"
                :minLength="6"
                :maxLength="6"
                :required="fieldsIsRequired.zip.req"
                :is-valid.sync="fieldsIsRequired.zip.valid" 
                :set-error-state="setErrorState"

              )

      .order-section-label {{$options.LABELS.USER_DATA}}
      .order-form-section(v-if="deliveryService && deliveryService.type")
        .order-form-row
          .order-form-item(v-show="deliveryService.type != 'samovyvoz'" )
            .order-item-label
              span {{$options.LABELS.SNAME}}
              span(v-if="fieldsIsRequired.sname.req").req *
            v-input-field.order-item-input(
              ref="sname"
              v-model="sname"
              type="text"
              :placeholder="$options.PLACEHOLDERS.SNAME"
              :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              :required="fieldsIsRequired.sname.req"
              :is-valid.sync="fieldsIsRequired.sname.valid" 
              :set-error-state="setErrorState"
            )
          .order-form-item()
            .order-item-label
              span {{$options.LABELS.NAME}}
              span(v-if="fieldsIsRequired.name.req").req *
            v-input-field.order-item-input(
              ref="name"
              v-model="name"
              type="text"
              :placeholder="$options.PLACEHOLDERS.NAME"
              :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              :required="fieldsIsRequired.name.req"
              :is-valid.sync="fieldsIsRequired.name.valid" 
              :set-error-state="setErrorState"
            )

          .order-form-item(v-show="deliveryService.type === 'post'" )
            .order-item-label
              span {{$options.LABELS.TNAME}}
              span(v-if="fieldsIsRequired.tname.req").req *
            v-input-field.order-item-input(
              ref="tname"
              v-model="tname"
              type="text"
              :placeholder="$options.PLACEHOLDERS.TNAME"
              :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              :is-valid.sync="fieldsIsRequired.tname.valid" 
              :required="fieldsIsRequired.tname.req"

            )
          .order-form-item()
            .order-item-label
              span {{$options.LABELS.TEL}}
              span(v-if="fieldsIsRequired.tel.req").req *
            v-input-field.order-item-input(
              ref="tel"
              v-model="tel"
              type="tel"
              :placeholder="$options.PLACEHOLDERS.TEL"
              :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              :required="fieldsIsRequired.tel.req"
              :v-mask="phoneMask"
              :is-valid.sync="fieldsIsRequired.tel.valid" 
              :set-error-state="setErrorState"
            )
        
          .order-form-item(:style="{ order: fileldFlexOrder('email') }" )
            .order-item-label
              span {{$options.LABELS.EMAIL}}
              span(v-if="fieldsIsRequired.email.req").req *
            v-input-field.order-item-input(
              ref="email"
              v-model="email"
              type="email"
              :placeholder="$options.PLACEHOLDERS.EMAIL"
              :error-text="$options.PLACEHOLDERS.EMAIL"
              :is-valid.sync="fieldsIsRequired.email.valid" 
              :required="fieldsIsRequired.email.req"

            )

      .order-section-label {{$options.LABELS.PAYMENT_METHOD}}
      .order-form-section
        .order-form-row.order-toggle-btn
          v-check-btn.order-form-item(v-model="prePay" :value="1" :is-checked="true") {{$options.PREPAY_CARD_TEXT}}
          v-check-btn.order-form-item(v-model="prePay" :value="0") {{$options.PREPAY_MONEY_TEXT}}
          .order-form-item.has-note(v-if="payments && payments.comment")
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
            .order-item-input
              v-input-field(type="textarea" v-model="orderComment")

      div 
        span Форма Валидна: 
        span {{orderFormIsValid}}
    client-only
      //- modal(
        name="pvz-select"
        :adaptive="true"
        :reset="true"
        :width="pvzModalSize.w" 
        :height="pvzModalSize.h"
        :maxWidth="pvzModalSize.maw" 
        :maxHeight="pvzModalSize.mah"
        :minHeight="pvzModalSize.mih"
        @closed="pvzModalClose"
        )
      vue-final-modal(
        name="pvz-select" 
        v-slot="{ close }" 
        v-model="pvzSelectModalShow"
        :resize="false"
        :classes="['modal-container', 'modal-pvz-select']"
        :content-class="['modal-content', 'modal-pvz-select']"
        :overlay-class="['modal-overlay']"
        :max-width="pvzModalSize.maw" 
        :max-height="pvzModalSize.mah"
        :fit-parent="true"
        @closed="pvzModalClose"
        )

        .modal-close(@click="close")
          svg.icon.icon-btn-close <use href="#icon-btn-close"/>
        .modal-body
          .pvz-select(@wheel.prevent.stop)
            v-yamap-sidebar.pvz-select-sidebar(
              :pvz-list="markers"
              :show-detail-only="showPvzDetailOnly"
              :pvz-info="deliveryInfo"
              :marker="selectedMarker"
              v-model="lastDeliveryInfo"

              @modal-close="close"
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
  import { mapState, mapGetters } from 'vuex'

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
        pvzModalSize:{
          h: 'auto',
          w: 'auto',
          mah: 820,
          maw: 1690,
          mih: 500,
          // maw: 1690,
        },
        setErrorState: false, // принудительноая установка полей формы в ошибку
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
        deliveryOptions: {}, // Для хранения результата запроса к api
        pvz: {},   // Для хранения результата запроса к api
        pvzSelectModalShow: false,
        delivery: '',
        deliveryService: '',
        deliveryInfo: null,
        lastDeliveryInfo: null, // Кэш для последнего выбранного ПВЗ чтобы не повторять запрос к api
        prePay: 1,   // 1 - Предоплата; 0 - Оплата при получении
        prePayType: '',
        citiesSearchStr: '',
        selectedMarker: null,
        showMapLinkVisible: false,
        fieldsIsRequired: {
          town:{ req: true, valid: false, order: 1 },
          pvz: { req:false, valid: false, order: 2 },
          addr: { req:false, valid: false, order: 3 },
          zip: { req:false, valid: false, order: 4 },
          sname: { req:false, valid: false, order: 5 },
          name:{ req: true, valid: false, order: 6 },
          tname: { req:false, valid: false, order: 7 },
          tel:{ req: true, valid: false, order: 8 },
          email: { req:false, valid: false, order: 9 },
          deliveryType: { req:true, valid: false, order: 10 },
          deliveryService: { req:true, valid: false, order: 11 },
          prePay:{ req: true, valid: true, order: 12 },
          orderComment: { req:false, valid: false, order: 13 },
        },
        payments: null
      }
    },
    async fetch() {
      const params = {city_id: this.userDefaultCity.id, prepay: this.prePay}
      // await this.$store.dispatch('delivery/getDeliveryOptions', params)
      await this.getDeliveryOptions(params)
      const payments = await this.$axios.$get('/get_payments', { session_id: this.session_id })
      if (payments.status === 'ok') this.payments = payments.payments
      if (this.deliveryTarifs && this.deliveryTarifs.types && this.deliveryTarifs.types.length) {
        this.delivery = this.deliveryTarifs.types.find(item => item.active) || this.deliveryTarifs.types[0]
        }
      if (this.delivery && this.delivery.items) this.deliveryService = this.delivery.items.find(item => item.active)

    },    

    computed: {
      ...mapState('token', ['session_id']),
      ...mapState('settings', ['currency', 'currencyShort', 'yandexApiKey' ]),
      ...mapGetters('settings', ['userDefaultCity', 'phoneMask' ]),

      // pvzList() { return this.$store.getters['pvz/pvzList'] },
      pvzList() { 
        if (this.pvz && this.pvz.pvzs) {
          return this.pvz.pvzs.map(pvz => {
            return {
              id: pvz.id,
              coord: [+pvz.location_latitude, +pvz.location_longitude],
              data: {
                active: pvz.active,
                code: pvz.code,
                name: pvz.name,
                addr: pvz.location_address,
              }
            }
          })
        } else {
          return null
        }

      },
      // deliveryTarifs() { return this.$store.getters['delivery/getTarifs'] },
      deliveryTarifs() { return this.deliveryOptions.delivery || null},

      // cities() {  return this.$store.state.cities.cities || null },
      showMapText() { return this.showMap ? 'Скрыть карту' : 'Выбрать пункт выдачи' },
      orderFormIsValid() {
        const requiredFields = Object.values(this.fieldsIsRequired).filter(item => item.req)
        const valid = requiredFields.reduce((res, current) => res && current.valid, true)   
        this.$emit('form-valid', valid)
        return valid
      },
      showSelectPvzBtn() {
          return this.delivery.group_type === 'pvz' && 
                  this.deliveryService && 
                  this.deliveryService.type != 'post' && 
                  !!this.pvzList && this.pvzList.length && 
                  !this.deliveryInfo
        
      },

    },
    methods: {
      async getDeliveryOptions(paramDO) {
        const data = await this.$axios.$get('/get_delivery', {
          params: {
            ...paramDO,
            session_id: this.session_id
          }
        })
        console.log('page-order get_delivery: ', data)
        for (let [key, v] of Object.entries(data)) { 
          this.$set(this.deliveryOptions, key, v)
        }
        return data.status
      },
      async setDeliveryType(deliveryType) {
        const c = await this.$axios.$post('/set_delivery_type', {
            delivery_type: deliveryType,
            session_id: this.session_id
        })
        return c.status 
      },
      async getPvzList( pvzParams) {
        // console.log('pvzParams: ', pvzParams)
        const data = await this.$axios.$get(`/get_pvz_list`, {
          params: {
            ...pvzParams,
            session_id: this.session_id
          }
        })
        // commit('setPvzList', c)
        for (let [key, v] of Object.entries(data)) { 
          this.$set(this.pvz, key, v)
        }

      },
      async setPvz(codePvz) {
        const c = await this.$axios.$post(`/set_pvz`, {
            pvz_code: codePvz,
            session_id: this.session_id
        })
        return c.status 
      },

      async inputSetFocus(refName) {
        await this.$nextTick();
        const el = this.$refs[refName]
        if(el) {
          // el.$el.scrollIntoView({behavior: "smooth", inline: "nearest"})
          el.$el.scrollIntoView({behavior: "smooth", block: "center",})
          if ( el.$refs.input ) el.$refs.input.focus()
          if ( el.$refs.textarea ) el.$refs.textarea.focus()

        }
      },

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

      showMapClick() { 
        this.showAllMarkers = true
        this.showPvzDetailOnly = false
        this.markers = this.pvzList 
        this.deliveryInfo = null
        this.$vfm.show('pvz-select',{ width: 1690, height: 820})
        },
      showMapDetail(val) { 
        this.showAllMarkers = false
        this.showPvzDetailOnly = true
        this.markers = val 
        this.$options.static.yamap.coords = val[0].coord
        this.$vfm.show('pvz-select',{ width: 1690, height: 820})

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
        // const res = await this.$store.dispatch('pvz/setPvz', val.code)
        const res = await this.setPvz(val.code)
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
        // console.log('markerPreSelect', val)
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
            icn = 'icon-logo-pochta'
            break
          case 'express': 
            icn = 'icon-logo-courier'
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
      setRequiredFields(v) {
        // setRequiredFields([ 'name', 'tel', 'town', 'prePay', 'sname', 'tname', 'email', 'addr', 'zip', 'orderComment', 'deliveryService']),
        // const obj = this.fieldsIsRequired
        // console.log('v', v)
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

      updateReqiredFields(val) {
        // Обновляем список обязательных полей для формы
        let reqFieldsArr = ['name', 'tel', 'town', 'deliveryType', 'prePay']
        switch(val){
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
      },
      getFirstRequiredNotValidField() {
        const compare = (v1, v2) => {return v1[1].order - v2[1].order }
        // debugger
        let arr = Object.entries(this.fieldsIsRequired)
                        .filter(([key, v]) => v.req && !v.valid)
                        .sort(compare)
        // if (this.deliveryService.type === 'samovyvoz') {
        //   if (arr[0][0] === 'pvz') return arr[1][0]
        // }
        return (arr && arr.length) ? arr[0][0] : false
      },
      pvzModalResize(){
        if (!process.browser) return
        const kH = 0.52 // h/w
        this.pvzModalSize.w = '88%'
        this.pvzModalSize.h = '88%'

        if (window.innerWidth >= 1440) {
          this.pvzModalSize.mah = parseInt((window.innerWidth * .88 * kH).toFixed())
        } else if (window.innerWidth >= 768) {
          this.pvzModalSize.mah = 500
        } else if (window.innerWidth < 768) {
          this.pvzModalSize.w = '100%'
          this.pvzModalSize.h = '75%'
          this.pvzModalSize.maw = parseInt(window.innerWidth)
          this.pvzModalSize.mah = 580
        } 
        // console.log('this.pvzModalSize', this.pvzModalSize)

      },

    },
    mounted(){ 
      // this.yamapSettings.apiKey = this.yandexApiKey || ''
      this.$nextTick(function () {
        this.pvzModalResize()
        this.$options.static.yamap.settings.apiKey = this.yandexApiKey || ''
        this.address.town = this.userDefaultCity
        // this.delivery = this.deliveryTarifs.types.find(item => item.active)
        // this.deliveryService = this.delivery.items.find(item => item.active)
        })
    },
    beforeMount() {
      // if (process.browser) window.addEventListener('resize', this.mapFullscreenExit)
      if (process.browser) window.addEventListener('resize', this.pvzModalResize)
    },
    beforeDestroy() {
      // if (process.browser) window.removeEventListener('resize', this.mapFullscreenExit)
      if (process.browser) window.removeEventListener('resize', this.pvzModalResize)
    },
    watch:{
      'address.town' : async function(val) {
        this.citiesSearchStr = val.name
        this.lastDeliveryInfo = null
        if (val.id) {
          // await this.$store.dispatch('pvz/getPvzList', {city_id: val.id} )
          await this.getPvzList( {city_id: val.id} )
          // this.markers = this.pvzList 
          this.showAllMarkers = true 
          // await this.$store.dispatch('delivery/getDeliveryOptions', {city_id: val.id, prepay: this.prePay} )
          await this.getDeliveryOptions({city_id: val.id, prepay: this.prePay})
  
          this.fieldsIsRequired.town.valid = true // Тип Доставки выбран

          this.delivery = this.deliveryTarifs.types.find(item => item.active)
          // this.deliveryService = this.delivery.items.find(item => item.active)

        }
      },
      delivery(val) {
        this.deliveryService  = val.items.find(item => item.active) || val.items[0]
      },
      async deliveryService(val, oldVal) {
        // Обновляем список обязательных полей для формы
        this.updateReqiredFields(val.type)
        this.fieldsIsRequired.deliveryType.valid = (val && val.type) ? true : false
        this.fieldsIsRequired.deliveryService.valid = !!val 
        // Обновляем Инфо о доставке
        this.deliveryInfo = val.type === 'samovyvoz' ? val : this.lastDeliveryInfo

        if (!isEqual(val, oldVal)) {
          // console.log('set_delivery_type', val, oldVal)
          // await this.$store.dispatch('delivery/setDeliveryType', val.type)
          await this.setDeliveryType(val.type)
          const cartParams = {
            prepay: this.prePay,
            city_id: this.address.town.id,
            delivery_type: val.type  
          }
          this.$emit('need-update-cart', cartParams)
        }  
        if (val.type != 'samovyvoz') this.inputSetFocus('addr')
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
      deliveryInfo(val) {
        if (!val) return
        const refName = this.getFirstRequiredNotValidField()
        // console.log('deliveryInfo refName', refName)
        if (refName) this.inputSetFocus(refName)  
      },
      pvzList(val) {
        this.fieldsIsRequired.pvz.req =  (!!val && val.length ) 
      },
      async prePay(val) {
        // await this.$store.dispatch('delivery/getDeliveryOptions', {city_id: val.id, prepay: val} )
        await this.getDeliveryOptions( {city_id: val.id, prepay: val} )
        this.$emit('select-delivery-type', this.getTarif(this.delivery))
      },
      async orderClick(val) {
        console.log('orderClick', val)
        // if (val === 1) return
        // setErrorState
        if (this.orderFormIsValid) {
            let param = {
              name:       this.name.trim(),
              sname:      this.sname.trim(),
              tname:      this.tname.trim(),
              phone:      this.tel,
              email:      this.email.trim(),
              comment:    this.orderComment.trim(),
              post_index: this.address.zip.trim(),
              address:    this.address.addr.trim(),
              city_id:    this.address.town.id,
              pvz_code:   this.lastDeliveryInfo ? this.lastDeliveryInfo.code : '',
              tarif_type: this.deliveryService ? this.deliveryService.type : '',
              prepay:     this.prePay,
            }
            // console.log('order params', param)

          const orderRes = await this.$store.dispatch('order/newOrder', param)
          if (orderRes === 'ok') {
            // console.log('order success', orderRes)
            this.$store.commit('cart/CLEAR_CART',this.$store.state)
            const formUrl = this.$store.getters['order/getPrepayFormUrl']
            if (formUrl && formUrl.length && process.browser) {
              window.location.href = formUrl
            } else {
              this.$router.push({path: '/order/register'})
            }
          } else {
            // console.log('order fail', orderRes)
            this.$router.push({path: '/order/pay-fail'})
          }



        } else {
          if (val > 1) this.setErrorState = !this.orderFormIsValid
          // Вычисляем первое не верно заполненное поле
          let refItem = Object.entries(this.fieldsIsRequired)
                                .sort((v1,v2) => v1[1].order - v2[1].order)
                                .find(([key,val]) => val.req && !val.valid)
          if (refItem) { // И перемещаемся к нему
            refItem = refItem[0]                      
            if (this.$refs[refItem]) this.$refs[refItem].scrollIntoView({block: "center", behavior: "smooth"})
          }
        }  
      },
      
    },
    
  }
</script>

<style lang="scss">
  // .qqq { height: 100%; width: 100%;}
  .select-single {
    font-size: .8em!important;
  }
  .prop-item {
    &:not(:last-child){margin-bottom: .7em;}
    span {font-weight: 500;}
  }
  .pvz-select {
    display: flex;
    align-items: stretch;
    // height: 820px;
    // width: 1690px;
    height: 100%;
    width: 100%;
    // padding: 2.5rem; 
    background: transparent;
    @include media-max-width2($md - 1){
      // flex-wrap: wrap;
      display: block;
    }

    // &-sidebar {
    //   flex-shrink: 0;

    // }
    &-map {
      background: gray;
      flex-grow: 1;
      @include media-max-width2($md - 1){
        width: 100%;
        height: 50%;
      }

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