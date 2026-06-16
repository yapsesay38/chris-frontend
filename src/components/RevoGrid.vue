<template>
  <div class="grid-container">

    <div class="controls">
      <div class="table-selector">
        <button
          v-for="table in tables"
          :key="table.id"
          @click="selectTable(table.id)"
          :class="{ active: selectedTable === table.id }"
          class="table-btn"
        >
          {{ table.emoji }} {{ table.name }}
        </button>
      </div>
      
      <div class="status-bar">
        <span v-if="loading" class="status loading">
          <span class="spinner-small"></span> Loading...
        </span>
        <span v-else-if="error" class="status error">
          ❌ {{ error }}
        </span>
        <span v-else class="status success">
          ✅ {{ filteredData.length }} records for {{ province }}
        </span>
        <button @click="refreshData" :disabled="loading" class="refresh-btn">
          ⟳ Refresh
        </button>
      </div>
    </div>
    
    <VGrid 
      ref="gridRef"
      :columns="columnsWithFilters" 
      :source="filteredData"
      :filter="true"
      :sorting="true"
      :pagination="true"
      :page-size="50"
      :page-sizes="[25, 50, 100, 250]"
      :readonly="true"
      class="revo-grid"
    />
  </div>
</template>

<script setup>
import VGrid from '@revolist/vue3-datagrid'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  locationParam: {
    type: String,
    required: true,
    default: ''
  }
})

const filteredData = ref([])
let allData = []

const locationToProvince = {
  'abra': 'Abra',
  'apayao': 'Apayao',
  'benguet': 'Benguet',
  'ifugao': 'Ifugao',
  'kalinga': 'Kalinga',
  'mountain-province': 'Mountain Province',
}

const getProvinceFromLocation = () => {
  const location = props.locationParam
  const province = locationToProvince[location] || ''
  return province
}

const tables = [
  { id: 'plantvigorandleaf', name: 'Plant Vigor & Leaf', emoji: '🍃' },
  { id: 'culm', name: 'Culm Characters', emoji: '🌿' },
  { id: 'panicle', name: 'Panicle Characters', emoji: '🌾' },
  { id: 'grain', name: 'Grain Characters', emoji: '🍚' },
  { id: 'growth', name: 'Growth Cycle', emoji: '🌱' }
]

const columnDefinitions = {
  plantvigorandleaf: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 'auto' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 'auto' },
    { prop: 'trialNumber', name: 'Trial', size: 'auto' },
    { prop: 'plantVigor', name: 'Plant Vigor', size: 'auto' },
    { prop: 'basalLeafSheathColor', name: 'Basal Leaf Sheath Color', size: 'auto' },
    { prop: 'leafSheathAnthocyaninColoration', name: 'Leaf Sheath Anthocyanin', size: 'auto' },
    { prop: 'bladeAnthocyaninColoration', name: 'Blade Anthocyanin', size: 'auto' },
    { prop: 'bladeDistAnthocyaninColoration', name: 'Blade Distribution', size: 'auto' },
    { prop: 'bladeIntensityGreen', name: 'Blade Green Intensity', size: 'auto' },
    { prop: 'bladePubescence', name: 'Blade Pubescence', size: 'auto' },
    { prop: 'auricleColor', name: 'Auricle Color', size:'auto' },
    { prop: 'collarColor', name: 'Collar Color', size: 'auto' },
    { prop: 'liguleShape', name: 'Ligule Shape', size: 'auto' },
    { prop: 'liguleColor', name: 'Ligule Color', size: 'auto' },
    { prop: 'liguleLength', name: 'Ligule Length (mm)', size: 'auto' },
    { prop: 'flagLeafAttitude', name: 'Flag Leaf Attitude', size: 'auto' },
    { prop: 'flagLeafLength', name: 'Flag Leaf Length (cm)', size: 'auto' },
    { prop: 'flagLeafWidth', name: 'Flag Leaf Width (cm)', size: 'auto' }
  ],
  culm: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 'auto' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 'auto' },
    { prop: 'trialNumber', name: 'Trial', size: 'auto' },
    { prop: 'culmHabitAngle', name: 'Culm Habit Angle', size: 'auto' },
    { prop: 'nodeAnthocyaninColoration', name: 'Node Anthocyanin', size: 'auto' },
    { prop: 'underlyingNodeColor', name: 'Underlying Node Color', size: 'auto' },
    { prop: 'internodeAnthocyaninColaration', name: 'Internode Anthocyanin', size: 'auto' },
    { prop: 'underlyingInternodeColor', name: 'Underlying Internode Color', size: 'auto' },
    { prop: 'culmLodgingResistance', name: 'Lodging Resistance', size: 'auto' },
    { prop: 'culmLength', name: 'Culm Length (cm)', size: 'auto' },
    { prop: 'culmDiameter', name: 'Culm Diameter (cm)', size: 'auto' },
    { prop: 'culmnum', name: 'Culms per Hill', size: 'auto' }
  ],
  panicle: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 'auto' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 'auto' },
    { prop: 'trialNumber', name: 'Trial', size: 'auto' },
    { prop: 'panicleExsertion', name: 'Panicle Exsertion', size: 'auto' },
    { prop: 'panicleAttAxis', name: 'Main Axis Attitude', size: 'auto' },
    { prop: 'panicleAttBran', name: 'Branch Attitude', size: 'auto' },
    { prop: 'panicleSecBran', name: 'Secondary Branching', size: 'auto' },
    { prop: 'panicleShatter', name: 'Shattering', size: 'auto' },
    { prop: 'panicleLength', name: 'Panicle Length (cm)', size: 'auto' },
    { prop: 'paniclenum', name: 'Grains per Panicle', size: 'auto' }
  ],
  grain: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 'auto' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 'auto' },
    { prop: 'trialNumber', name: 'Trial', size: 'auto' },
    { prop: 'awnColor', name: 'Awn Color', size: 'auto' },
    { prop: 'awnDist', name: 'Awn Distribution', size: 'auto' },
    { prop: 'apiculusColor', name: 'Apiculus Color', size: 'auto' },
    { prop: 'anthocyaninColBelApiculus', name: 'Anthocyanin Below Apiculus', size: 'auto' },
    { prop: 'lemmaAndPaleaColor', name: 'Lemma & Palea Color', size: 'auto' },
    { prop: 'stigmaColor', name: 'Stigma Color', size: 'auto' },
    { prop: 'awnLength', name: 'Awn Length (mm)', size: 'auto' },
    { prop: 'grainLength', name: 'Grain Length (mm)', size: 'auto' },
    { prop: 'grainWidth', name: 'Grain Width (mm)', size: 'auto' },
    { prop: 'grainWeight', name: '1000 Grain Weight (g)', size: 'auto' },
    { prop: 'lemmaAndPaleaPubescence', name: 'Lemma & Palea Pubescence', size: 'auto' },
    { prop: 'yield', name: 'Yield (kg/5m²)', size: 'auto' }
  ],
  growth: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 'auto' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 'auto' },
    { prop: 'trialNumber', name: 'Trial', size: 'auto' },
    { prop: 'tillering', name: 'Days to Tillering', size: 'auto' },
    { prop: 'booting', name: 'Days to Booting', size: 'auto' },
    { prop: 'heading', name: 'Days to Heading', size: 'auto' },
    { prop: 'maturity', name: 'Days to Maturity', size: 'auto' },
    { prop: 'height', name: 'Height (cm)', size: 'auto' }
  ]
}

const selectedTable = ref('plantvigorandleaf')
const columns = ref([])
const columnsWithFilters = computed(() => {
  if (!columns.value.length) return []
  return columns.value.map(col => ({
    ...col
  }))
})
const loading = ref(false)
const error = ref(null)
const activeProvince = ref('')
const province = computed(() => activeProvince.value)

const fetchData = async () => {
  loading.value = true
  error.value = null

  if (!activeProvince.value) {
      activeProvince.value = getProvinceFromLocation()
  }

  try {
    const response = await fetch(
      `/api/rice-data/${selectedTable.value}.json?province=${encodeURIComponent(activeProvince.value)}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error)
    }
    
    allData = result.data
    filteredData.value = [...allData]
    columns.value = [...columnDefinitions[selectedTable.value]]
    
  } catch (err) {
    console.error('Error:', err)
    error.value = err.message
    allData = []
  } finally {
    loading.value = false
  }
}

const selectTable = (tableId) => {
  selectedTable.value = tableId
  fetchData()
}

const refreshData = () => {
  fetchData()
}

onMounted(() => {
  activeProvince.value = getProvinceFromLocation()
  fetchData()
})
</script>

<style scoped>
.grid-container {
  padding: 0;
}

.controls {
  margin-bottom: 20px;
}

.table-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  background: #0d1117;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #30363d;
}

.table-btn {
  padding: 8px 16px;
  background: #010409;
  border: 1px solid #30363d;
  border-radius: 8px;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.table-btn:hover {
  background: #1f242f;
  border-color: #58a6ff;
}

.table-btn.active {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 16px;
}

.status {
  font-size: 14px;
}

.status.loading {
  color: #58a6ff;
}

.status.error {
  color: #f85149;
}

.status.success {
  color: #3fb950;
}

.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #30363d;
  border-top-color: #58a6ff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.refresh-btn {
  padding: 6px 12px;
  background: #1f242f;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 13px;
}

.refresh-btn:hover {
  background: #2d333b;
}

.revo-grid {
  height: 600px;
  width: 100%;
  border: 1px solid #30363d;
  border-radius: 12px;
  overflow: auto;
}

:deep(.revo-grid) {
  width: 100%;
  table-layout: auto;
}

:deep(.rg-cell-editor) {
  display: none !important;
}

:deep(.rg-header) {
  background-color: #161b22;
  color: #e6edf3;
  font-weight: 600;
  border-bottom: 2px solid #30363d;
  text-align: center !important;
}

:deep(.rg-cell) {
  padding: 8px 12px;
  border-bottom: 1px solid #21262d;
  color: #c9d1d9;
  cursor: default;
  text-align: center !important;
  vertical-align: middle !important;
}

:deep(.rg-even-row) {
  background-color: #0d1117;
}

:deep(.rg-odd-row) {
  background-color: #0a0c10;
}

:deep(.rg-header-cell:hover) {
  background-color: #21262d;
  cursor: pointer;
}

:deep(.rg-filter-row) {
  background-color: #161b22;
}

:deep(.rg-filter-cell input) {
  background-color: #010409;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-family: inherit;
}

:deep(.rg-filter-cell input:focus) {
  outline: none;
  border-color: #58a6ff;
}

</style>
