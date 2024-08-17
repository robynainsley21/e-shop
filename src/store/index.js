import { createStore } from "vuex";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// import { applyToken } from "@/service/AuthenticateUser.js";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const apiURL = "https://e-shop-yox8.onrender.com/";

export default createStore({
  state: {
    users: null,
    user: null,
    products: null,
    product: null,
    recentProducts: null,
  },
  getters: {},
  /**updating the state */
  mutations: {
    setUsers(state, value) {
      state.users = value;
    },
    setUser(state, value) {
      state.user = value;
    },
    setProducts(state, value) {
      state.products = value;
    },
    setProduct(state, value) {
      state.product = value;
    },
    setRecentProducts(state, value) {
      state.recentProducts = value;
    },
  },
  actions: {
    async recentProducts(context) {
      try {
        const { results, message } = await (
          await axios.get(`${apiURL}products/recent`)
        ).data;
        if (results) {
          context.commit("setRecentProducts", results);
          cookies.set("recentProducts", results);
        } else {
          toast.error(`${message}`, {
            autoClose: 3000,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 3000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchProducts(context) {
      try {
        const { results, message } = await await axios.get(`${apiURL}products`)
          .data;
        if (results) {
          context.commit("setProducts", results);
        } else {
          toast.error(`${message}`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${e.message}`, {
          autoClose: 3000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchProduct(context, id) {
      try {
        const { result, msg } = await (
          await axios.get(`${apiURL}product/${id}`)
        ).data;
        if (result) context.commit("setProduct", result);
        else{
          toast.error(`${msg}`, {
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_CENTER,
          });}
      } catch (error) {
        toast.error(`${e.message}`, {
          autoClose: 3000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } 
    },
  },
  modules: {},
});
