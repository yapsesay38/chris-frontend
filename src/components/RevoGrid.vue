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
  { prop: 'hrLandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'vigor', name: 'Plant Vigor' },
  { prop: 'sheathColor', name: 'Basal Leaf Sheath Color' },
  { prop: 'sheathAnth', name: 'Leaf Sheath Anthocyanin Coloration' },
  { prop: 'bladeAnth', name: 'Blade Anthocyanin Coloration' },
  { prop: 'bladeDist', name: 'Blade Distribution of Anthocyanin Coloration' },
  { prop: 'bladeInt', name: 'Blade Intensity of Green Color' },
  { prop: 'bladePub', name: 'Blade Pubescence' },
  { prop: 'aurColor', name: 'Auricle Color' },
  { prop: 'collarColor', name: 'Collar Color' },
  { prop: 'liguleShape', name: 'Ligule Shape' },
  { prop: 'liguleColor', name: 'Ligule Color' },
  { prop: 'liguleLen', name: 'Ligule Length' },
  { prop: 'flagLeafAtt', name: 'Flag Leaf Attitude' },
  { prop: 'flagLeafPenLen', name: 'Flag Leaf and Penultimate Leaf Length' },
  { prop: 'flagLeafPenWid', name: 'Flag Leaf and Penultimate Leaf Width' }
  ],
  rows: [
  { date: 'May 11, 2026', id: 'B12', hrLandraces: 'Red Rice', province: 'Abra', vigor: 3 }
  ]
}

const culmTable = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'id', name: 'ID' },
  { prop: 'hrLandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'culmAngle', name: 'Culm Habit Angle' },
  { prop: 'nodeColor', name: 'Node Anthocyanin Coloration' },
  { prop: 'unNodeColor', name: 'Underlying Node Color' },
  { prop: 'intNodeColor', name: 'Internode Anthocyanin Coloration' },
  { prop: 'unIntNodeColor', name: 'Underlying Internode Color' },
  { prop: 'culmRes', name: 'Culm Lodging Resistance' },
  { prop: 'culmLen', name: 'Culm Length' },
  { prop: 'culmDia', name: 'Culm Diameter' },
  { prop: 'culmHill', name: 'Number of Culms per Hill' },
  ],
  rows: [
  { date: 'May 8, 2026', id: 'C1', hrLandraces: 'Rice', province: 'Abra', culmAngle: 2 },
  { date: 'May 9, 2026', id: 'C2', hrLandraces: 'Black', province: 'Abra', culmAngle: 5 },
  ]
}

const columns = ref([...vigorTable.columns])
const rows = ref([...vigorTable.rows])
const selectedTable = ref('vigorTable')

const changeTable = () => {
  // const table = selectedTable.value === 'vigorTable' ? vigorTable : culmTable;
  let table;
  if (selectedTable.value === 'vigorTable') {
  table = vigorTable;
  } else if (selectedTable.value === 'culmTable') {
  table = culmTable;
  }
  columns.value = [...table.columns];
  rows.value = [...table.rows];
}
</script>

<style>
revo-grid {
  height: auto;
}
</style>
