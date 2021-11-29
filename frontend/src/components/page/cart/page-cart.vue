<template lang="pug"  >
  .cart-page
    h1.page-title {{cartTitle}}
    .cart-table
      .cart-table-row.title
        .cart-table-product Товар
        .cart-table-quantity {{quantityTitle}}
        .cart-table-price Цена
      .cart-table-row(v-for="(item, ind) in cart.items" :key="ind")
        .cart-table-row-del(@click.prevent="delCartItem(item.scode)")
          svg.icon.icon-close <use href="#icon-close"/>
        .cart-table-product 
          nuxt-link.cart-product-img(:to="`${linkPath}${item.alias}`")
            .cart-product-img-box
              .img-box
                img(
                  :src="`${imgPath + imgPrefix.t + item.images[0]}`"
                  :srcset="`${imgPath + imgPrefix.t +imgRetinaPrefix + item.images[0]} 2x`"
                  )
          .cart-product-info
            nuxt-link.cart-product-title(:to="`${linkPath}${item.alias}`") {{item.name}}
            .cart-product-props 
              .cart-product-props-label Размер:
              .cart-product-props-value {{item.size}}
            //- .cart-product-props 
              .cart-product-props-label Доставка:
              .cart-product-props-value {{item.post_date}}

        .cart-table-quantity 
          v-input-number(
            :max="item.ostatok"
            :min="1"
            :value="item.q"
            :append-text="item.unit_name"
            @input="qualityChange($event, item)"
            )
        .cart-table-price 
          .cart-table-price-sale {{item.oldprice}}{{currencyShort}}
          .cart-table-price-blok 
            .cart-table-price-total {{itemCost(item.price, item.q)}} {{currency}}
            .cart-table-price-piece {{priceForOne(item.price, item.unit_name)}}
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
      itemCost(price, q) { return parseFloat(price, 10) * parseInt(q, 10)},
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