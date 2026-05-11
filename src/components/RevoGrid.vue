<script setup>
import VGrid from '@revolist/vue3-datagrid'
import { ref } from 'vue'

const plantVigorAndLeaf = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'id', name: 'ID' },
  { prop: 'hrlandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'vigor', name: 'Vigor' },
  ],
  rows: [
  { date: 'May 11, 2026', id: 'B12', hrlandraces: 'Red Rice', province: 'Benguet', vigor: 3 }
  ]
}

const culm = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'id', name: 'ID' },
  { prop: 'hrlandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'culm_angle', name: 'Culm' },
  ],
  rows: [
  { date: 'May 8, 2026', id: 'C1', hrlandraces: 'Rice', province: 'Abra', culm_angle: 2 },
  { date: 'May 9, 2026', id: 'C2', hrlandraces: 'Black', province: 'Abra', culm_angle: 5 },
  ]
}

const columns = ref([...plantVigorAndLeaf.columns])
const rows = ref([...plantVigorAndLeaf.rows])
const selectedTable = ref('plantVigorAndLeaf')

const updateGrid = () => {
  const table = selectedTable.value === 'plantVigorAndLeaf' ? plantVigorAndLeaf : culm;
  columns.value = [...table.columns];
  rows.value = [...table.rows];
}
</script>

<template>
  <select v-model="selectedTable" @change="updateGrid">
    <option value="plantVigorAndLeaf">Plant Vigor And Leaf</option>
    <option value="culm">Culm</option>
  </select>

  <VGrid :columns="columns" :source="rows"/>
</template>
