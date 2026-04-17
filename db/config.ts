import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config
const PlantVigorAndLeaf = defineTable({
  columns: {
    date: column.date(),
    plant_id: column.text(),
    plant_vigor: column.number({ default: 0 }),
    basal_leaf_sheath_color: column.number({ default: 0 }),
    leaf_sheath_anthocyanin_coloration: column.number({ default: 0 }),
    blade_anthocyanin_coloration: column.number({ default: 0 }),
    blade_distribution_of_anthocyanin_coloration: column.number({ default: 0 }),
    blade_intensity_of_green_color: column.number({ default: 0 }),
    blade_pbescence: column.number({ default: 0 }),
    auricle_color: column.number({ default: 0 }),
    collar_color: column.number({ default: 0 }),
    ligule_shape: column.number({ default: 0 }),
    ligule_color: column.number({ default: 0 }),
    ligule_length: column.number({ default: 0 }),
    flag_leaf_attitude: column.number({ default: 0 }),
    flag_leaf_and_penultimate_leaf_length: column.number({ default: 0 }),
    flag_leaf_and_penultimate_leaf_width: column.number({ default: 0 }),
  }
})
export default defineDb({
  tables: { PlantVigorAndLeaf }
});
