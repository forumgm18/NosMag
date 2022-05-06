<template lang="pug">
  .input-field-container(:class="{textarea: type==='textarea', 'is-error': $v.locValue.$error || setErrorStateFinal,'is-success': !$v.locValue.$error, focus: isFocus}")
    .input-field(
      :class="{textarea: type==='textarea', 'is-error': $v.locValue.$error || setErrorStateFinal,'is-success': !$v.locValue.$error && showSuccessText, focus: isFocus}")
      template(v-if="type==='textarea'")
        client-only
          perfect-scrollbar.input-field-textarea(ref="ps" v-once :options="scrollbarSettings")
            .input-field-textarea-container
              textarea(
                ref="textarea"
                v-model="$v.locValue.$model"
                v-mask="vMask"
                :type="type"
                :placeholder="placeholder"
                @focus="isFocus=true"
                @blur="isFocus=false"
                @keyup="calcHeight"
                v-on="inputListeners"
              )
      template(v-else)
        input(
          ref="input"
          v-auto-min-width="autoMinWidth"
          :size="autoMinWidth ? 0 : 20"
          v-model="$v.locValue.$model"
          v-mask="vMask"
          :type="type"
          :placeholder="placeholder"
          @focus="isFocus=true"
          @blur="isFocus=false"
          v-on="inputListeners"
          )
        .input-field-clear(v-if="hasClear" @click="clearInput")
          slot(name="field-clear") Удалить

    slot(name="error")
      .input-field-text.error(v-if="errorText.length" v-html="errorText") 
    slot(name="success")
      //- .input-field-text.success(v-if="showSuccessText && successText.length" v-html="successText") 
      .input-field-text.success(v-if="successText.length" v-html="successText") 


</template>

<script>

import { required, email, minValue, maxValue, minLength, maxLength } from 'vuelidate/lib/validators'
import { validatePhone } from '@/utils/main-scripts'
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    vMask: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    showError: {
      type: Boolean,
      default: true
    },
    errorText: {
      type: String,
      default: ''
    },
    successText: {
      type: String,
      default: ''
    },
    showSuccessText: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: false
    },
    setFocus: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    minLength: {
      type: Number,
      default: null
    },
    maxLength: {
      type: Number,
      default: null
    },
    minValue: {
      type: Number,
      default: null
    },
    maxValue: {
      type: Number,
      default: null
    },
    setErrorState: {
      type: Boolean,
      default: false
    },
    setErrorStateFinal: {
      type: Boolean,
      default: false
    },
    hasClear: {
      type: Boolean,
      default: false
    },
    autoMinWidth: {
      type: [Boolean,Number],
      default: false
    },
    scrollbarSettings: {
      type: Object,
      default() { 
        return {
          suppressScrollX: true,
          minScrollbarLength: 30,
        }
      }  
    }



  },
  data() {
    return {
      locValue: this.value,
      validationsObj: null,
      isFocus: false
    }
  },

  validations () {
    const vObj = {}
    if (this.required) vObj.required = required
    if (this.type === 'email') vObj.email = email
    if (this.type === 'text') {
      if (this.minLength) vObj.minLength = minLength(this.minLength)
      if (this.maxLength) vObj.maxLength = maxLength(this.maxLength)
    }
    if (this.type === 'number') {
      if (this.minValue) vObj.minValue = minValue(this.minValue)
      if (this.maxValue) vObj.maxValue = maxValue(this.maxValue)
    }
    if (this.type === 'tel') {
      vObj.validatePhone = validatePhone
    }
    // console.log('vObj: ', vObj)
    return { locValue: vObj }      
  },
  computed: {
      inputListeners: function () {
        var vm = this
        // `Object.assign` объединяет объекты вместе, чтобы получить новый объект
        return Object.assign({},
          // Мы добавляем все слушатели из родителя
          this.$listeners,
          // Затем мы можем добавить собственные слушатели или
          // перезаписать поведение некоторых существующих.
          {
            // Это обеспечит, что будет работать v-model на компоненте
            input: function (event) {
              vm.$emit('input', event.target.value)
            },
          }
        )
      },
      inputRefName() {return this.type === 'textarea' ? 'textarea' : 'input' }
  },  
  mounted() {
    // console.log('setFofus', this.setFocus)
    this.isFocus = !!this.setFocus
    this.$nextTick(() => {
      this.$forceUpdate()
      // Обновляем высоту textarea 
      if (this.type === 'textarea') this.calcHeight()
      
      // Устанавливаем фокус ввода если надо
      if (this.setFocus) {
        setTimeout(() => { // Это для того чтобы работал во всплывашках
          const inp = this.$refs[this.inputRefName]
          if (inp) inp.focus()
          })
      }
    })
    // this.locValue = this.value


  },

  watch: {
      locValue: function(val, oldVal) {
        this.$emit('input', val, oldVal)
        // this.$emit('update:is-error', this.$v.locValue.$error)
        this.$emit('update:isValid', !this.$v.locValue.$error)
        // debugger
      },
      value(val) { this.locValue = val},
      setErrorState(val){
        if (val) this.$v.$touch()
      },
    },
  methods: {
    clearInput() {
      this.locValue = ''
      this.$emit('clear-input')
    },
    calcHeight(){
      // console.log('calcHeight')
      // debugger
      let target = this.$refs.textarea
      if (target) {
        const minH = this.$refs.ps.$el.clientHeight
        const h = Math.max( target.scrollHeight, minH)
        target.style.height = null
        target.style.height = h  + 'px'
        this.$refs.ps.update()
      }
    }
  },
  beforeMount() {
    if(process.browser) {
      window.addEventListener('resize', this.calcHeight);
    }
  },
  beforeDestroy() {
    if(process.browser) {
      window.removeEventListener('resize', this.calcHeight);
    }
  },


  }
  
</script>

<style lang="scss" >
  @import 'input-field'
</style>