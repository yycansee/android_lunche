import Vue from 'vue'

import Router from 'vue-router'
// import Category from '../components/category.vue'
const Category = () => import(/* webpackChunkName: "category" */ '../components/category.vue')
// import Recommend from '../page/recommend.vue'
const Recommend = () => import(/* webpackChunkName: "category" */ '../page/recommend.vue')
// import HotTopics from '../page/hotTopics.vue'
const HotTopics = () => import('../page/hotTopics.vue')
// import Detail from '../page/detail/Category_Movie.vue'
const Detail = () => import('../page/detail/Category_Movie.vue')
// import NotFound from '../page/notFound.vue'
const NotFound = () => import('../page/notFound.vue')

import fjsonp from '../test/fetchjsonp.vue'

// import actor from '../page/detail/actor.vue'
const actor = () => import('../page/detail/actor.vue')

// import Historical from '../page/detail/Historical.vue'
const Historical = () => import ('../page/detail/Historical.vue')

const Hright = () => import ('../page/detail/History_right_collect.vue')

const Historytime = () => import ('../page/detail/Historytime.vue')

const History = () => import ('../page/detail/History')

const Search = () => import ('../page/search/Search.vue')

const HistoryFirm = () => import ('../page/detail/History_firm.vue')

const firm = () => import ('../page/firm.vue');
const Filter = () => import('../page/filter/FilterResult.vue');

const Player = () => import('../page/play/player.vue');

const playZx = () => import('../page/play/playZx.vue');


const trySee = () => import('../page/play/getplayurl.vue');

const tryViemPlay = () => import('../page/play/play.vue');


const des = () => import('../test/des.vue');


Vue.use(Router);

export default new Router({
  base:'/category/',
  mode:'history',
  routes: [
    { path: '/', redirect: '/jx/index'},
    { path: '/index', redirect: '/jx/index'},
    {
      path: '/jx', name: 'category', component: Category, props: true, meta: { keepAlive: true },
      children:[
        { path: 'index', name: 'index', component: Recommend, props: true, meta: { keepAlive: true }}
      ]
    },
    { path: '/hotTopics', name: 'hotTopics', component: HotTopics, props: true, meta: { keepAlive: false }},
    { path: '/detail', name: 'detail', component: Detail, props: true, meta:{keepAlive: false }},
    { path: '/actor', name: 'actor', component: actor, props: true, meta: { keepAlive: false }},
    { path: '/jsonp', name: 'jsonp', component: fjsonp, props: true},
    { path: '/Historical', name: 'Historical', component: Historical, props: true, meta: { keepAlive: false }},
    { path: '/search', name: 'search', component: Search, props: true, meta: { keepAlive: true }},
    // { path: '/Hright', name: 'Hright', component: Hright, props: true, meta: { keepAlive: false }},
    // { path: '/Historytime', name: 'Historytime', component: Historytime, props: true, meta: { keepAlive: false }},
    { path: '/History', name: 'History', component: History, props: true, meta: { keepAlive: false }},
    { path: '/firm', name: 'firm', component: firm, props: true, meta: { keepAlive: false }},
    { path: '/HistoryFirm', name: 'HistoryFirm', component: HistoryFirm, props: true, meta: { keepAlive: false }},
    { path: '/filter', name: 'filter', component: Filter, props: true, meta: { keepAlive: true } },
    { path: '/play',name:'play',component:Player,props:true,meta:{keepAlive:false}},
    { path: '/playZx',name:'playZx',component:playZx,props:true,meta:{keepAlive:false}},
    { path: '/tryView', name:'tryView',component:trySee,props:true,meta:{keepAlive:false}},
    { path: '/tryViemPlay', name: 'tryViemPlay', component: tryViemPlay, props: true, meta: { keepAlive: false } },
    { path: '/des', name: 'des', component: des, props: true, meta: { keepAlive: false } },
    { path: '*', name: 'all', component: NotFound, props: true,meta:{keepAlive: true }},

  ]
})
