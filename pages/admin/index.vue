<template>
  <div class="admin-page">
    <section class="new-post">
      <AppButton @click="$router.push('/admin/new-post')">Create Post</AppButton>
    </section>
    <section class="existing-posts">
      <h1>Existing Posts</h1>
      <PostList isAdmin :posts="loadedPosts"/>
    </section>
  </div>
</template>

<script>
import PostList from '@/components/Posts/PostList'
import AppButton from '@/components/UI/AppButton'

export default {
  layout: 'admin',
  components: {
    PostList,
    AppButton
  },
  data() {
    return {
      loadedPosts: [
        {
          id:"1",
          thumbnail:"https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg",
          title:"Hello there - the first time!",
          previewText:"This my first post!",
        },
        {
          id:"2",
          thumbnail:"https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg",
          title:"Hello there - the second time!",
          previewText:"This my second post!",
        },
        {
          id:"3",
          thumbnail:"https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg",
          title:"Hello there - the third time!",
          previewText:"This my third post!",
        }
      ]
    }
  }
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>

