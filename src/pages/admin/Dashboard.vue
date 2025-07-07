<template>
  <div class="admin-wrapper d-flex">
    <aside class="admin-sidebar shadow-sm">
      <SlideBar />
    </aside>
    <div class="admin-main flex-grow-1 d-flex flex-column">
      <AdminHeader />
      <main class="admin-content p-4 flex-grow-1 bg-light">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SlideBar from '../../views/admin/SlideBar.vue'
import AdminHeader from '../../views/admin/AdminHeader.vue'
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.admin-sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.admin-main {
  display: flex;
  flex-direction: column;
}

.admin-content {
  overflow-y: auto;
  min-height: calc(100vh - 64px); 
  border-radius: 8px;
}
</style>
