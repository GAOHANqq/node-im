<template>



  <div class="main-view"></div>
</template>

<script lang="ts">
import {defineComponent, computed, reactive, ref, toRefs, inject, onMounted} from 'vue'
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";

export default defineComponent({
  name: 'chat-room'
  setup(props, ctx) {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({})


    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
