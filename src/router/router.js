import Vue from 'vue'
import VueRouter from 'vue-router'
import Calendar from '../components/Calendar'
import Task from '../components/Task'
import Login from '../components/Login'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Calendar, meta: { requiresAuth: true } },
    { path: '/tasks', component: Task, meta: { requiresAuth: true } },
    { path: '/login', component: Login }
]

const router = new VueRouter({
    routes
})

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(route => route.meta.requiresAuth)
    if (requiresAuth && !firebase.auth().currentUser) {
        next('/login')
    } else {
        next()
    }
})

export default router