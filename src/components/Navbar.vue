<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid p-3">
      <a class="navbar-brand" href="#landing">
        <img
          src="https://robynainsley21.github.io/images/images/Portfolio logo (1).png"
          alt="logo"
          loading="lazy"
        />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <router-link class="navbar-brand" to="/public/index.html">
            <img
              src="https://robynainsley21.github.io/images/images/Portfolio logo (1).png"
              alt="logo"
              loading="lazy"
            />
          </router-link>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav fw-bolder ms-auto">
            <li class="nav-item">
              <router-link
                class="nav-link font-weight-bold"
                aria-current="page"
                to="/"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-lnk class="nav-link" aria-current="page" to="/about"
                >About</router-lnk
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/products"
                >Products</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/checkout"
                >Checkout</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin">Admin</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/reachUs">Reach us</router-link>
            </li>
            <ul class="userAccount navbar-nav">
              <li class="nav-item">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/logout">Logout</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/signup"
                  >Register</router-link
                >
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavComp",
};
</script>

<style scoped>
img[alt="logo"] {
  width: 5rem;
}
</style>
