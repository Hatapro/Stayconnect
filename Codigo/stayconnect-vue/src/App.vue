<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page" mode="out-in">
      <div class="page-wrapper" :key="route.fullPath">
        <div class="route-content">
          <component :is="Component" />
        </div>
      </div>
    </transition>
  </router-view>
</template>
