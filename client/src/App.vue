<template>
  <div id="app">
    <Header />
    <router-view :key="this.$route.fullPath" />
  </div>
</template>

<script>
import  Header from '@/components/layout/Header.vue'

export default {
  name: "app",
  components: {
    Header
  }
}
</script>


<style lang="scss" src="./scss/main.scss"></style>
