<template lang="pug">
  main.container.cart-content(v-if="cart")
    .page-content
      page-cart(
        :cart="cart"
        :cart-title="$options.CART_TITLE"
        :link-path="mocCatalogLink"
        )
      page-order(:show-order="showOrder")  
    .cart-total
      .page-title {{$options.ORDER_TOTAL_TITLE}}
      .cart-total-row 
        .cart-total-lable(v-html="goodsPieces(cart.items_q * 111, 'шт')") 
        .cart-total-sum(v-html="`${cart.sum.toLocaleString()} ${currency}`")
          //- .cart-table-price-sale(v-if="cartSale" v-html="`-${cartSale.toLocaleString()} ${currency}`")
      .cart-total-row(v-if="totalSaleStr") 
        .cart-total-lable.sale {{$options.ORDER_TOTAL_SALE_TEXT}}
        .cart-total-sum.sale(v-html="`${totalSaleStr}`")
      .cart-total-row(v-if="totalSaleStr") 
        .cart-total-lable {{$options.ORDER_DELIVERY_LABEL}}
        .cart-total-sum Бесплатно
      .cart-total-row
        .cart-total-lable.total {{$options.ORDER_TOTAL_LABEL}}
        .cart-total-sum.total(v-html="totalCartStr")
      .cart-total-delivery {{$options.ORDER_DELIVERY_TEXT}}

      .cart-total-row.columns
        .cart-total-promo
          .cart-total-lable.promo {{$options.ORDER_PROMO_LABEL}}
          v-input-field(
            v-model="promoCode"
            placeholder="TY3433"
            )
        .btn(@click="goToOrder('order')") {{$options.BTN_TOTAL_TEXT}}

</template>

<script>
  export default {
    components: {
      },
    async fetch(){
      await this.$store.dispatch('cart/getCart')
    },

    CART_TITLE: 'Корзина',  
    ORDER_TOTAL_TITLE: 'ваш заказ',  
    ORDER_TOTAL_SALE_TEXT: 'Скидка',  
    ORDER_DELIVERY_TEXT: 'Действует бесплатная доставка при заказе от 3 000 руб.',  
    ORDER_DELIVERY_LABEL: 'Доставка',  
    ORDER_PROMO_LABEL: 'Введите промокод',  
    ORDER_TOTAL_LABEL: 'Итого',  
    BTN_TOTAL_TEXT: 'Заказать',  

    data() {
      return {
        mocCatalogLink: '/catalog/razdel/sub_razdel/',
        showOrder: false,
        promoCode: '',
      }
    },
  computed: {
    cart() {  return this.$store.state.cart.cart || null },
    currency() { return this.$store.state.settings.currency },
    cartSale() {
      return this.cart ? 
        this.cart.items.reduce((sum, item) => item.oldsum ? sum + item.oldsum : sum, 0)
        : 0
    },
    // currencyShort() {return this.$store.state.settings.currencyShort},
    totalSaleStr(localeString = true) { 
      const sum = this.cart.sum
      const oldsum = this.cart.oldsum || sum
      if ( sum === oldsum ) return false
      const p = localeString ? (oldsum - sum).toLocaleString() : oldsum - sum
      return `${p} ${this.currency}`
    },
    totalCartStr(localeString = true) { 
      const sum = this.cart.sum
      const delivery = 0
      const p = localeString ? (sum + delivery).toLocaleString() : sum + delivery
      return `${p} ${this.currency}`
    },

  },
  // mounted(){
  //   // this.yamapSettings.apiKey = this.yandexApiKey || ''
  //   if (this.storeCart) this.cart = Object.assign({}, this.storeCart)
  // },
  methods: {
  //   itemCost(price, q) { return parseFloat(price, 10) * parseInt(q, 10)},
  //   async qualityChange(q, itm) {
  //     // console.log('e: ', e)
  //     // debugger
  //     if (q != itm.q) {
  //       await this.$store.dispatch('cart/changeCartItem', {scode: itm.scode, q: q} )
  //       await this.$nuxt.refresh()
  //     }
  //   },
  //   priceForOne(price, unit_name) { return `${price} ${this.currencyShort} за ${unit_name}`},
    goodsPieces(q, unit_name) { return `Товары ${q}&nbsp;${unit_name}.`},
    // goToOrder() { this.showOrder = true },
    goToOrder(id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({behavior: "smooth", inline: "nearest"})
        this.showOrder = true
      }
    },
    onResize() { this.documentWidth = document.documentElement.clientWidth },
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
  .order-form-section.err {background: red;}
</style>