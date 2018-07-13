import usb from '../../fetch/api'
import * as types from '../types'
import c from '../../js/common'

/**
 * App通用配置
 */


const state = {
  // rootPath:"https://183.131.15.28/?s=9|1&p=yhSystemTheme&k=1&v=1&returnType=jsonp",
  // rootPath: "http://winnow-ds.yanhuamedia.tv/?s=14|2&p=yhSystemTheme&k=1&v=1&returnType=jsonp",
  rootPath: "http://winnow-bds.yanhuamedia.tv/?s=14|2&p=yhSystemTheme&k=1&v=1&returnType=jsonp",
  catList:JSON.parse(localStorage.getItem('Home')) || {},
  category:JSON.parse(localStorage.getItem('Category')) || [],
  behindParams:"&returnType=jsonp",
  isHTTPS: localStorage.getItem('ISHTTPS')=="true" || false,
  openTime : undefined||0,
  startTime: undefined||0,
  httpRequestTime : 0,
  httpResponseTime : 0,
}
const getters = {
  rootPath: state => state.rootPath,
  catList:state => state.catList,
  category:state => state.category,
  behindParams:state=> state.behindParams,
  isHTTPS:state=> state.isHTTPS,
  openTime: state => state.openTime,
  startTime: state => state.startTime,
  httpRequestTime: state => state.httpRequestTime,
  httpResponseTime: state => state.httpResponseTime,
}

const actions = {
  getRootPath({commit},status){
    commit(types.GET_THEME,status)
  },
  getCatList({commit},status){
    commit(types.GET_PROGRAMA,status);
  },
  getCategory({commit},status){
    commit(types.GET_CATEGORY,status)
  },
  getIsHTTP({ commit }, status){
    commit(types.GET_ISHTTPS, status)
  },getOpenTime({ commit }, status){
    commit(types.GET_OPENTIME, status)
  },getStartTime({ commit }, status) {
    commit(types.GET_STARTTIME, status)
  }, getHttpRequestTime({ commit }, status) {
    commit(types.GET_HTTPREQUESTTIME, status)
  }, getHttpResponseTime({ commit }, status) {
    commit(types.GET_HTTPRESPONSETIME, status)
  }

}


const mutations = {
  [types.GET_THEME](state, status) {
    state.rootPath = status
  },
  [types.GET_PROGRAMA](state, status) {
    state.catList = status
  },
  [types.GET_CATEGORY](state, status){
    state.category = status
  },
  [types.GET_ISHTTPS](state, status) {
    state.isHTTPS = status
  },
  [types.GET_OPENTIME](state, status) {
    state.openTime = status
  },
  [types.GET_STARTTIME](state, status) {
    state.startTime = status
  },
  [types.GET_HTTPREQUESTTIME](state, status) {
    state.httpRequestTime = status
  },
  [types.GET_HTTPRESPONSETIME](state, status) {
    state.httpResponseTime = status
  }

}


export default {
  state,
  actions,
  getters,
  mutations
}
