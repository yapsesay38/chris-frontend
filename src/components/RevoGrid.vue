<script setup>
import VGrid from '@revolist/vue3-datagrid'
import { ref } from 'vue'

const columns = ref([
{ prop: 'first', name: 'Date' },
{ prop: 'second', name: 'ID' }
])
const rows = ref([
{ name: '1', details: 'First Item' }
])
</script>

<template>
  <VGrid
  :columns="columns"
  :source="rows"/>
</template>
