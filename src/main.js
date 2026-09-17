import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './styles.css'

const Home = { template: '<div></div>' }
const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Home },
  { path: '/solutions', component: Home },
  { path: '/news', component: Home },
  { path: '/about', component: Home },
  { path: '/contact', component: Home },
  { path: '/support', component: Home },
  { path: '/product/:id', component: Home },
  { path: '/solution/:id', component: Home },
  { path: '/news/:id', component: Home }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0, behavior: 'smooth' } }
})

createApp(App).use(router).mount('#app')
