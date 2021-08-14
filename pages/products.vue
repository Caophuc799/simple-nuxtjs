<template>
  <div>
    <input  v-model="productId" type="text">
    <button @click="onLoadProduct">Load Product</button>
    <nuxt-child />
  </div>
</template>


<script>
export default {
  data() {
    return {
      productId: ''
    }
  },
  methods: {
    onLoadProduct() {
      this.$router.push('/products/' + this.productId)
    }
  },
  layout: 'products'
}
</script>

<style scoped>

</style>
