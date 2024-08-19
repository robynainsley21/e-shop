import { createStore } from "vuex";
import axios from "axios";
import router from "@/router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { applyToken } from "@/service/AuthenticateUser.js";
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
    async fetchUsers(context) {
      try {
        const { results, msg } = await (await axios.get(`${apiURL}user`)).data;
        if (results) {
          context.commit("setUsers", results);
        } else {
          toast.error(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async fetchUser(context, id) {
      try {
        const { result, msg } = await (
          await axios.get(`${apiURL}user/${id}`)
        ).data;
        if (result) {
          context.commit("setUser", result);
        } else {
          toast.error(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async updateUser(context, payload) {
      try {
        const { msg, err } = await (
          await axios.patch(`${apiURL}user/${payload.userID}`, payload)
        ).data;
        if (msg) {
          context.dispatch("fetchUsers");
        } else {
          toast.error(`${err}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async register(context, payload) {
      try {
        const { msg, err, token } = await (
          await axios.post(`${apiURL}user/register`, payload)
        ).data;
        if (token) {
          context.dispatch("fetchUsers");
          toast.success(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
          router.push({ name: "login" });
        } else {
          toast.error(`${err}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async deleteUser(context, id) {
      try {
        const { msg, err } = await (
          await axios.delete(`${apiURL}user/${id}`)
        ).data;
        if (msg) {
          context.dispatch("fetchUsers");
        } else {
          toast.error(`${err}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async login(context, payload) {
      try {
        const { msg, result, token } = await (
          await axios.post(`${apiURL}user/login`, payload)
        ).data;

        if (result) {
          toast.success(`${msg}😎`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
          context.commit("setUser", {
            msg,
            result,
          });
          cookies.set("LegitUser", { token, msg, result });
          applyToken(token);
          router.push({ name: "products" });
        } else {
          toast.error(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
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
        toast.error(`${error.message}`, {
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
        else {
          toast.error(`${msg}`, {
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (error) {
        toast.error(`${error.message}`, {
          autoClose: 3000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async addAProduct(context, payload) {
      try {
        const { msg } = await (
          await axios.post(`${apiURL}product/add`, payload)
        ).data;
        if (msg) {
          context.dispatch("fetchProducts");
          toast.success(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async updateProduct(context, payload) {
      try {
        const { msg } = await (
          await axios.patch(`${apiURL}product/${payload.productID}`, payload)
        ).data;
        if (msg) {
          context.dispatch("fetchProducts");
          toast.success(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
    async deleteProduct(context, id) {
      try {
        const { msg } = await (
          await axios.delete(`${apiURL}product/${id}`)
        ).data;
        if (msg) {
          context.dispatch("fetchProducts");
          toast.success(`${msg}`, {
            autoClose: 2000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      } catch (e) {
        toast.error(`${e.message}`, {
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    },
  },
  modules: {},
});
