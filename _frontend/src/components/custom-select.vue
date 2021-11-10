<template>
  <div class="select"
       :class="[options.class, {open: isOpen}]"
       v-on:mouseleave="stateClose"
        >
    <div class="select-value">
      <input v-if="options.type==='select'" type="text" :name="options.name" v-model="value" hidden>
      <div class="select-title" @click="stateToggle">{{placeholder}}</div>
      <div class="select-title mobile" @click="stateToggle">{{placeholder_short}}</div>
      <div class="select-arrow triangle" @click="stateToggle"></div>
    </div>
    <div class="select-list">
      <div class="select-list-item"
           v-for="item of options.items"
           :key="item.id"
           :data-option-value="item.value"
      >
        <a href="#" @click.prevent="userSelect(item)">{{item.title}}</a>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "custom-select",
  props:['options'],
  data: () => ({
    isOpen: false,
    placeholder: '',
    placeholder_short: '',
    value: ''
  }),
  mounted () {
    this.placeholder = this.options.placeholder
    this.placeholder_short = this.options.placeholder_short
  },
  methods: {
    stateToggle () { this.isOpen = !this.isOpen },
    stateClose () { this.isOpen = false },
    userSelect (item) {
      this.placeholder = item.title
      this.value = item.value
      this.stateClose()
      this.$emit('user-select', item)
      if (this.options.type === 'dropdown' && item.href) this.$router.push(item.href)
    }
  }
}
</script>

<style scoped>

</style>
