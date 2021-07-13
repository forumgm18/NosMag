import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  CustomSelect: () => import('../../components/custom-select.vue' /* webpackChunkName: "components/custom-select" */).then(c => wrapFunctional(c.default || c)),
  CommonBtnGoBack: () => import('../../components/common/btn-go-back.vue' /* webpackChunkName: "components/common-btn-go-back" */).then(c => wrapFunctional(c.default || c)),
  CommonBuyBtn: () => import('../../components/common/buy-btn.vue' /* webpackChunkName: "components/common-buy-btn" */).then(c => wrapFunctional(c.default || c)),
  CommonIcons: () => import('../../components/common/icons.vue' /* webpackChunkName: "components/common-icons" */).then(c => wrapFunctional(c.default || c)),
  CommonLoading: () => import('../../components/common/loading.vue' /* webpackChunkName: "components/common-loading" */).then(c => wrapFunctional(c.default || c)),
  CommonQuantitySize: () => import('../../components/common/quantity-size.vue' /* webpackChunkName: "components/common-quantity-size" */).then(c => wrapFunctional(c.default || c)),
  CommonQuantity: () => import('../../components/common/quantity.vue' /* webpackChunkName: "components/common-quantity" */).then(c => wrapFunctional(c.default || c)),
  CommonSlickSliderProduct: () => import('../../components/common/slick-slider-product.vue' /* webpackChunkName: "components/common-slick-slider-product" */).then(c => wrapFunctional(c.default || c)),
  CommonStars: () => import('../../components/common/stars.vue' /* webpackChunkName: "components/common-stars" */).then(c => wrapFunctional(c.default || c)),
  ModalsBasketAddModal: () => import('../../components/modals/basket-add-modal.vue' /* webpackChunkName: "components/modals-basket-add-modal" */).then(c => wrapFunctional(c.default || c)),
  ModalsTabSize: () => import('../../components/modals/tab-size.vue' /* webpackChunkName: "components/modals-tab-size" */).then(c => wrapFunctional(c.default || c)),
  ProductsProductItem: () => import('../../components/products/product-item.vue' /* webpackChunkName: "components/products-product-item" */).then(c => wrapFunctional(c.default || c)),
  ProductsProductList: () => import('../../components/products/product-list.vue' /* webpackChunkName: "components/products-product-list" */).then(c => wrapFunctional(c.default || c)),
  ReviewsReviewItem: () => import('../../components/reviews/review-item.vue' /* webpackChunkName: "components/reviews-review-item" */).then(c => wrapFunctional(c.default || c)),
  Reviews: () => import('../../components/reviews/reviews.vue' /* webpackChunkName: "components/reviews" */).then(c => wrapFunctional(c.default || c)),
  CommonBreadcrumbs: () => import('../../components/common/breadcrumbs/breadcrumbs.vue' /* webpackChunkName: "components/common-breadcrumbs" */).then(c => wrapFunctional(c.default || c)),
  CommonSublinksMenu: () => import('../../components/common/sublinks-menu/sublinks-menu.vue' /* webpackChunkName: "components/common-sublinks-menu" */).then(c => wrapFunctional(c.default || c)),
  CommonPopup: () => import('../../components/common/popup/popup.vue' /* webpackChunkName: "components/common-popup" */).then(c => wrapFunctional(c.default || c)),
  CommonTooltip: () => import('../../components/common/tooltip/tooltip.vue' /* webpackChunkName: "components/common-tooltip" */).then(c => wrapFunctional(c.default || c)),
  FiltersFilterSelect: () => import('../../components/filters/filter-select/filter-select.vue' /* webpackChunkName: "components/filters-filter-select" */).then(c => wrapFunctional(c.default || c)),
  FooterAppFooter: () => import('../../components/footer/app-footer/app-footer.vue' /* webpackChunkName: "components/footer-app-footer" */).then(c => wrapFunctional(c.default || c)),
  HeaderAppHeader: () => import('../../components/header/app-header/app-header.vue' /* webpackChunkName: "components/header-app-header" */).then(c => wrapFunctional(c.default || c)),
  HeaderBasketTopBasket: () => import('../../components/header/basket/top-basket.vue' /* webpackChunkName: "components/header-basket-top-basket" */).then(c => wrapFunctional(c.default || c)),
  HeaderBurger: () => import('../../components/header/burger/burger.vue' /* webpackChunkName: "components/header-burger" */).then(c => wrapFunctional(c.default || c)),
  HeaderSearch: () => import('../../components/header/header-search/header-search.vue' /* webpackChunkName: "components/header-search" */).then(c => wrapFunctional(c.default || c)),
  HeaderLoginForm: () => import('../../components/header/login-form/login-form.vue' /* webpackChunkName: "components/header-login-form" */).then(c => wrapFunctional(c.default || c)),
  HeaderMenuTop: () => import('../../components/header/menu-top/menu-top.vue' /* webpackChunkName: "components/header-menu-top" */).then(c => wrapFunctional(c.default || c)),
  SortsSortSelect: () => import('../../components/sorts/sort-select/sort-select.vue' /* webpackChunkName: "components/sorts-sort-select" */).then(c => wrapFunctional(c.default || c)),
  CommonFormsCheckbox: () => import('../../components/common/forms/checkbox/checkbox.vue' /* webpackChunkName: "components/common-forms-checkbox" */).then(c => wrapFunctional(c.default || c)),
  CommonFormsPopupInputForm: () => import('../../components/common/forms/popup-input-form/popup-input-form.vue' /* webpackChunkName: "components/common-forms-popup-input-form" */).then(c => wrapFunctional(c.default || c)),
  CommonFormsRadioCheckbox: () => import('../../components/common/forms/radio-checkbox/radio-checkbox.vue' /* webpackChunkName: "components/common-forms-radio-checkbox" */).then(c => wrapFunctional(c.default || c)),
  CommonFormsVnmSelect: () => import('../../components/common/forms/vnm-select/vnm-select.vue' /* webpackChunkName: "components/common-forms-vnm-select" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
