<template lang="pug">
  .preloader
    .loader
</template>
<script>
  export default {
    name: 'v-loading',
  }

</script>

<style lang="scss">
  .preloader {
    /*border: 1px solid red;*/
    font-size: 11px;
    height: 7em;
    width: 4em;
    &.center { margin: 0 auto;}
    /*&.static { margin: 0 auto;}*/
  }
  .loader,
  .loader:before,
  .loader:after {
    /*background: #65abf8;*/
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }
  .loader {
    color: var(--base-color2);
    background: var(--base-color2);
    text-indent: -9999em;
    /*margin: 88px auto;*/
    margin: 0 auto;
    position: relative;
    top: 65%;
    /*font-size: 11px;*/
    font-size: inherit;
    /*-webkit-transform: translateZ(0);*/
    /*-ms-transform: translateZ(0);*/
    /*transform: translateZ(0);*/
    transform: translateY(-50%);
    /*-webkit-animation-delay: -0.16s;*/
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    position: absolute;
    top: 0;
    content: '';
  }
  .loader:before {
    background: var(--base-color1);
    color: var(--base-color1);
    left: -1.5em;
    /*<!-- -webkit-animation-delay: -0.32s;-->*/
    animation-delay: -0.32s;
  }
  .loader:after {
    background: var(--base-color1);
    color: var(--base-color1);
    left: 1.5em;
  }
  @-webkit-keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
</style>
