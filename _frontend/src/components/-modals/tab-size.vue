<template lang="pug">
  client-only
    modal(
      name="tab-size"
      transition="pop-out"
      height="auto"
      class="modal-tab-size"
      :max-width="640"
      :adaptive="true"
      :scrollable="true"
      :pivot-y="0.5"
      :reset="true"

    )
      //.modal-bgr(data-modal-close)
      .modal-content
        .modal-close(@click="$modal.hide('tab-size')")
          svg.icon <use href="#icon-close"></use>
        .modal-title Таблица размеров
        .modal-body
          table.size-table
            tr.size-table-header
              th(v-for="(tt in tabTitle" v-html="tt")
              tr(v-for="tr in sizes")
                td(v-for="td in tr") {{td}}

</template>

<script>
export default {
  name: 'TabSize',
  computed: {
    sizes: s => s.$store.getters.tabSizes.sizes,
    tabTitle: s => s.$store.getters.tabSizes.tabTitle
  }
}
</script>

<style scoped></style>
