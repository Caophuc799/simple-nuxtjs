<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'

export default {
  components: {
    AdminPostForm
  },
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  async asyncData(context) {
    try {
      const res = await context.app.$axios.get(`/posts/${context.params.postId}.json`)
      if (!res.data) {
        return context.error(new Error('Can not found'))
      }
      return {
        loadedPost: { ...res.data, id: context.params.postId }
      }
    } catch(e) {
      context.error(e)
    }
  },
  methods: {
    onSubmitted(editedPost) {
      this.$store.dispatch('editPost', editedPost)
      .then(() => {
         this.$router.push("/admin");
      })
    }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
