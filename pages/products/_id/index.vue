<template>
  <div>
    <h2>Single product, with ID: {{ $route.params.id }}</h2>
    <br/>
    <nuxt-link to="/products">Back to products</nuxt-link>
  </div>
</template>

<script>
export default {
  validate(data) {
    return /\d+$/.test(data.params.id)
  }
}
</script>
