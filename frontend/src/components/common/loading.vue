<template lang="pug">
  .preloader
    .loader
</template>

<script>
export default {
  name: 'Loading',
}

</script>

<style lang="scss" scoped>
/*.preloader {*/
/*  position: fixed;*/
/*  top: 0;*/
/*  left: 0;*/
/*  !*width: 100%;*!*/
/*  !*height: 100%;*!*/
/*  font-size: 150px;*/
/*  height: 1em;*/
/*  width: 1em;*/
/*}*/
/*.loader {*/
/*  display: block;*/
/*  position: relative;*/
/*  left: 50%;*/
/*  top: 50%;*/
/*  width: 150px;*/
/*  height: 150px;*/
/*  margin: -75px 0 0 -75px;*/
/*  border-radius: 50%;*/
/*  border: 3px solid transparent;*/
/*  !*border-top-color: #9370DB;*!*/
/*  border-top-color: var(--base-color1);*/
/*  -webkit-animation: spin 2s linear infinite;*/
/*  animation: spin 2s linear infinite;*/
/*}*/
/*.loader:before {*/
/*  content: "";*/
/*  position: absolute;*/
/*  top: 5px;*/
/*  left: 5px;*/
/*  right: 5px;*/
/*  bottom: 5px;*/
/*  border-radius: 50%;*/
/*  border: 3px solid transparent;*/
/*  !*border-top-color: #BA55D3;*!*/
/*  border-top-color: var(--base-color2);*/
/*  -webkit-animation: spin 3s linear infinite;*/
/*  animation: spin 3s linear infinite;*/
/*}*/
/*.loader:after {*/
/*  content: "";*/
/*  position: absolute;*/
/*  top: 15px;*/
/*  left: 15px;*/
/*  right: 15px;*/
/*  bottom: 15px;*/
/*  border-radius: 50%;*/
/*  border: 3px solid transparent;*/
/*  !*border-top-color: #FF00FF;*!*/
/*  border-top-color: var(--sale);*/
/*  -webkit-animation: spin 1.5s linear infinite;*/
/*  animation: spin 1.5s linear infinite;*/
/*}*/
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  /*width: 100%;*/
  /*height: 100%;*/
  font-size: 150px;
  height: 1em;
  width: 1em;
  &.static{
    position: static;
    margin: 0 auto;
  }
}
.loader {
  /*display: block;*/
  position: relative;
  /*left: 50%;*/
  /*top: 50%;*/
  font-size: inherit;
  /*width: 150px;*/
  /*height: 150px;*/
  width: 1em;
  height: 1em;
  /*margin: -75px 0 0 -75px;*/
  /*margin: -.5em 0 0 -.5em;*/
  border-radius: 50%;
  border: 3px solid transparent;
  /*border-top-color: #9370DB;*/
  border-top-color: var(--base-color1);
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
.loader:before {
  content: "";
  position: absolute;
  /*top: .03584em;*/
  /*left: .03584em;*/
  top: 5px;
  left: 5px;

  /*right: 5px;*/
  /*bottom: 5px;*/

  font-size: .93em;
  width: 1em;
  height: 1em;


  border-radius: 50%;
  border: 3px solid transparent;
  /*border-top-color: #BA55D3;*/
  border-top-color: var(--base-color2);
  -webkit-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}
.loader:after {
  content: "";
  position: absolute;
  top: .125em;
  left: .125em;
  /*right: 15px;*/
  /*bottom: 15px;*/

  font-size: .8em;
  width: 1em;
  height: 1em;


  border-radius: 50%;
  border: 3px solid transparent;
  /*border-top-color: #FF00FF;*/
  border-top-color: var(--base-color3);
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}

@-webkit-keyframes spin {
  0%   {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spin {
  0%   {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>
