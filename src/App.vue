<template>
  <home-header></home-header>
  <router-view></router-view>
</template>


<script lang="ts">
import {defineComponent} from "vue";
import HomeHeader from "@/components/HomeHeader.vue";
export default defineComponent({
  components: {HomeHeader}
})
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
@import 'assets/iconfont/iconfont.css'
</style>
