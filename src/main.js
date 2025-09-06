import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import { createHead } from '@vueuse/head'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
const head = createHead()

app.use(Antd)
app.use(head)
app.mount('#app')