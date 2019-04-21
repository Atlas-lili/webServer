<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@charset "utf-8";
@import '~css/default';
@media (min-width: 540px) {
  #app{
    margin: 0 auto;
  }
}
#app{
  width: 100vw;
  min-height: 100vh;
}
</style>
