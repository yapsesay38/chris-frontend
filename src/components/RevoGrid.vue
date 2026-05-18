<template>
  <select v-model="selectedTable" @change="changeTable">
    <option value="vigorTable">Plant Vigor And Leaf</option>
    <option value="culmTable">Culm</option>
    <option value="panicleTable">Panicle</option>
    <option value="grainTable">Grain</option>
    <option value="growthTable">Growth</option>
  </select>

  <VGrid :columns="columns" :source="source" />
</template>

<script setup>
import VGrid from '@revolist/vue3-datagrid'
import { ref } from 'vue'

const vigorTable = {
  columns: [
  { prop: 'date', name: 'Date' },
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
  source: [
  ]
}

const culmTable = {
  columns: [
  { prop: 'date', name: 'Date' },
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
  { prop: 'culmNum', name: 'Number of Culms per Hill' },
  ],
  source: [
  ]
}

const panicleTable = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'hrLandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'panicleExsertion', name: 'Panicle Exsertion' },
  { prop: 'panicleAttAxis', name: 'Panicle Attitude of the Main Axis' },
  { prop: 'panicleAttBranch', name: 'Panicle Attitude of Branches' },
  { prop: 'panicleSecBranch', name: 'Panicle Secondary Branching' },
  { prop: 'panicleShat', name: 'Panicle Shattering' },
  { prop: 'panicleLen', name: 'Panicle Length' },
  { prop: 'panicleNum', name: 'Number of Filled and Unfilled Grains per Panicle' },
  ],
  source: [
  ]
}

const grainTable = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'hrLandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'awnColor', name: 'Awn Color' },
  { prop: 'awnDistribution', name: 'Awn Distribution' },
  { prop: 'apiculusColor', name: 'Apiculus Color' },
  { prop: 'apiculusAnth', name: 'Anthocyanin Coloration Below Apiculus' },
  { prop: 'lemmaColor', name: 'Lemma and Palea Color' },
  { prop: 'stigmaColor', name: 'Stigma Color' },
  { prop: 'awnLen', name: 'Awn Length' },
  { prop: 'grainLen', name: 'Grain Length' },
  { prop: 'grainWid', name: 'Grain Width' },
  { prop: 'grainWeight', name: '1000 Grain-weight' },
  { prop: 'lemmaPub', name: 'Lemma and Palea Pubescence' },
  { prop: 'yield', name: 'Yield per Plot (kg/5m^2)' },
  ],
  source: [
  ]
}

const growthTable = {
  columns: [
  { prop: 'date', name: 'Date' },
  { prop: 'hrLandraces', name: 'Heirloom Rice Landraces' },
  { prop: 'province', name: 'Province' },
  { prop: 'numTill', name: 'Number of Days from Transplanting to Tillering' },
  { prop: 'numBoot', name: 'Number of Days from Transplanting to Booting' },
  { prop: 'numHead', name: 'Number of Days from Transplanting to Heading' },
  { prop: 'numMat', name: 'Number of Days from Transplanting to Maturity' },
  { prop: 'height', name: 'Height at Maturity (cm)' },
  ],
  source: [
  ]
}
const columns = ref([...vigorTable.columns])
const source = ref([...vigorTable.source])
const selectedTable = ref('vigorTable')

const changeTable = () => {
  // const table = selectedTable.value === 'vigorTable' ? vigorTable : culmTable;
  let table;
  switch (selectedTable.value) {
    case 'vigorTable':
      table = vigorTable;
      break;
    case 'culmTable':
      table = culmTable;
      break;
    case 'panicleTable':
      table = panicleTable;
      break;
    case 'grainTable':
      table = grainTable;
      break;
    case 'growthTable':
      table = growthTable;
      break;
  
    default:
      table = vigorTable;
  }
  columns.value = [...table.columns.map(col => ({...col}))];
  source.value = [...table.source];
}
</script>

<style>
revo-grid {
  height: auto;
}
</style>
