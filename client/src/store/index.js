import Vue from 'vue'
import Vuex from 'vuex'
import { defaultClient as apolloClient } from '../main.js'
import {
  GET_POSTS,
  USER_SIGNIN,
  GET_CURRENT_USER,
  USER_SIGNUP,
  ADD_POST,
} from '../queries.js'
import router from '../router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
    currentUser: null,
    error: null,
    authError: null,
  },
  mutations: {
    SET_POSTS: (state, payload) => {
      state.posts = payload
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
    },
    SET_CURRENT_USER: (state, payload) => {
      state.currentUser = payload
    },
    SET_ERROR: (state, payload) => {
      state.error = payload
    },
    SET_AUTH_ERROR: (state, payload) => {
      state.authError = payload
    },
  },
  actions: {
    getPosts: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: GET_POSTS,
        })
        .then(({ data }) => {
          commit('SET_POSTS', data.getPosts)
          commit('SET_LOADING', false)
        })
        .catch((err) => {
          console.log(err)
          commit('SET_LOADING', false)
        })
    },
    addPost: ({ commit }, payload) => {
      commit('SET_LOADING', true)
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
        })
        .then(({ data }) => {
          console.log(data.addPost)
          commit('SET_LOADING', false)
        })
        .catch((err) => {
          console.log(err)
          commit('SET_LOADING', false)
        })
    },
    signinUser: ({ commit }, payload) => {
      // reset error
      commit('SET_ERROR', null)

      // reset token
      localStorage.setItem('token', '')

      // set loading when logingin
      // commit('SET_LOADING', true)

      apolloClient
        .mutate({
          mutation: USER_SIGNIN,
          variables: payload,
        })
        .then(async ({ data }) => {
          localStorage.setItem('token', data.signinUser.token)
          // commit('SET_LOADING', false)
          await router.go()
          console.log(data.signinUser)
        })
        .catch((err) => {
          // commit('SET_LOADING', false)
          commit('SET_ERROR', err)
          console.log(err)
        })
    },
    signupUser: ({ commit }, payload) => {
      // reset error
      commit('SET_ERROR', null)

      // reset token
      localStorage.setItem('token', '')

      // set loading when signing up
      commit('SET_LOADING', true)

      apolloClient
        .mutate({
          mutation: USER_SIGNUP,
          variables: payload,
        })
        .then(async ({ data }) => {
          localStorage.setItem('token', data.signupUser.token)
          commit('SET_LOADING', false)
          await router.go()
          console.log(data.signupUser)
        })
        .catch((err) => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
          console.log(err)
        })
    },
    getCurrentUser: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: GET_CURRENT_USER,
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          commit('SET_CURRENT_USER', data.getCurrentUser)
          console.log(data.getCurrentUser)
        })
        .catch((err) => {
          commit('SET_LOADING', false)
          console.log(err)
        })
    },
    signoutUser: async ({ commit }) => {
      commit('SET_CURRENT_USER', null)
      localStorage.setItem('token', '')
      // end apollo session
      await apolloClient.resetStore()

      router.push('/signin')
    },
  },
  modules: {},
  getters: {
    posts: (state) => state.posts,
    loading: (state) => state.loading,
    currentUser: (state) => state.currentUser,
    error: (state) => state.error,
    authError: (state) => state.authError,
  },
})
