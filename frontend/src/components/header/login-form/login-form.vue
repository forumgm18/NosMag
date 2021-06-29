<template>
  <form class="login-form">
    <div class="form-item">
      <input
        type="text"
        name="username"
        placeholder="Ваше имя"
        required
      />
      <div class="form-item-error">
        Не верно заполнено поле
      </div>
    </div>
    <div class="form-item">
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        required
      />
      <div class="form-item-error">
        Не верно заполнено поле
      </div>
    </div>
    <button class="btn" type="submit">
      Войти
    </button>
  </form>
</template>

<script>
export default {
  name: 'LoginForm'
}
</script>

<style scoped>

</style>
