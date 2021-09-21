<template lang="pug">
  .product-card(:data-product-id="product.id" itemscope itemtype = "https://schema.org/Product")
    meta(v-if="product.art" itemprop="productID" :content="`артикул: ${product.art}`")
    .product-card-base
      nuxt-link(:to="`${mocCatalogLink}${product.alias}`" class="product-card_img" itemprop="url")
        .product-card-hover-block
          div.img-container(v-if="product.images.length")
            .product-img-hover( v-for="img of product.images" :key="img.id")
              .a
                img(:src="img" :alt="product.comment" loading="lazy" itemprop = "image")
          svg.icon.icon-non-img(v-else) <use href="#icon-non-img"/>
          product-tags(:tags="labels")
          .btn-quick-view(
            @click.stop.prevent="quickViewShow(true)"
            ) {{$options.BTN_QUICK_VIEW_TEXT}}
      .product-card_info
        .product-card_info-top
          .product-card_price-block(itemprop = "offers" itemscope itemtype = "https://schema.org/Offer" )
            .product-card_price-old(v-if="sale && !product.price_min") {{ product.oldprice }}
            .product-card_price-actual(v-if="product.price_min" :class="{'price-sale': sale && !product.price_min}" )
              meta(itemprop="priceCurrency" content="RUB")
              span(itemprop="price") от {{ product.price_min }}
              span {{currency}}
            .product-card_price-actual(v-else :class="{'price-sale': sale}")
              meta(itemprop="priceCurrency" content="RUB")
              span(itemprop="price") {{ product.price }}
              span {{currency}}
          .btn-add2basket
            svg.icon.icon-btn-plus.plus <use href="#icon-btn-plus"/>
            span.text {{$options.BTN_ADD2BASKET_TEXT}}
            svg.icon.icon-basket <use href="#icon-basket"></use>

        nuxt-link.product-card_descr(:to="`${mocCatalogLink}${product.alias}`" itemprop="url")
          v-clamp(autoresize :max-lines="2" itemprop = "name") {{ product.name }}
        v-stars(:rating="product.rating_stars || 0" )
    quick-view(
      v-if="isQuickView" 
      :product="product"
      :catalog-link="mocCatalogLink"
      @close-quick-view="quickViewShow"
      )
          
</template>

<script>
import VClamp from 'vue-clamp'
import vStars from '~/components/common/stars/stars'
import productTags from '~/components/products/product-tags/product-tags'
import quickView from '~/components/products/quick-view/quick-view'
// import sale from '~/utils/sale'
export default {
  name: 'ProductCard',
  components: { VClamp, vStars, quickView, productTags },
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
  data: function () {
    return {
      isQuickView: false,
      sale: 0,
      mocCatalogLink: '/catalog/razdel/sub_razdel/'
    }  
  },
  BTN_QUICK_VIEW_TEXT: 'Быстрый просмотр',
  BTN_ADD2BASKET_TEXT: 'В корзину',
  computed: {
    labels() { return this.product.labels || null},
    info_table() { return this.product.info_table || null},
    sizes() { return this.product.sizes || null},
  },
  mounted() {
    // console.log(this.product)
    // this.sale = sale(this.product.price, this.product.oldprice)
    // debugger
    this.sale = this.$sale(this.product.price, this.product.oldprice)
  },
  methods: {
    showModal() {
      this.$modal.show('basket-add-modal', { addedProduct: this.product.id })
    },
    quickViewShow(v) { this.isQuickView = v },
  },
}
</script>

<style lang="scss">
@import 'product-card';

</style>
