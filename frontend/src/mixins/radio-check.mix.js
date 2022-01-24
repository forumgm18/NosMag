export default {
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    value: { },
    checked: {
      type: [Boolean, Array, Object],
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
  },
  data() {
    return {
    }
  },
  computed: {
    proxyChecked: {
      get() { return this.checked },
      set(val) { this.$emit("change", val) }
    },
  },
  mounted() {
    if (this.isChecked) this.proxyChecked = this.value
  },
}
