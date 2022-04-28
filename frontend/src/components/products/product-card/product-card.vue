<template lang="pug">
  .product-card(:data-product-id="product.id" itemscope itemtype = "https://schema.org/Product")
    meta(v-if="product.art" itemprop="productID" :content="`артикул: ${product.art}`")
    .product-card-base
      nuxt-link(:to="`${mocCatalogLink}${product.alias}`" class="product-card_img" itemprop="url")
        .product-card-hover-block
          div.img-container(v-if="product.images.length")
            .product-img-hover( v-for="img of product.images" :key="img.id")
              .a
                img(:src="`${imgPath}${img.toLowerCase()}`" :alt="product.comment" loading="lazy" itemprop = "image")
          svg.icon.icon-non-img(v-else) <use href="#icon-non-img"/>
          product-tags(:tags="labels")
          .btn-quick-view(
            @click.stop.prevent="quickViewShow(true)"
            ) {{$options.BTN_QUICK_VIEW_TEXT}}
      .product-card_info
        .product-card_info-top
          .product-card_price-block(itemprop = "offers" itemscope itemtype = "https://schema.org/Offer" )
            .product-card_price-actual(  )
              meta(itemprop="priceCurrency" content="RUB")
              span(itemprop="price") {{ priceStr }}
              span(v-html="currency")
            //- .product-card_price-actual(v-else )
              meta(itemprop="priceCurrency" content="RUB")
              span(itemprop="price") {{ priceStr }}
              span(v-html="currency")
            .product-card_price-old(v-if="sale && !product.price_min") 
              span {{ product.oldprice }}
              span(v-html="currency")
            product-tag(v-if="sale && !product.price_min" name="SALE" type="sale" bgr-color="var(--product-tag-sale-bgr)")
              
        v-stars.product-rating(:value="product.rating_stars || 0" )
        nuxt-link.product-card_descr(:to="`${mocCatalogLink}${product.alias}`" itemprop="url")
          v-clamp(autoresize :max-lines="2" itemprop = "name") {{ product.name }}
            template(#after="{ expand, clamped }")
              span( v-if="clamped" @click="expand" class="dot-clamp") ...
    .product-card_bottom-hover-block
      div  
        .btn(@click="showModal")
          span.text {{$options.BTN_ADD2BASKET_TEXT}}
        .product-card_sizes(v-if="sizes && sizes.length")
          .product-card_sizes-title Размеры в наличии
          .product-card_sizes-text
            v-clamp(autoresize :max-lines="1" ellipsis="") {{sizesToStr}}
              template(#after="{ expand, clamped }")
                span( v-if="clamped" @click="expand" class="dot-clamp") ...



    //- quick-view(
      v-if="isQuickView" 
      :product="product"
      @close-quick-view="quickViewShow"
      )

    //- client-only  
      vue-final-modal(
        :name="`select-size-modal-${product.id}`" 
        v-slot="{ close }" 
        v-model="tabSizesModalShow"
        :resize="false"
        :classes="['modal-container', 'report-email']"
        :content-class="['modal-content', 'default']"
        :overlay-class="['modal-overlay']"
        :fit-parent="true"
        
        )

        .psz-popup-title
          span.text Выберите размер
          span.psz-popup-close(@click="close")
            svg.icon.icon-close <use href="#icon-close"/>
        .psz-table-content-title(v-if="selectedSize.table && selectedSize.table.length")
          .psz-item.title
            .col {{selectedSize.table[0].name}}
            .col(v-if="selectedSize.table[1]") {{selectedSize.table[1].name}}
        .psz-table-content(v-if="sizes" ref="pszTc")
          template(v-for="(item, index) in sizes")
            .psz-item(
              :key="index"
              :class="{'in-stock' : item.active && item.ostatok > 0, active: item === selectedSize }"
              @click="selectSize(item, item.active && item.ostatok > 0)"
              v-if="item.table && item.table.length"
              ) 
              .col {{item.table[0].value}}
              .col(v-if="item.table[1]") {{item.table[1].value}}
        .btn(@click.stop.prevent="addToCart") {{$options.BTN_ADD2BASKET_TEXT_2}}

</template>

<script>
// import VClamp from 'vue-clamp'

export default {
  name: 'product-card',
  // components: {     VClamp,     },
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
    // currency: {
    //   type: String,
    //   // default: '&#8381;'
    //   default: this.defaultCurrency || 'руб.'
    // },
    },
  data: function () {
    return {
      isQuickView: false,
      sale: 0,
      // imgPath: '/images/catalog/',
      // mocCatalogLink: '/catalog/razdel/sub_razdel/',
      mocCatalogLink: '/',
      selectedSize: null,
      selectedSizeCount: 1,
      addToCartPopup: false,
      tabSizesModalShow: false,
    }  
  },
  BTN_QUICK_VIEW_TEXT: 'Быстрый просмотр',
  BTN_ADD2BASKET_TEXT: 'В корзину',
  BTN_ADD2BASKET_TEXT_2: 'Добавить в корзину',
  computed: {
    currency() {return this.$store.getters['settings/currency']},
    labels() { return this.product.labels || null},
    info_table() { return this.product.info_table || null},
    sizes() { return this.product.sizes || null},
    imgPath() {return this.$store.state.settings.imgPath || ''},
    sizesToStr() { 
      if (this.sizes && this.sizes.length) {
        return this.sizes.reduce((s, item) => s + item.name + ' ' , '')
        // return this.sizes.reduce((s, item) => s + item.name + '&emsp;' , '')
      } else {return ''}
    },
    sizesToStrHtml() { 
      if (this.sizes && this.sizes.length) {
        return this.sizes.reduce((s, item) => s + `<el class="sizes-item">${item.name}</el>`, '')
      } else {return ''}
    },

    priceStr() {
      return this.product.price_min ? `от ${this.product.price_min}` : this.product.price
    }
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
      let self = this
      this.$vfm.show({ 
        component: 'product-card-select-size',
        bind: {
          sizes: this.sizes,
          selectedSize: this.selectedSize,
          btnText: this.$options.BTN_ADD2BASKET_TEXT_2,
        },
        on: {
          add2cart(close) {
            self.addToCart()
            close()
          },
          selectedSize(val) {
            self.selectedSize = val
            self.selectedSizeCount = 1
          }
        },
      },
    )

    },
    quickViewShow(v) { 
      // this.isQuickView = v 
      let self = this
      this.$vfm.show({ 
        component: 'quick-view',
        bind: {
          product: this.product, 
          
        },
        on: {
          add2cart(close) {
            self.addToCart()
            close()
          },
          selectedSize(val) {
            self.selectedSize = val
            self.selectedSizeCount = 1
          }
        },
      },
    )

    },
    async addToCart() {
      const val = []
      val.push({scode: this.selectedSize.scode, q: 1 })
      // val.push({scode: this.selectedSize.scode, q: 1 })
      console.log('val: ', val)
      this.$store.dispatch('cart/addToCart', val)
      this.$vfm.hide(`select-size-modal-${this.product.id}`, )
      // await this.$nuxt.refresh()
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

</style>
