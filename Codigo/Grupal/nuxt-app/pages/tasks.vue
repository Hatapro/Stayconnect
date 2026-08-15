<template>
  <NuxtPage />
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
/* Parent wrapper for nested routes under /tasks */
</style>
