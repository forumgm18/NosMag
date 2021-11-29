<template lang="pug">
  div.header-login(@click="loginPopupShow(true)")
    div.header-login-btn
      svg.icon.icon-user <use href="#icon-user"/>
      span {{title}}

    v-app-popup.login(
      v-model="isLoginPopupShow"
      v-on:close-popup="loginPopupShow($event)"
      )
      .login-form-title 
        span.text(
          :class="{active: isLogin}"
          @click="loginType(true)"
        ) {{$options.LOGIN_TEXT}}
        span /
        span.text(
          :class="{active: !isLogin}"
          @click="loginType(false)"
        ) {{$options.REGISTER_TEXT}}


      .login-description(
        v-if="!isLogin"
        v-html="$options.REGISTER_DESCRIPTION"
      ) 
      .login-toggle
        .login-toggle-text(
          :class="{active: !loginWithPhone}"
          @click="loginTypeToggle(false)"
        ) {{$options.LOGIN_WITH_EMAIL_TEXT}}
        v-check-toggle(
          v-model="loginWithPhone"
          off-color="var(--base-color1)"
          on-color="var(--base-color1)"
          ) 
        .login-toggle-text(
          :class="{active: loginWithPhone}"
          @click="loginTypeToggle(true)"
        ) {{$options.LOGIN_WITH_PHONE_TEXT}}

      .login-form
        v-input-field(
          v-if="loginWithPhone"
          :v-mask="'+7 ### ### ## ##'" 
          v-model="login"
          type="tel"
          placeholder="+7 000 000 00 00"
          :error-text="$options.LOGIN_ERROR_PHONE_TEXT"
          :is-error="loginError"
          required
          )
        v-input-field(
          v-else="condition"
          v-model="login"
          type="email"
          placeholder="name@mail.ru"
          :error-text="$options.LOGIN_ERROR_EMAIL_TEXT"
          :is-error="loginError"
          required
          )
        
        .login-form-label(v-if="isLogin") {{$options.PASSWORD_TEXT}}
        .login-form-label(v-else="condition") {{$options.REGISTER_PASSWORD_LABEL}}
        v-input-field(
          type="password"
          v-model="password"
          placeholder="........"
          :error-text="$options.PASSWORD_ERROR_TEXT"
          :is-error="passwordError"
          required
          )
      
        .login-form_fogot-password(v-if="isLogin") {{$options.FOGOT_PASSWORD_TEXT}}  
        button.btn(
          :class="{'btn-2': !isLogin}"
          @click="loginRegClick"
        ) {{`${isLogin ? $options.LOGIN_BTN_TEXT : $options.REGISTER_TEXT}`}}

    v-app-popup.login(
      v-model="isConfirmRegisterPopupShow"
      v-on:close-popup="loginRegClick($event)"
    )
      .login-form-title 
        span.text.active {{$options.REGISTER_TEXT}}
      .login-description {{$options.REGISTER_CONFIRM_TEXT}}
      .login-form
        v-input-field(
          v-model="confirmCode"
          type="text"
          :placeholder="$options.REGISTER_CONFIRM_CODE"
          :error-text="$options.REGISTER_CONFIRM_CODE_ERROR"
          :is-error="confirmCodeError"
          required
          )
        button.btn.btn-3 {{$options.REGISTER_CONFIRM_CODE_BTN}}


</template>

<script>
export default {
  name: 'LoginForm',
  props: {
    title: {type: String}
  },
  
  FOGOT_PASSWORD_TEXT: 'Забыли пароль?',
  PASSWORD_TEXT: 'Пароль',
  // PASSWORD_ERROR_TEXT: 'Пароль должен быть длиной не менее 6 символов',
  PASSWORD_ERROR_TEXT: 'Длина пароля не менее 6 символов',
  LOGIN_WITH_PHONE_TEXT: 'Ваш номер телефона',
  LOGIN_WITH_EMAIL_TEXT: 'Электронная почта',
  LOGIN_BTN_TEXT: 'Войти',
  LOGIN_TEXT: 'вход',
  LOGIN_ERROR_PHONE_TEXT: 'Введите телефон полностью',
  LOGIN_ERROR_EMAIL_TEXT: 'Введите e-mail правильно',
  REGISTER_TEXT: 'Регистрация',
  REGISTER_DESCRIPTION: 'Введите эмейл или телефон, к чему<br>у вас есть доступ в данный момент',
  REGISTER_PASSWORD_LABEL: 'Придумайте пароль минимум из 6 символов',
  REGISTER_CONFIRM_TEXT: 'Вам выслан код подтверждения, введите его в окно ниже',
  REGISTER_CONFIRM_CODE: 'код подтверждения',
  REGISTER_CONFIRM_CODE_ERROR: 'Код подтверждения введен не верно',
  REGISTER_CONFIRM_CODE_BTN: 'Подтвердить вход',
  data() {
    return {
      isLoginPopupShow: false,
      isConfirmRegisterPopupShow: false,
      isLogin: true,
      loginWithPhone: false,
      login: '',
      password: '',
      confirmCode: '',

    }
  },
  methods: {
    loginPopupShow(v) {this.isLoginPopupShow = v },
    loginType(v) {this.isLogin = v},
    loginTypeToggle(v) {this.loginWithPhone = v},
    loginRegClick(v) {
      this.isLoginPopupShow = false
      this.isConfirmRegisterPopupShow = v
    }
  },
  computed: {
    loginError() {
      return false
    },
    passwordError() {
      // return true
      return false
    },
    confirmCodeError() {
      return true
      // return false
    },
  },
}
</script>

<style lang="scss" >
  @import 'login-form';
</style>
