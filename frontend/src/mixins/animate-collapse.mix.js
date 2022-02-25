export default {
  methods: {
    collpseEnter(el) {
      el.style.cssText = `--mh: ${el.scrollHeight}px`
    },
    // collpseLeave(el) {
    //   el.style.maxHeight = 'unset';
    // },
  }
}
