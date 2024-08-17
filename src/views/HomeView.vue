<template>
  <div class="">
    <div class="row">
      <h2 class="display-2">Welcome to our store</h2>
    </div>
    <div class="row">
      <h4 class="display-4">Recent Products</h4>
    </div>
    <div class="row gap-4 justify-content-center" v-if="recentProducts">
      <CardComp v-for="product in recentProducts" :key="product.productID">
        <template #cardHeader>
          {{ product.productURL }}
          <img :src="product.productURL" alt="product-img" loading="lazy">
        </template>
        <template #cardBody>
          <h5 class="card-title">{{ product.prodName }}</h5>
          <p class="lead">{{ product.prodDescription }}</p>
          <p class="lead">Amount: R{{ product.amount }}</p>
        </template>
      </CardComp>
    </div>
    <div v-else>
      <SpinnerComp />
    </div>
  </div>
</template>

<script>
import CardComp from '@/components/Card.vue'
import SpinnerComp from '@/components/Spinner.vue';
export default { 
  name: "HomeView",
  components: {
    CardComp,
    SpinnerComp
  },
  computed: {
    recentProducts() {
      return this.$store.state.recentProducts;
    },
  },
  mounted() {
    this.$store.dispatch("recentProducts");
  },
};
</script>
