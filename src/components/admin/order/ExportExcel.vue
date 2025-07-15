<template>
  <div class="card shadow-sm p-4 mx-auto" style="max-width: 400px;">
    <h5 class="card-title mb-3 text-center">Xuất Excel theo tháng</h5>

    <div class="mb-3">
      <label for="monthSelect" class="form-label">Chọn tháng:</label>
      <input
        id="monthSelect"
        type="month"
        v-model="selectedMonth"
        class="form-control"
      />
    </div>

    <button
      @click="handleExport"
      class="btn btn-outline-success w-100"
    >
      ⬇️ Tải Excel
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { downloadMonthlyOrderExcel } from '../../../services/admin/orderAdminService'
import { useToast } from 'vue-toastification'
const toast = useToast();
const currentMonth = new Date().toISOString().slice(0, 7)
const selectedMonth = ref(currentMonth)

const handleExport = async () => {
  try {
    await downloadMonthlyOrderExcel(selectedMonth.value)
  } catch (err) {
    console.error(err)
    toast.warning("Can not download excel file !!!!")
  }
}
</script>
