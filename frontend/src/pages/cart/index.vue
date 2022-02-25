<template lang="pug">
  main.container.cart-content(v-if="cart")
    .page-content
      .cart-page
        h1.page-title {{$options.CART_TITLE}}
        page-cart(
          key="available"
          :cart="cartAvailable"
          :cart-title="$options.CART_TITLE"
          :value="selectedItems"
          v-model="selectedItems"
          )
      .link(
        v-if="cartNotAvailable && cartNotAvailable.length" 
        @click="showUnavailable = !showUnavailable"
        ) {{showUnavailableText}}
      transition(v-if="cartNotAvailable && cartNotAvailable.length" name="fade" @enter="collpseEnter" )
        .cart-page.unavailable(v-if="showUnavailable" ref="unCart")    
          page-cart(
            key="unavailable"
            :cart="cartNotAvailable"
            :cart-title="$options.CART_TITLE"
            )
      page-order(
        :class="{ 'show-unavailable': showUnavailable }"
        :show-order="showOrder"
        :order-click="orderClick"
        @select-delivery-type="selectDeliveryType"
        @need-update-cart="getCartInfo" 
        )  
    .cart-total
      .cart-total-block
        //- ============= Итого ======================
        .cart-total-row(v-for="(item, index) in oform.prices" :key="index")
          .cart-total-lable(
            :class="{ total: item.type === 'itogo', sale: item.type === 'skidka',  }"
          ) {{item.name}}
          .cart-total-sum(
            :class="{ total: item.type === 'itogo', sale: item.type === 'skidka',  }"
            v-html="`${item.value}`"
            )
          //- ============= Текст про бесплатную доставку ======================
        .cart-total-delivery(v-if="oform.comment && oform.comment.length") {{oform.comment}}
          //- ============= Способ связи ======================
        v-contact-method(
          :selcomm="oform.selcomm"
          v-model="contactMethod"
        )
        .btn(
          @click="goToOrder('order')" 
          :class={disabled: btnDisabled }
          @form-valid="formValid"
          ) {{oform.button_text}}

        .policy(v-if="agrees")
          v-check-box2(
            v-for="(agr, index) in agrees" :key="index"
            v-model="agr.checked"
            )
            nuxt-link(:to="agr.link") {{agr.name}}

      .cart-total-block
        //- ============= Промокод ======================
        v-promo-code(
          :promo="promo"
          v-model="promoCode"
          @set-promo-succsess="setPromo"
          @set-promo-fail="delPromo"
          )
</template>

<script>
  import collapseMixin from '@/mixins/animate-collapse.mix'
  import {cloneDeep} from 'lodash'

  export default {
    mixins: [collapseMixin],

    async fetch(){
      await this.$store.dispatch('cart/getCart')
    },

    CART_TITLE: 'Корзина',  

    data() {
      return {
        selectedItems: [],
        showUnavailable: false,
        showOrder: false,
        // showOrder: true,
        promoCode: '',
        promoCollapse: true,
        deliveryTarif: null,
        btnDisabled: false,
        orderSteps: {
          currentStep: 0,
          steps: [
            'Оформить заказ',
            'Перейти к оплате',
          ]
        },
        orderClick: 0,
        agrees: null,
        contactMethod: []

      }
    },
  computed: {
    cart() {  return this.$store.getters['cart/getCart'] },
    oform() {  return this.$store.getters['cart/getOform'] },
    promo() {  return this.$store.getters['cart/getPromo'] },
    cartAvailable() { return this.cart.items.filter(item => item.active)},
    cartNotAvailable() {return this.cart.items.filter(item => !item.active)},
    currency() { return this.$store.state.settings.currency },
    // cartSale() {
    //   return this.cart ? 
    //     this.cart.items.reduce((sum, item) => item.oldsum ? sum + item.oldsum : sum, 0)
    //     : 0
    // },
    // currencyShort() {return this.$store.state.settings.currencyShort},
    // totalSaleStr(localeString = true) { 
    //   const sum = this.cart.sum
    //   const oldsum = this.cart.oldsum || sum
    //   if ( sum === oldsum ) return false
    //   const p = localeString ? (oldsum - sum).toLocaleString() : oldsum - sum
    //   return `${p} ${this.currency}`
    // },
    // totalCartStr(localeString = true) { 
    //   const sum = this.cart.sum
    //   const delivery = this.deliveryTarif ? this.deliveryTarif.price : 0
    //   const p = localeString ? (sum + delivery).toLocaleString() : sum + delivery
    //   return `${p} ${this.currency}`
    // },
    // getDeliveryPrice () {
    //   if (this.deliveryTarif) {
    //     return this.deliveryTarif.price ? `${this.deliveryTarif.price} ${this.currency}` : 'Бесплатно'
    //   }
    //   return undefined
    // },
    showUnavailableText() {
      return this.showUnavailable ? 'Скрыть недоступные к заказу' : 'Недоступны к заказу'
    },
  },
  created(){
    if (this.oform && this.oform.agrees) this.agrees = cloneDeep(this.oform.agrees)
  },
  // mounted(){
  //   this.agrees = cloneDeep(this.oform.agrees)
  // },
  methods: {
    async setPromo() {
      await this.$store.dispatch('cart/getCart')
    },
    delPromo() {
      this.promoCode = ''
    },
    async getCartInfo(val){
      await this.$store.dispatch('cart/getCart', val)
    },

    // getTotalTextValue(t) {
    //   const res = this.oform.prices.find(v => v.type === t)
    //   return res ? {name: res.name, value: res.value} : null
    // },
    // goodsPieces(q, unit_name) { return `Товары ${q}&nbsp;${unit_name}.`},
    // goToOrder() { this.showOrder = true },
    goToOrder(id) {
      const el = document.getElementById(id)
      if (el) {
        if (!this.showOrder) {
          el.scrollIntoView({behavior: "smooth", inline: "nearest"})
          this.showOrder = true
        }
        this.orderClick++
        // this.orderSteps.currentStep = 
        //   this.orderSteps.steps.length < this.orderSteps.currentStep ? this.orderSteps.currentStep++ : 0
      }
    },
    onResize() { this.documentWidth = document.documentElement.clientWidth },
    selectDeliveryType(val) {
      this.deliveryTarif = val
    },
    formValid(val) {
      this.btnDisabled = !val
    }
  },
  // watch:{
  //   town() {
  //     this.citiesSearchStr = this.town.name
  //   }
  // },
  beforeMount() {
    this.onResize()
    if (process.client) window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    if (process.client) window.removeEventListener('resize', this.onResize)
  },

    
  }
</script>

<style lang="scss" >
  @import "cart";
  @import "order";
  .cart-content .link {color: var(--base-color1)}
  .order-form-section.err {background: red;}

  .fade-enter-active {
    animation: collaspe-in .3s;
  }
  .fade-leave-active {
    animation: collaspe-in .3s reverse;
  }

</style>