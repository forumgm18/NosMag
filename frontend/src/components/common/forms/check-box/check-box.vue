<template lang="pug">
.checkbox
  label.checkbox-label
    //- input(ref="chbx" hidden type="checkbox" :checked="isChecked" :value="value" @change="updateInput")
    input(ref="chbx" hidden type="checkbox"  :value="value" v-model="proxyChecked")
    span.checkbox_text-block
      span.checkbox_icon
      span.checkbox_text
        slot
</template>

<script>
export default {
  name: 'check-box',
  // model: {
  //   prop: 'modelValue',
  //   event: 'change'
  // },
  model: {
  	prop: "checked",
    event: "change"
  },

  props: {
    // value: { type: String },
    //  value: {default: null},
     value: {},

    // modelValue: { default: '' },
    // label: { type: String, required: true},
    // trueValue: { default: true },
    // falseValue: { default: false },
    checked: {
      type: [Boolean, Array],
      default: false
    }
  },
  // create(){
  //   // debugger
  //   if (this.checked) {
  //     this.$refs.chbx.checked = this.checked
  //   }

  // },
  // mounted(){
  //   // debugger
  //   if (this.checked) {
  //     this.$nextTick(function () {
  //       this.updateHandler(this.checked)
  //     })      
  //   }

  // },

  computed: {
    // isChecked() {
    //   if (this.modelValue instanceof Array) {
    //     return this.modelValue.includes(this.value)
    //   }
    //   // Note that `true-value` and `false-value` are camelCase in the JS
    //   return this.modelValue === this.trueValue
    // },
    proxyChecked: {
      get() {
		    return this.checked;
		    // return this.value;
      },
      set(val) {
		    this.$emit("change", val);
      }
    }
  },
  // methods: {
  //   updateInput(event) {
  //     let isChecked = event.target.checked
  //     this.updateHandler(isChecked)
  //   },
  //   updateHandler(isChecked) {
  //     if (this.modelValue instanceof Array) {
  //       let newValue = [...this.modelValue]
  //       if (isChecked) {
  //         newValue.push(this.value)
  //       } else {
  //         newValue.splice(newValue.indexOf(this.value), 1)
  //       }
  //       this.$emit('change', newValue)
  //     } else {
  //       this.$emit('change', isChecked ? this.trueValue : this.falseValue)
  //     }
  //   }
  // }
}
</script>

<style lang="scss">
@import 'check-box';
</style>
