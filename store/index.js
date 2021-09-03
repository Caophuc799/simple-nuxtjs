import Vuex from "vuex";
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
        state.loadedPosts[postIndex] = editedPost
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios.get(`${process.env.VUE_APP_API_URL}/posts.json`)
        .then(({data}) => {
          const postsArray = [];
          for (const key in data) {
            postsArray.push({ ...data[key], id: key })
          }
          vuexContext.commit('setPosts', postsArray)
        })

      },
      addPost(vuexContext, post) {
        const createdPost = { ...post, updatedDate: new Date() }
        return axios.post(`${process.env.VUE_APP_API_URL}/posts.json`, createdPost)
        .then(result => {
          vuexContext.commit('addPost', { ...createdPost, id: result.data.name })
        })
        .catch(e=> console.error(e))
      },
      editPost(vuexContext, editedPost) {
        return axios.put(`${process.env.VUE_APP_API_URL}/posts/${editedPost.id}.json`,
        editedPost)
        .then(res => {
          vuexContext.commit('editPost', editedPost)
        })
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
    }
  });
};

export default createStore;
