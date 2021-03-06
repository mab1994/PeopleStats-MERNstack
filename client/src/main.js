import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

Vue.config.productionTip = false

import Home from './components/Home.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'register',
    path: '/sign-up',
    component: Register
  },
  {
    name: 'login',
    path: '/sign-in',
    component: Login
  }
]

const router = new VueRouter({ mode: 'history', routes: routes })

new Vue(Vue.util.extend({ router }, App)).$mount('#app')
