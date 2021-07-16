<template lang="pug">
  .product-card(:data-product-id="product.id")
    .product-card-base
      nuxt-link(:to="`/${product.alias}`" class="product-card_img")
        .product-card-hover-block
          div.img-container(v-if="product.images.length")
            .product-img-hover( v-for="img of product.images" :key="img.id")
              .a
                img(:src="img" :alt="product.comment" loading="lazy")
          svg.icon.icon-non-img(v-else) <use href="#icon-non-img"/>

          .product-tag-block
            .product-tag(v-if="sale && !product.price_min")
              span Sale
              svg.icon.icon-percent <use href="#icon-percent"/>
            .product-tag(v-if="product.new")
              span New
              svg.icon.icon-arrow-new <use href="#icon-arrow-new"/>
            .product-tag(v-if="product.hit")
              span Hit
              svg.icon.icon-fire <use href="#icon-fire"/>
          .btn-quick-view Быстрый просмотр
      .product-card_info
        .product-card_info-top
          .product-card_price-block
            .product-card_price-old(v-if="sale && !product.price_min") {{ product.oldprice }}
            .product-card_price-actual(v-if="product.price_min" :class="{'price-sale': sale && !product.price_min}")
              span от {{ product.price_min }} {{currency}}
            .product-card_price-actual(v-else :class="{'price-sale': sale}") {{ product.price }} {{currency}}
          .btn-add2basket
            svg.icon.icon-btn-plus.plus <use href="#icon-btn-plus"/>
            span.text В корзину
            svg.icon.icon-basket <use href="#icon-basket"></use>



        nuxt-link.product-card_descr(:to="`/catalog/${product.alias}`")
          v-clamp(autoresize :max-lines="2") {{ product.name }}
        stars(:rating="product.rating_stars || 0")
</template>

<script>
import VClamp from 'vue-clamp'
import stars from '~/components/common/stars/stars'
import sale from '~/utils/sale'
export default {
  name: 'ProductCard',
  components: { VClamp, stars },
  props: {
    product: {
      type: Object,
      required: true
    },
    isBtn: {
      type: Boolean,
      required: false,
      default: true
    },
    isSizes: {
      type: Boolean,
      required: false,
      default: true
    },
    currency: {
      type: String,
      // default: '&#8381;'
      default: 'руб.'
    },
    },
  data: () => ({
    sale: 0,
  }),
  mounted() {
    // console.log(this.product)
    this.sale = sale(this.product.price, this.product.oldprice)
  },
  methods: {
    showModal() {
      this.$modal.show('basket-add-modal', { addedProduct: this.product.id })
    },
  },
}
</script>

<style lang="scss">
@import 'style';

</style>
