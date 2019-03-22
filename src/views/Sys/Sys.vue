<template>
<div class="sys">
    <sys-header></sys-header>
    <sys-list></sys-list>
    <section class="router-view">
        <router-view/>
    </section>
</div>
</template>

<script>
  import SysHeader from './components/SysHeader'
  import SysList from './components/SysList'
  export default {
    name: "Sys",
    data () {
      return {

      }
    },
    methods: {

    },
    components: {
      SysHeader,
      SysList
    }
  }
</script>

<style lang="scss" scoped>
</style>
