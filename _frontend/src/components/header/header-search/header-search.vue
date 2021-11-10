<template>
  <div class="header-search" data-search-form>
    <div data-close data-close-selector="data-search-form"></div>
    <a class="btn btn-search" href="#" data-search-mobile>
      <svg class="icon icon-loupe"><use href="#icon-search"></use></svg>
    </a>
    <div class="form-search-panel" data-header-search-panel>
      <form>
        <div class="form-line">
          <button class="btn btn-search" type="submit" data-btn-search>
            <svg class="icon icon-loupe">
              <use href="#icon-search"></use>
            </svg>
          </button>
          <div class="form-item">
            <input
              v-model="searchString"
              type="text"
              placeholder="Я ищу..."
              data-header-search-input
              @keyup="searchChange"
              @blur="blurChange"
            />
          </div>
        </div>
      </form>
      <div
        class="form-search-result"
        :class="{ open: isChange }"
        data-search-result
      >
        <div class="form-search-result-content">
          <div class="form-search-result-item">
            <a href="#"
              >Набор «На любой случай жизни», 10 пар
              <span class="warning">носк</span>ов по 2 пары в упаковке из 10</a
            ><span class="price">1000 &#8381;</span>
          </div>
          <div class="form-search-result-item">
            <a href="#"
              >Набор носочков «Лучшие носки», 8 пар
              <span class="warning">носк</span>ов по 2 пары в упаковке</a
            ><span class="price sale">700 &#8381;</span>
          </div>
          <div class="form-search-result-item">
            <a href="#"
              ><span class="warning">Носк</span>и детские «Разноцветные
              <span class="warning">носк</span>и», 10 пар
              <span class="warning">носк</span>ов по 2 в упаковке</a
            ><span class="price">От 1000 &#8381; до 2000 &#8381;</span>
          </div>
          <div class="form-search-result-item">
            <a class="more-result" href="#">Смотреть все результаты</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderSearch',
  data: () => ({
    isChange: false,
    searchString: '',
  }),
  methods: {
    searchChange() {
      this.isChange = this.searchString.length > 0
    },
    blurChange() {
      this.isChange = false
    },
  },
}
</script>

<style scoped></style>
