// import Vue from 'vue'
// import { createStore }  from 'vuex'
// import VueRouter from 'vue-router'
// import Vuex from 'vuex'

// const store = createStore({
//   state:{
//     appName: "Vue3 Vuex"
//   },

//   getters:{
//     appName (state) {
//       return state.appName
//     }
//   }
// })
// export default store 

// store.js
// store/index.js
// store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  // ... your other Vuex configurations ...
  actions: {
    async  signUpAction({ commit }, userData) {
      try {
        const response = await axios.post('http://192.168.11.213:3000/users/createuser', userData);
        // Commit any mutations based on the sign-up response if needed
      } catch (error) {
        console.error("Error during sign-up:", error);
        // Handle error, maybe commit a mutation to set an error state
      }
    },
    
    async signInAction({ commit }, userData) {
      try {
        const response = await axios.post('http://192.168.11.213:3000/users/login', userData);
        // Commit any mutations based on the sign-in response if needed
      } catch (error) {
        console.error("Error during sign-in:", error);
        // Handle error, maybe commit a mutation to set an error state
      }
    }
  }
});



