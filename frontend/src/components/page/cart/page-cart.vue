<template lang="pug"  >
  .cart-page
    h1.page-title {{cartTitle}}
    .cart-table
      .cart-table-row.title
        .cart-product-img Товар
        .cart-table-product 
          //- .cart-table-qprice
          .cart-product-info
          .cart-table-quantity {{quantityTitle}}
          .cart-table-price 
            .cart-table-price-blok Цена
      .cart-table-row(v-for="(item, ind) in cart.items" :key="ind")
        .cart-table-row-del(@click.prevent="delCartItem(item.scode)")
          svg.icon.icon-close <use href="#icon-close"/>
        nuxt-link.cart-product-img(:to="`${linkPath}${item.alias}`")
          .cart-product-img-box
            .img-box
              img(
                :src="`${imgPath + imgPrefix.t + item.images[0]}`"
                :srcset="`${imgPath + imgPrefix.t +imgRetinaPrefix + item.images[0]} 2x`"
                )
        .cart-table-product 
          .cart-product-info
            nuxt-link.cart-product-title(:to="`${linkPath}${item.alias}`") {{item.name}}
            .cart-product-props 
              .cart-product-props-label Размер:
              .cart-product-props-value {{item.size}}

          //- .cart-table-qprice 
          .cart-table-quantity 
            v-input-number(
              :max="item.ostatok"
              :min="1"
              :value="item.q"
              :append-text="item.unit_name"
              @input="qualityChange($event, item)"
              )
          .cart-table-price 
            //- .cart-table-price-sale(v-if="item.oldprice") {{item.oldprice}}{{currencyShort}}
            .cart-table-price-blok 
              .cart-table-price-total(v-html="`${itemCost(item.price, item.q)} ${currency}`")
              .cart-table-price-piece(v-html="`${priceForOne(item.price, item.unit_name)}`")
      .cart-total-row.cart-table-footer 
        .cart-total-lable(v-html="`Товары ${cart.items_q}&nbsp;шт.`") 
        .cart-total-sum(v-html="`${cart.sum.toLocaleString()} ${currency}`")

</template>

<script>
  export default {
    props: {
      cart: {
        type: Object,
        requred: true
      },
      cartTitle: {
        type: String,
        default: ''
      },
      linkPath: {
        type: String,
        default: '/'
      },
    },
    computed: {
      quantityTitle() { return process.browser && this.documentWidth >= 992 ? 'Количество' : 'Кол-во' },
      currency() { return this.$store.state.settings.currency },
      currencyShort() {return this.$store.state.settings.currencyShort},
      imgPath() {return this.$store.state.settings.imgPath},
      imgPrefix() {return this.$store.state.settings.imgPrefix},
      imgRetinaPrefix() {return this.$store.state.settings.imgRetinaPrefix},
    },
    methods: {
      async delCartItem(scode) {
        await this.$store.dispatch('cart/delCartItem', {scode} )
        await this.$nuxt.refresh()
        // await this.$store.dispatch('cart/getCart')
      },
      itemCost(price, q, localeFormatStr = true) { 
        const p = parseFloat(price, 10) * parseInt(q, 10)
        return localeFormatStr ? p.toLocaleString() : p
        },
      async qualityChange(q, itm) {
        // console.log('e: ', e)
        // debugger
        if (q != itm.q) {
          await this.$store.dispatch('cart/changeCartItem', {scode: itm.scode, q: q} )
          await this.$nuxt.refresh()
        }
      },
      priceForOne(price, unit_name) { return `${price} ${this.currencyShort} за ${unit_name}`},
  },

  }
</script>

<style lang="scss" scoped>

</style>