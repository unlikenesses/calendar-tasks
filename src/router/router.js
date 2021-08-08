import Vue from 'vue'
import VueRouter from 'vue-router'
import Calendar from '../components/Calendar'
import Task from '../components/Task'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Calendar },
    { path: '/tasks', component: Task },
  ]

const router = new VueRouter({
    routes
})

export default router