import Vue from 'vue'
import VueRouter from 'vue-router'
import { baseApiUrl, userKey } from '@/global'
import axios from 'axios'

import Auth from '../components/auth/Auth'
import Home from '../components/pages/home/Home'
import AdminPages from '../components/admin/AdminPages'
import TopArtists from '../components/pages/TopArtists'
import User from '../components/pages/User'
import Track from '../components/pages/Track'
import Lyric from '../components/pages/lyric/Lyric'
import Artist from '../components/pages/Artist'
import Album from '../components/pages/Album'
import Search from '../components/pages/home/Search'


Vue.use(VueRouter)

const routes = [{
    name: 'auth',
    path: '/auth',
    component: Auth,
    beforeEnter: (to, from, next) => {
        const json = localStorage.getItem(userKey)
        const user = JSON.parse(json)
        user ? next({ path: '/' }) : next()
    }

},{
    name: 'home',
    path: '/',
    component: Home
}, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
    meta: { requiresAdmin: true }
}, {
    name: 'user',
    path: '/user/:id',
    component: User
}, {
    name: 'search',
    path: '/search/:track',
    component: Search
}, {
    name: 'topArtists',
    path: '/topartists',
    component: TopArtists
}, {
    name: 'track',
    path: '/track/:id',
    component: Track
}, {
    name: 'lyric',
    path: '/track/:trackId/:lyricId',
    component: Lyric
}, {
    name:'artist',
    path: '/artist/:id',
    component: Artist
}, {
    name: 'album',
    path: '/album/:id',
    component: Album
}]

const router = new VueRouter({
    //mode: 'history',
    routes
})

router.beforeEach(async (to, from, next) => {
    const json = localStorage.getItem(userKey)

    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        await axios.post(`${baseApiUrl}/validateAdmin`, user)
            .then(res => {
                res.data ? next() : next({ path: '/' })
            })
    } else {
        next()
    }
})

export default router