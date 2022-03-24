<template>
  <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" data-svg-transition>
    <style>
      [data-svg-transition] * {transition : {{transition}};}
    </style>
    <g v-if="type==='checkbox'">  
      <rect width="30" height="30" :fill="iconBgrColor" rx="3"/>
      <rect width="28" height="28" x="1" y="1" :stroke="iconBorderColor" stroke-width="2" rx="2"/>
      <g :fill="iconMarkerColor">
        <path d="M12.92 22.5a1.11 1.11 0 01-.94-.481l-5.485-6.941c-.392-.561-.314-1.283.235-1.684.55-.4 1.255-.32 1.647.24l5.484 6.942c.392.561.313 1.283-.235 1.683-.236.16-.47.241-.706.241z"/>
        <path d="M12.92 22.5c-.235 0-.549-.08-.706-.24-.549-.401-.627-1.203-.235-1.684l9.644-12.585c.392-.561 1.176-.641 1.647-.24.549.4.627 1.202.235 1.683l-9.644 12.585a1.11 1.11 0 01-.941.481z"/>
      </g>
    </g>
    <g v-else>
      <circle cx="15" cy="15" r="14.5" :stroke="iconBorderColor"/>
      <circle cx="15" cy="15" r="10.313" :fill="iconMarkerColor"/>
    </g>
  </svg>
</template>
<script>

export default {
  name: "icon-check",
  props: {
    baseCheckedColor: {
      type: String,
      default: 'var(--base-color1)'
    },
    baseNotCheckedColor: {
      type: String,
      default: 'var(--base-color4)'
    },
    baseHoverColor: {
      type: String,
      default: 'var(--base-color3)'
    },

    notCheckedColor: {
      type: Object,
      default() {
        return {
          checkbox:{ 
            marker: 'transparent',        // Цвет маркера
            background: 'transparent',    // Цвет фона 
            // border: 'var(--base-color4)'  // Цвет обводки (границы) 
            border: this.baseNotCheckedColor,  // Цвет обводки (границы) 
          },
          radio:{ 
            marker: 'transparent',        // Цвет маркера
            background: 'transparent',    // Цвет фона 
            // border: 'var(--base-color4)'  // Цвет обводки (границы) 
            border: this.baseNotCheckedColor,  // Цвет обводки (границы) 
          },
        }
      }
    },
    checkedColor: {
      type: Object,
      default() {
        return {
          checkbox:{ 
            marker: '#fff',                     // Цвет маркера
            // background: 'var(--base-color1)',   // Цвет фона 
            background: this.baseCheckedColor,   // Цвет фона 
            // border: 'var(--base-color1)'        // Цвет обводки (границы) 
            border: this.baseCheckedColor        // Цвет обводки (границы) 
          },
          radio:{ 
            // marker: 'var(--base-color1)',       // Цвет маркера
            marker: this.baseCheckedColor,       // Цвет маркера
            background: 'transparent',          // Цвет фона 
            // border: 'var(--base-color1)'        // Цвет обводки (границы) 
            border: this.baseCheckedColor        // Цвет обводки (границы) 
          },        
        }
      }
    },
    hoverColor: {
      type: Object,
      default() {
        return {
          checkbox:{ 
            marker:  'transparent',       // Цвет маркера
            background: 'transparent',    // Цвет фона 
            // border: 'var(--base-color3)'  // Цвет обводки (границы) 
            border: this.baseHoverColor  // Цвет обводки (границы) 
          },
          radio:{ 
            marker:  'transparent',       // Цвет маркера
            background: 'transparent',    // Цвет фона 
            // border: 'var(--base-color3)'  // Цвет обводки (границы) 
            border: this.baseHoverColor  // Цвет обводки (границы) 
          },
        }
      }
    },
    isChecked: {
      type: [Boolean, Number],
      default: false
    },
    isHover: {
      type: [Boolean, Number],
      default: false
    },
    transition: {
      type: String,
      default: '.15s'
    },
    type: {
      type: String,
      default: 'checkbox',

    },

  },
  data() {
    return {
      checked: false,
      hover: false,
    }
  },
  created() {
    this.checked = this.isChecked
    this.hover = this.isHover
  },
  computed: {
    iconIsChecked(){ return this.checked },
    iconIsHover() { return this.hover },
    iconBorderColor() { return this.getIconColor('border') },
    iconBgrColor() { return this.getIconColor('background') },
    iconMarkerColor() { return this.getIconColor('marker') },

  },
  methods: {
    getIconColor(el) {
      let res = this.notCheckedColor[this.type][el]
      if (!this.iconIsChecked) {
        if (this.iconIsHover) {
          res = this.hoverColor[this.type][el]
        }
      } else {
        res = this.checkedColor[this.type][el]
      }
      return res
    },

  },
  watch: {
    isChecked(val) { this.checked = val },
    isHover(val) { this.hover = val },
  }
}
</script>
