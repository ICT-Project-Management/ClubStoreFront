<template>
  <div>
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Header from '../../layouts/header/Header.vue'
import Footer from '../../layouts/footer/Footer.vue'
</script>
