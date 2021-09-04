import { Store } from "vuex";
import Cookies from "js-cookie";

const createStore = () => {
  return new Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token
      },
      clearToken(state) {
        state.token = null
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios.get(`/posts.json`)
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
        return this.$axios.post(`/posts.json?auth=${vuexContext.state.token}`, createdPost)
        .then(result => {
          vuexContext.commit('addPost', { ...createdPost, id: result.data.name })
        })
        // eslint-disable-next-line no-console
        .catch(e=> console.error(e))
      },
      editPost(vuexContext, editedPost) {
        return this.$axios.put(`/posts/${editedPost.id}.json?auth=${vuexContext.state.token}`,
        editedPost)
        .then(res => {
          vuexContext.commit('editPost', editedPost)
        })
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      },
      authenticateUser(vuexContext, authData) {
        let authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.VUE_APP_FIREBASE_API_KEY}`
        if (authData.isLogin) {
          authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.VUE_APP_FIREBASE_API_KEY}`
        }
        return this.$axios.post(authURL,{
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(result => {
            vuexContext.commit("setToken", result.data.idToken)
            localStorage.setItem('token', result.data.idToken)
            localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(result.data.expiresIn) * 1000)
            Cookies.set('jwt', result.data.idToken);
            Cookies.set('expirationDate', new Date().getTime() + Number.parseInt(result.data.expiresIn) * 1000);
          })
          .catch(e => console.log(e))
      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate='))?.split('=')[1]
        } else {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration')
        }
        if (new Date().getTime() > expirationDate || !token) {
          vuexContext.dispatch('logout')
        }
        vuexContext.commit('setToken', token)
      },
      logout(vuexContext) {
        vuexContext.commit('clearToken');
        Cookies.remove('token');
        Cookies.remove('expirationDate')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
        }
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token !== null
      }
    }
  });
};

export default createStore;
