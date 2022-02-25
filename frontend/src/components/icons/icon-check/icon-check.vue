<template>
  <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" data-svg-transition>
    <style>
      [data-svg-transition] * {transition : {{transition}};}
    </style>
    <g v-if="type==='checkbox'">  
      <rect width="30" height="30" :fill="isChecked ? checkedColorBgr : 'transparent'" rx="3"/>
      <rect width="28" height="28" x="1" y="1" :stroke="isChecked ? 'transparent' : 'var(--base-color4)'" stroke-width="2" rx="2"/>
      <g :fill="isChecked ? colorMarker : 'transparent'">
        <path d="M12.92 22.5a1.11 1.11 0 01-.94-.481l-5.485-6.941c-.392-.561-.314-1.283.235-1.684.55-.4 1.255-.32 1.647.24l5.484 6.942c.392.561.313 1.283-.235 1.683-.236.16-.47.241-.706.241z"/>
        <path d="M12.92 22.5c-.235 0-.549-.08-.706-.24-.549-.401-.627-1.203-.235-1.684l9.644-12.585c.392-.561 1.176-.641 1.647-.24.549.4.627 1.202.235 1.683l-9.644 12.585a1.11 1.11 0 01-.941.481z"/>
      </g>
    </g>
    <g v-else>
      <circle cx="15" cy="15" r="14.5" :stroke="isChecked ? colorMarker : 'var(--base-color4)'"/>
      <circle cx="15" cy="15" r="10.313" :fill="isChecked ? colorMarker : 'transparent'"/>
    </g>
  </svg>
</template>
<script>
const checkedColorMarkerCheckbox = '#fff'             // Цвет по-умолчанию для маркера чекбокса
const checkedColorMarkerRadio = 'var(--base-color1)'  // Цвет по-умолчанию для маркера радиобокса
export default {
  name: "icon-check",
  props: {
    checkedColorBgr: {
      type: String,
      default: 'var(--base-color1)'
    },
    checkedColorMarker: {
      type: String,
      default: ''
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: '.3s'
    },
    type: {
      type: String,
      default: 'checkbox'
    },

  },
  data() {
    return {
      colorMarker: ''
    }
  },
  created() {
    if (this.checkedColorMarker === '') {
      this.colorMarker =  this.type === 'checkbox' ? checkedColorMarkerCheckbox : checkedColorMarkerRadio
    } else {
      this.colorMarker = this.checkedColorMarker
    }
  }
}
</script>
<style lang="scss" scoped>
  // svg {
  //   width: 1em;
  //   height: 1em;
  //   font-size: 50px;
  // }
  // * {transition : .3s}

</style>