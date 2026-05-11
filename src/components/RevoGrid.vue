<template>
  <select v-model="selectedTable" @change="changeTable">
    <option value="vigorTable">Plant Vigor And Leaf</option>
    <option value="culmTable">Culm</option>
  </select>

  <VGrid :columns="columns" :source="rows" />
</template>

<script setup>
import VGrid from '@revolist/vue3-datagrid'
import { ref } from 'vue'

const vigorTable = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'id', name: 'ID' },
  { prop: 'hrlandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'vigor', name: 'Vigor' },
  ],
  rows: [
  { date: 'May 11, 2026', id: 'B12', hrlandraces: 'Red Rice', province: 'Abra', vigor: 3 }
  ]
}

const culmTable = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'id', name: 'ID' },
  { prop: 'hrlandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'culm_angle', name: 'Culm' },
  { prop: 'node', name: 'Node' },
  ],
  rows: [
  { date: 'May 8, 2026', id: 'C1', hrlandraces: 'Rice', province: 'Abra', culm_angle: 2 },
  { date: 'May 9, 2026', id: 'C2', hrlandraces: 'Black', province: 'Abra', culm_angle: 5 },
  ]
}

const columns = ref([...vigorTable.columns])
const rows = ref([...vigorTable.rows])
const selectedTable = ref('vigorTable')

const changeTable = () => {
  const table = selectedTable.value === 'vigorTable' ? vigorTable : culmTable;
  columns.value = [...table.columns];
  rows.value = [...table.rows];
}
</script>

<style>
revo-grid {
  height: 500px;
}
</style>
