<template>
  <nav v-if="lastPage > 1" class="mt-4">
    <ul class="pagination justify-content-center gap-1">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          class="page-link text-sky-700"
          @click="$emit('change-page', currentPage - 1)"
          :disabled="currentPage === 1"
        >
          «
        </button>
      </li>

      <li
        class="page-item"
        v-for="page in pageNumbers"
        :key="page"
        :class="{ active: page === currentPage }"
      >
        <button
          class="page-link"
          :class="page === currentPage ? 'bg-sky-500 text-white border-sky-500' : 'text-sky-700'"
          @click="$emit('change-page', page)"
        >
          {{ page }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === lastPage }">
        <button
          class="page-link text-sky-700"
          @click="$emit('change-page', currentPage + 1)"
          :disabled="currentPage === lastPage"
        >
          »
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  currentPage: number
  lastPage: number
}>()

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= props.lastPage; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<style scoped>
.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}
.page-link {
  border-radius: 6px;
  transition: all 0.2s;
}
.page-link:hover {
  background-color: #e0f2fe; 
}
</style>
