<template lang="pug">
  label.check-btn(
    @mouseenter="mouseEnter('icon')"
    @mouseleave="mouseLeave('icon')"
    ) 
    input(
      ref="inpt"
      hidden 
      :checked="isInputChecked"
      :type="type"  
      :value="value" 
      v-model="proxyChecked"
      )
    .check-btn_content(:style="stylesSettings")
      v-icon-check.check-btn_icon(ref="icon" :type="type" :is-checked="isInputChecked" )
      .check-btn_text
        slot


</template>

<script>
import {isEqual} from 'lodash'
export default {
  name: 'check-btn',
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    value: { },
    checked: {
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'radio'
    },
    bgrColor: {
      type: String,
      default: '#fff'
    },
    textColor: {
      type: String,
      default: 'var(--text-color-default)'
    },
    bgrColorChecked: {
      type: String,
      default: 'var(--base-color1)'
    },
    textColorChecked: {
      type: String,
      default: '#fff'
    },

  },
  data() {
    return {
      stylesSettings: {
        '--bgc': this.bgrColor, 
        '--tc': this.textColor,
        '--bgc-checked': this.bgrColorChecked, 
        '--tc-checked': this.textColorChecked 
      }
    }
  },
  computed: {
    isInputChecked() {
      if (this.proxyChecked instanceof Object) {
        return isEqual(this.proxyChecked, this.value)
      }
      return this.proxyChecked === this.value
    },

    proxyChecked: {
      get() {
        return this.checked
      },
      set(val) {
        this.$emit("change", val)
      }
    },
  },
  mounted() {
    if (this.isChecked) this.proxyChecked = this.value
  },
  methods: {
    mouseEnter(iconRef){ this.$refs[iconRef].hover = true },
    mouseLeave(iconRef){ this.$refs[iconRef].hover = false },

  }
}
</script>

<style lang="scss">
  .check-btn {
    // font-size: 12px;
    font-size: 1rem;
    color: var(--tc);
    cursor: pointer;
      // &:hover {color: var(--text-color-light);}
      &_content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-style: normal;
        font-weight: 500;
        // font-size: 20px;
        font-size: inherit;
        line-height: 100%;
        padding: 1.7em 1.3em;
        border: 1px solid var(--text-color-light);
        border-radius: 5px;
        transition: .3s;
        background-color: var(--bgc);
      }
      // &_icon {
      //   width: 1em;
      //   height: 1em;
      //   font-size: 1.6em;
      //   border: 0.28125em solid var(--text-color-light);
      //   border-radius: 50%;
      //   transition: .3s;
      //   margin-right: 0.8125em;
      // }
      &_icon {
        
      }
      &_text{
        flex-grow: 1;
        text-align: center;
      }
  }

  
  input[type=radio]:checked {
    & + .check-btn_content {
      border-color: var(--bgc-checked);
      box-shadow: inset 0 0 0px 3px var(--bgc-checked);
      // background-color: var(--bgc-checked);
      // color: var(--tc-checked)
      .check-btn_icon {border-color: var(--bgc-checked);}
     }
  }
</style>
