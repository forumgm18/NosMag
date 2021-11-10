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
          .btn-add2basket(@click="showModal")
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
    //- app-popup.popup-up(v-model="addToCartPopup" v-on:close-popup="closeAddToCartPopup")
    modal(
      :name="`select-size-modal-${product.id}`"
      height="auto"
      width="250px"
      classes="psz-popup"
      v-if="sizes && selectedSize"
      )
      .psz-popup-title
        span.text Выберите размер
        span.psz-popup-close(@click="$modal.hide(`select-size-modal-${product.id}`)")
          svg.icon.icon-close <use href="#icon-close"/>
      .psz-table-content-title(v-if="selectedSize")
        .psz-item.title
          .col {{selectedSize.table[0].name}}
          .col(v-if="selectedSize.table[1]") {{selectedSize.table[1].name}}
      .psz-table-content(v-if="sizes" ref="pszTc")
        .psz-item(
          v-for="(item, index) in sizes" :key="index"
          :class="{'in-stock' : item.active && item.ostatok > 0, active: item === selectedSize }"
          @click="selectSize(item, item.active && item.ostatok > 0)"
          v-if="item.table && item.table.length"
          ) 
          .col {{item.table[0].value}}
          .col(v-if="item.table[1]") {{item.table[1].value}}
      .btn(@click="addToCart") {{$options.BTN_ADD2BASKET_TEXT_2}}
          
</template>

<script>
import VClamp from 'vue-clamp'
import vStars from '~/components/common/stars/stars'
import productTags from '~/components/products/product-tags/product-tags'
import quickView from '~/components/products/quick-view/quick-view'
import appPopup from '~/components/common/popup/app-popup'

export default {
  name: 'ProductCard',
  components: { VClamp, vStars, quickView, productTags, appPopup },
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
      // mocCatalogLink: '/catalog/razdel/sub_razdel/',
      mocCatalogLink: '/',
      selectedSize: null,
      selectedSizeCount: 1,
      addToCartPopup: false
    }  
  },
  BTN_QUICK_VIEW_TEXT: 'Быстрый просмотр',
  BTN_ADD2BASKET_TEXT: 'В корзину',
  BTN_ADD2BASKET_TEXT_2: 'Добавить в корзину',
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
    this.selectedSize = this.sizes.find(s => s.active) 
  },
  methods: {
    showModal() {
      this.$modal.show(`select-size-modal-${this.product.id}`, )
    },
    quickViewShow(v) { this.isQuickView = v },
    async addToCart() {
      const val = []
      val.push({scode: this.selectedSize.scode, q: 1 })
      // val.push({scode: this.selectedSize.scode, q: 1 })
      console.log('val: ', val)
      this.$store.dispatch('cart/addToCart', val)
      this.$modal.hide(`select-size-modal-${this.product.id}`, )
      await this.$nuxt.refresh()
      // this.closeAddToCartPopup(false)
    },
    selectSize(v, toggle) {
      // debugger
      if (toggle) {
        this.selectedSizeCount = 1
        this.selectedSize = v
      }
    },
    // showAddToCartPopup() { this.addToCartPopup = true },
    // closeAddToCartPopup(val) { this.addToCartPopup = val }
  },
}
</script>

<style lang="scss">
@import 'product-card';
.psz-popup {
  font-size: 14px;

  // border: 1px solid #A7A7A7;
  border-radius: 5px; 
  padding: 10px 16px; 
  box-shadow: var(--box-shadow-modal);

  &-title {
    font-size: .8571em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: .5em;
    .text {
      font-weight: bold;
      text-transform: uppercase;
      margin-right: 0.5em;
    }
  }
  &-close{
    cursor: pointer;
  }
  .psz-table-content {
    font-size: 1em;
    padding: 1.4em 0;
    
  }
  .btn {font-size: 1em;}
}

</style>
