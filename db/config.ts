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
    flag_leaf_and_penultimate_leaf_width: column.number({ default: 0 })
  }
})

const Culm = defineTable({
  columns: {
    date: column.date(),
    plant_id: column.text(),
    culm_habit_angle: column.number ({ default: 0 }),
    node_anthocyanin_coloration: column.number ({ default: 0 }),
    underlying_node_color: column.number ({ default: 0 }),
    internode_anthocyanin_coloration: column.number ({ default: 0 }),
    underlying_internode_color: column.number ({ default: 0 }),
    culm_lodging_resistance: column.number ({ default: 0 }),
    culm_length: column.number ({ default: 0 }),
    culm_diameter: column.number ({ default: 0 }),
    number_of_culms_per_hill: column.number ({ default: 0 })
  }
})

const Panicle = defineTable({
  columns: {
    date: column.date(),
    plant_id: column.text(),
    panicle_exsertion: column.number ({ default: 0 }),
    panicle_attitude_of_the_main_axis: column.number ({ default: 0 }),
    panicle_attitude_of_branches: column.number ({ default: 0 }),
    panicle_secondary_branching: column.number ({ default: 0 }),
    panicle_shattering: column.number ({ default: 0 }),
    panicle_length: column.number ({ default: 0 }),
    number_of_filled_and_unfilled_grains_per_panicle: column.number ({ default: 0 })
  }
})

const GrainCharactersAndGrainYield = defineTable({
  columns: {
    date: column.date(),
    plant_id: column.text(),
    awn_color: column.number ({ default: 0 }),
    awn_distribution: column.number ({ default: 0 }),
    apiculus_color: column.number ({ default: 0 }),
    anthocyanin_coloration_below_apiculus: column.number ({ default: 0 }),
    lemma_and_palea_color: column.number ({ default: 0 }),
    stigma_color: column.number ({ default: 0 }),
    awn_length: column.number ({ default: 0 }),
    grain_length: column.number ({ default: 0 }),
    grain_width: column.number ({ default: 0 }),
    grain_weight: column.number ({ default: 0 }),
    lemma_and_palea_pubescence: column.number ({ default: 0 }),
    yield_per_plot: column.number ({ default: 0 })
  }
})

const GrowthCycle = defineTable({
  columns: {
    date: column.date(),
    plant_id: column.text(),
    number_of_days_from_transplanting_to_tillering: column.number ({ default: 0 }),
    number_of_days_from_transplanting_to_booting: column.number ({ default: 0 }),
    number_of_days_from_transplanting_to_heading: column.number ({ default: 0 }),
    number_of_days_from_transplanting_to_maturity: column.number ({ default: 0 }),
    height_at_maturity: column.number ({ default: 0 })
  }
})

export default defineDb({
  tables: {
    PlantVigorAndLeaf,
    Culm,
    Panicle,
    GrainCharactersAndGrainYield,
    GrowthCycle
  }
});
