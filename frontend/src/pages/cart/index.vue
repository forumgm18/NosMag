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
        .cart-total-sum 
          div {{cart.sum}} {{currency}}
          .cart-table-price-sale {{cart.oldsum}}  {{currency}}
      .cart-total-row(v-if="totalSaleStr") 
        .cart-total-lable {{$options.ORDER_TOTAL_SALE_TEXT}}
        .cart-total-sale.bold {{totalSaleStr}}
      .cart-total-delivery {{$options.ORDER_TOTAL_DELIVERY_TEXT}}
      .btn.btn-3(@click="goToOrder('order')") {{$options.BTN_TOTAL_TEXT}}

</template>

<script>
  export default {
    components: {
      },
    fetch: async function({store}){
      await store.dispatch('cart/getCart')
    },
    CART_TITLE: 'Корзина',  
    ORDER_TOTAL_TITLE: 'оформление заказа',  
    ORDER_TOTAL_SALE_TEXT: 'Скидка',  
    ORDER_TOTAL_DELIVERY_TEXT: 'Действует бесплатная доставка при заказе от 3 000 руб.',  
    BTN_TOTAL_TEXT: 'Заказать',  

    data() {
      return {
        mocCatalogLink: '/catalog/razdel/sub_razdel/',
        showOrder: false,
      }
    },
  computed: {
    cart() {  return this.$store.state.cart.cart || null },
    currency() { return this.$store.state.settings.currency },
    // currencyShort() {return this.$store.state.settings.currencyShort},
    totalSaleStr() { 
      const sum = this.cart.sum
      const oldsum = this.cart.oldsum
      if (!oldsum || oldsum <= sum ) return false

      return `${oldsum - sum} ${this.currency}`
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