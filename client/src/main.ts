import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

store.dispatch('app/GET_THEME')
createApp(App).use(router).use(store).use(ElementPlus,{locale: zhCn}).mount('#app')
