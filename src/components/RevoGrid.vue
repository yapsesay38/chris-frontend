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
      class="revo-grid"
      ref="gridRef"
      :columns="columnsWithFilters" 
      :source="filteredData"
      :filter="true"
      :sorting="true"
      :range="true"
      :row-headers="true"
      :pagination="true"
      :page-size="50"
      :page-sizes="[25, 50, 100, 250]"
      :can-move-columns="true"
      :readonly="true"
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
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 200, sortable: true, pin: 'colPinStart', size: 'auto' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 120 },
    { prop: 'trialNumber', name: 'Trial', size: 80 },
    { prop: 'plantVigor', name: 'Plant Vigor', size: 120 },
    { prop: 'basalLeafSheathColor', name: 'Basal Leaf Sheath Color', size: 180 },
    { prop: 'leafSheathAnthocyaninColoration', name: 'Leaf Sheath Anthocyanin', size: 180 },
    { prop: 'bladeAnthocyaninColoration', name: 'Blade Anthocyanin', size: 150 },
    { prop: 'bladeDistAnthocyaninColoration', name: 'Blade Distribution', size: 180 },
    { prop: 'bladeIntensityGreen', name: 'Blade Green Intensity', size: 160 },
    { prop: 'bladePubescence', name: 'Blade Pubescence', size: 150 },
    { prop: 'auricleColor', name: 'Auricle Color', size: 140 },
    { prop: 'collarColor', name: 'Collar Color', size: 130 },
    { prop: 'liguleShape', name: 'Ligule Shape', size: 140 },
    { prop: 'liguleColor', name: 'Ligule Color', size: 130 },
    { prop: 'liguleLength', name: 'Ligule Length (mm)', size: 150 },
    { prop: 'flagLeafAttitude', name: 'Flag Leaf Attitude', size: 150 },
    { prop: 'flagLeafLength', name: 'Flag Leaf Length (cm)', size: 160 },
    { prop: 'flagLeafWidth', name: 'Flag Leaf Width (cm)', size: 150 }
  ],
  culm: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 200, sortable: true, pin: 'colPinStart' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 120 },
    { prop: 'trialNumber', name: 'Trial', size: 80 },
    { prop: 'culmHabitAngle', name: 'Culm Habit Angle', size: 150 },
    { prop: 'nodeAnthocyaninColoration', name: 'Node Anthocyanin', size: 150 },
    { prop: 'underlyingNodeColor', name: 'Underlying Node Color', size: 170 },
    { prop: 'internodeAnthocyaninColaration', name: 'Internode Anthocyanin', size: 170 },
    { prop: 'underlyingInternodeColor', name: 'Underlying Internode Color', size: 180 },
    { prop: 'culmLodgingResistance', name: 'Lodging Resistance', size: 160 },
    { prop: 'culmLength', name: 'Culm Length (cm)', size: 140 },
    { prop: 'culmDiameter', name: 'Culm Diameter (cm)', size: 150 },
    { prop: 'culmnum', name: 'Culms per Hill', size: 140 }
  ],
  panicle: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 200, sortable: true, pin: 'colPinStart' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 120 },
    { prop: 'trialNumber', name: 'Trial', size: 80 },
    { prop: 'panicleExsertion', name: 'Panicle Exsertion', size: 150 },
    { prop: 'panicleAttAxis', name: 'Main Axis Attitude', size: 160 },
    { prop: 'panicleAttBran', name: 'Branch Attitude', size: 150 },
    { prop: 'panicleSecBran', name: 'Secondary Branching', size: 160 },
    { prop: 'panicleShatter', name: 'Shattering', size: 130 },
    { prop: 'panicleLength', name: 'Panicle Length (cm)', size: 150 },
    { prop: 'paniclenum', name: 'Grains per Panicle', size: 160 }
  ],
  grain: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 200, sortable: true, pin: 'colPinStart' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 120 },
    { prop: 'trialNumber', name: 'Trial', size: 80 },
    { prop: 'awnColor', name: 'Awn Color', size: 130 },
    { prop: 'awnDist', name: 'Awn Distribution', size: 150 },
    { prop: 'apiculusColor', name: 'Apiculus Color', size: 140 },
    { prop: 'anthocyaninColBelApiculus', name: 'Anthocyanin Below Apiculus', size: 190 },
    { prop: 'lemmaAndPaleaColor', name: 'Lemma & Palea Color', size: 160 },
    { prop: 'stigmaColor', name: 'Stigma Color', size: 140 },
    { prop: 'awnLength', name: 'Awn Length (mm)', size: 140 },
    { prop: 'grainLength', name: 'Grain Length (mm)', size: 150 },
    { prop: 'grainWidth', name: 'Grain Width (mm)', size: 150 },
    { prop: 'grainWeight', name: '1000 Grain Weight (g)', size: 170 },
    { prop: 'lemmaAndPaleaPubescence', name: 'Lemma & Palea Pubescence', size: 190 },
    { prop: 'yield', name: 'Yield (kg/5m²)', size: 140 }
  ],
  growth: [
    { prop: 'landraceId', name: 'Heirloom Rice Landraces', size: 200, sortable: true, pin: 'colPinStart' },
    { prop: 'treatmentNo', name: 'Treatment No.', size: 120 },
    { prop: 'trialNumber', name: 'Trial', size: 80 },
    { prop: 'tillering', name: 'Days to Tillering', size: 160 },
    { prop: 'booting', name: 'Days to Booting', size: 150 },
    { prop: 'heading', name: 'Days to Heading', size: 150 },
    { prop: 'maturity', name: 'Days to Maturity', size: 150 },
    { prop: 'height', name: 'Height (cm)', size: 130 }
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

  --revogrid-cell-horizontal-align: center;
  --revogrid-cell-vertical-align: middle;
  --revogrid-header-horizontal-align: center;
  --revogrid-header-vertical-align: middle;
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
}

:deep(.rg-cell) {
  padding: 8px 12px;
  border-bottom: 1px solid #21262d;
  color: #c9d1d9;
  cursor: default;
}

:deep(.rg-cell .rg-cell-value) {
  display: flex;
  width: 100%;
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
