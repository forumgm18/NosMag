import { wrapFunctional } from './utils'

export { default as CustomSelect } from '../../components/custom-select.vue'
export { default as CommonBtnGoBack } from '../../components/common/btn-go-back.vue'
export { default as CommonBuyBtn } from '../../components/common/buy-btn.vue'
export { default as CommonIcons } from '../../components/common/icons.vue'
export { default as CommonLoading } from '../../components/common/loading.vue'
export { default as CommonQuantitySize } from '../../components/common/quantity-size.vue'
export { default as CommonQuantity } from '../../components/common/quantity.vue'
export { default as CommonSlickSliderProduct } from '../../components/common/slick-slider-product.vue'
export { default as CommonStars } from '../../components/common/stars.vue'
export { default as ModalsBasketAddModal } from '../../components/modals/basket-add-modal.vue'
export { default as ModalsTabSize } from '../../components/modals/tab-size.vue'
export { default as ProductsProductItem } from '../../components/products/product-item.vue'
export { default as ProductsProductList } from '../../components/products/product-list.vue'
export { default as ReviewsReviewItem } from '../../components/reviews/review-item.vue'
export { default as Reviews } from '../../components/reviews/reviews.vue'
export { default as CommonBreadcrumbs } from '../../components/common/breadcrumbs/breadcrumbs.vue'
export { default as CommonSublinksMenu } from '../../components/common/sublinks-menu/sublinks-menu.vue'
export { default as CommonPopup } from '../../components/common/popup/popup.vue'
export { default as CommonTooltip } from '../../components/common/tooltip/tooltip.vue'
export { default as FiltersFilterSelect } from '../../components/filters/filter-select/filter-select.vue'
export { default as FooterAppFooter } from '../../components/footer/app-footer/app-footer.vue'
export { default as HeaderAppHeader } from '../../components/header/app-header/app-header.vue'
export { default as HeaderBasketTopBasket } from '../../components/header/basket/top-basket.vue'
export { default as HeaderBurger } from '../../components/header/burger/burger.vue'
export { default as HeaderSearch } from '../../components/header/header-search/header-search.vue'
export { default as HeaderLoginForm } from '../../components/header/login-form/login-form.vue'
export { default as HeaderMenuTop } from '../../components/header/menu-top/menu-top.vue'
export { default as SortsSortSelect } from '../../components/sorts/sort-select/sort-select.vue'
export { default as CommonFormsCheckbox } from '../../components/common/forms/checkbox/checkbox.vue'
export { default as CommonFormsPopupInputForm } from '../../components/common/forms/popup-input-form/popup-input-form.vue'
export { default as CommonFormsRadioCheckbox } from '../../components/common/forms/radio-checkbox/radio-checkbox.vue'
export { default as CommonFormsVnmSelect } from '../../components/common/forms/vnm-select/vnm-select.vue'

export const LazyCustomSelect = import('../../components/custom-select.vue' /* webpackChunkName: "components/custom-select" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonBtnGoBack = import('../../components/common/btn-go-back.vue' /* webpackChunkName: "components/common-btn-go-back" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonBuyBtn = import('../../components/common/buy-btn.vue' /* webpackChunkName: "components/common-buy-btn" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonIcons = import('../../components/common/icons.vue' /* webpackChunkName: "components/common-icons" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonLoading = import('../../components/common/loading.vue' /* webpackChunkName: "components/common-loading" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonQuantitySize = import('../../components/common/quantity-size.vue' /* webpackChunkName: "components/common-quantity-size" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonQuantity = import('../../components/common/quantity.vue' /* webpackChunkName: "components/common-quantity" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonSlickSliderProduct = import('../../components/common/slick-slider-product.vue' /* webpackChunkName: "components/common-slick-slider-product" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonStars = import('../../components/common/stars.vue' /* webpackChunkName: "components/common-stars" */).then(c => wrapFunctional(c.default || c))
export const LazyModalsBasketAddModal = import('../../components/modals/basket-add-modal.vue' /* webpackChunkName: "components/modals-basket-add-modal" */).then(c => wrapFunctional(c.default || c))
export const LazyModalsTabSize = import('../../components/modals/tab-size.vue' /* webpackChunkName: "components/modals-tab-size" */).then(c => wrapFunctional(c.default || c))
export const LazyProductsProductItem = import('../../components/products/product-item.vue' /* webpackChunkName: "components/products-product-item" */).then(c => wrapFunctional(c.default || c))
export const LazyProductsProductList = import('../../components/products/product-list.vue' /* webpackChunkName: "components/products-product-list" */).then(c => wrapFunctional(c.default || c))
export const LazyReviewsReviewItem = import('../../components/reviews/review-item.vue' /* webpackChunkName: "components/reviews-review-item" */).then(c => wrapFunctional(c.default || c))
export const LazyReviews = import('../../components/reviews/reviews.vue' /* webpackChunkName: "components/reviews" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonBreadcrumbs = import('../../components/common/breadcrumbs/breadcrumbs.vue' /* webpackChunkName: "components/common-breadcrumbs" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonSublinksMenu = import('../../components/common/sublinks-menu/sublinks-menu.vue' /* webpackChunkName: "components/common-sublinks-menu" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonPopup = import('../../components/common/popup/popup.vue' /* webpackChunkName: "components/common-popup" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonTooltip = import('../../components/common/tooltip/tooltip.vue' /* webpackChunkName: "components/common-tooltip" */).then(c => wrapFunctional(c.default || c))
export const LazyFiltersFilterSelect = import('../../components/filters/filter-select/filter-select.vue' /* webpackChunkName: "components/filters-filter-select" */).then(c => wrapFunctional(c.default || c))
export const LazyFooterAppFooter = import('../../components/footer/app-footer/app-footer.vue' /* webpackChunkName: "components/footer-app-footer" */).then(c => wrapFunctional(c.default || c))
export const LazyHeaderAppHeader = import('../../components/header/app-header/app-header.vue' /* webpackChunkName: "components/header-app-header" */).then(c => wrapFunctional(c.default || c))
export const LazyHeaderBasketTopBasket = import('../../components/header/basket/top-basket.vue' /* webpackChunkName: "components/header-basket-top-basket" */).then(c => wrapFunctional(c.default || c))
export const LazyHeaderBurger = import('../../components/header/burger/burger.vue' /* webpackChunkName: "components/header-burger" */).then(c => wrapFunctional(c.default || c))
export const LazyHeaderSearch = import('../../components/header/header-search/header-search.vue' /* webpackChunkName: "components/header-search" */).then(c => wrapFunctional(c.default || c))
export const LazyHeaderLoginForm = import('../../components/header/login-form/login-form.vue' /* webpackChunkName: "components/header-login-form" */).then(c => wrapFunctional(c.default || c))
export const LazyHeaderMenuTop = import('../../components/header/menu-top/menu-top.vue' /* webpackChunkName: "components/header-menu-top" */).then(c => wrapFunctional(c.default || c))
export const LazySortsSortSelect = import('../../components/sorts/sort-select/sort-select.vue' /* webpackChunkName: "components/sorts-sort-select" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonFormsCheckbox = import('../../components/common/forms/checkbox/checkbox.vue' /* webpackChunkName: "components/common-forms-checkbox" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonFormsPopupInputForm = import('../../components/common/forms/popup-input-form/popup-input-form.vue' /* webpackChunkName: "components/common-forms-popup-input-form" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonFormsRadioCheckbox = import('../../components/common/forms/radio-checkbox/radio-checkbox.vue' /* webpackChunkName: "components/common-forms-radio-checkbox" */).then(c => wrapFunctional(c.default || c))
export const LazyCommonFormsVnmSelect = import('../../components/common/forms/vnm-select/vnm-select.vue' /* webpackChunkName: "components/common-forms-vnm-select" */).then(c => wrapFunctional(c.default || c))
