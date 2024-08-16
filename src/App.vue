<template>
  <div class="wrapper">
    <NavComp />
    <main>
      <router-view />
    </main>
    <FooterComp />
  </div>

</template>

<script>
import NavComp from "@/components/Navbar.vue";
import FooterComp from "@/components/Footer.vue";

export default {
  components: {
    NavComp,
    FooterComp
  },
};
</script>

<style src="@/assets/css/styles.css"></style>
