// Tables
const availableTables = [
    {
        id: 'plantvigorandleaf',
        name: '🍃 Plant Vigor and Leaf Characters',
        description: 'Observed at Late Vegetatvie Stage',
        parameters: [
            { id: 'plantVigor', label: 'Plant Vigor', type: 'select', options: { '1': 'Very Weak', '2': 'Weak', '3': 'Normal', '4': 'Vigorous', '5': 'Very Vigorous' } },
            { id: 'plantBasalLeafSheathColor', label: 'Basal Leaf Sheath Color', type: 'select', options: { '1': 'Green', '2': 'Purple Lines', '3': 'Light Purple', '4': 'Purple' } },
            { id: 'plantLeafSheathAnthocyaninColoration', label: 'Leaf Sheath Anthocyanin Coloration', type: 'select', options: { '0': 'Absent', '1': 'Weak', '2': 'Medium', '3': 'Strong' } },
            { 
                id: 'plantBladeAnthocyaninColoration', 
                label: 'Blade Anthocyanin Coloration', 
                type: 'select', 
                options: { '0': 'Absent', '1': 'Present' },
                controls: ['plantBladeDistAnthocyaninColoration']
            },
            { 
                id: 'plantBladeDistAnthocyaninColoration', 
                label: 'Blade Distribution of Anthocyanin Coloration', 
                type: 'select', 
                options: { '1': 'Tips Only', '2': 'On Margins Only', '3': 'In Blotches', '4': 'Even (Uniform Purple)' },
                dependsOn: { param: 'plantBladeAnthocyaninColoration', value: '1' }
            },
            { id: 'plantBladeIntensityGreen', label: 'Blade Intensity of Green Color', type: 'select', options: { '0': 'No Green Color Due to Anthocyanin', '1': 'Light Green', '2': 'Medium Green', '3': 'Dark Green' } },
            { id: 'plantBladePubescence', label: 'Blade Pubescence', type: 'select', options: { '1': 'Glabrous', '2': 'Intermediate', '3': 'Pubescent' } },
            { id: 'plantAuricleColor', label: 'Auricle Color', type: 'select', options: { '0': 'Absent', '1': 'Whitish', '2': 'Yellowish Green', '3': 'Purple', '4': 'Light Purple', '5': 'Purple Lines' } },
            { id: 'plantCollarColor', label: 'Collar Color', type: 'select', options: { '0': 'Absent', '1': 'Green', '2': 'Light Green', '3': 'Purple', '4': 'Purple Lines' } },
            { id: 'plantLiguleShape', label: 'Ligule Shape', type: 'select', options: { '0': 'Absent', '1': 'Truncate', '2': 'Acute to Acuminate', '3': '2-Cleft' } },
            { id: 'plantLiguleColor', label: 'Ligule Color', type: 'select', options: { '0': 'Absent', '1': 'Whitish', '2': 'Yellowish Green', '3': 'Purple', '4': 'Light Purple', '5': 'Purple Lines' } },
            { id: 'plantFlagLeafAttitude', label: 'Flag Leaf Attitude', type: 'select', options: { '1': 'Erect', '2': 'Intermediate', '3': 'Horizontal', '4': 'Descending' } },
            { id: 'plantFlagLeafLength', label: 'Flag Leaf and Penultimate Leaf Length (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'plantFlagLeafWidth', label: 'Flag Leaf and Penultimate Leaf Width (cm)', type: 'number', step: '0.1', min: 0 }
        ]
    },
    {
        id: 'culm',
        name: '🌿 Culm Characters',
        description: 'Observed after the Flowering Stage to Near Maturity Stage',
        parameters: [
            { id: 'culmHabitAngle', label: 'Culm Habit Angle', type: 'select', options: { '1': 'Erect (<15°)', '2': 'Semi-erect (~20°)', '3': 'Open (~40°)', '4': 'Spreading (>60-80°)', '5': 'Procumbent' } },
            { id: 'culmNodeAnthocyaninColoration', label: 'Node Anthocyanin Coloration', type: 'select', options: { '0': 'Absent', '1': 'Purple', '2': 'Light Purple', '3': 'Purple Lines' } },
            { id: 'culmUnderlyingNodeColor', label: 'Underlying Node Color', type: 'select', options: { '0': 'No Underlying Color', '1': 'Light Gold', '2': 'Green' } },
            { id: 'culmInternodeAnthocyaninColaration', label: 'Internode Anthocyanin Coloration', type: 'select', options: { '0': 'Absent', '1': 'Purple', '2': 'Purple Lines' } },
            { id: 'culmUnderlyingInternodeColor', label: 'Underlying Internode Color', type: 'select', options: { '0': 'No Underlying Color', '1': 'Light Gold', '2': 'Green' } },
            { id: 'culmLodgingResistance', label: 'Culm Lodging Resistance', type: 'select', options: { '1': 'Very Weak (All Plants Flat)', '2': 'Weak (Most Plants Nearly Flat)', '3': 'Intermediate (Most Plants ~45°)', '4': 'Strong (Most Plants ~20° from Vertical)', '5': 'Very Strong (All Plants Vertical)' } },
            { id: 'culmLength', label: 'Culm Length (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'culmDiameter', label: 'Culm Diameter (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'culmNum', label: 'Number of Culms per Hill', type: 'number', step: '1', min: 0 }
        ]
    },
    {
        id: 'panicle',
        name: '🌾 Panicle Characters',
        description: 'Observed Near or At Maturity Stage',
        parameters: [
            { id: 'panicleExsertion', label: 'Panicle Exsertion', type: 'select', options: { '1': 'Enclosed', '2': 'Partly Exserted', '3': 'Just Exserted', '4': 'Moderately Well Exserted', '5': 'Well Exserted' } },
            { id: 'panicleAttAxis', label: 'Panicle Attitude of the Main Axis', type: 'select', options: { '1': 'Upright', '2': 'Semi-upright', '3': 'Slightly Drooping', '4': 'Strongly Drooping' } },
            { id: 'panicleAttBran', label: 'Panicle Attitude of Branches', type: 'select', options: { '1': 'Compact', '2': 'Semi-compact', '3': 'Open', '4': 'Horizontal', '5': 'Drooping' } },
            { id: 'panicleSecBran', label: 'Panicle Secondary Branching', type: 'select', options: { '0': 'Absent', '1': 'Sparse', '2': 'Dense', '3': 'Clustered' } },
            { id: 'panicleShatter', label: 'Panicle Shattering', type: 'select', options: { '1': 'Very Low (<1%)', '2': 'Low (~3%)', '3': 'Moderate (~15%)', '4': 'High (~35%)', '5': 'Very High (>50%)' } },
            { id: 'panicleLength', label: 'Panicle Length (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'panicleNumFilled', label: 'Number of Filled Grains per Panicle', type: 'number', step: '1', min: 0 },
            { id: 'panicleNumUnfilled', label: 'Number of Unfilled Grains per Panicle', type: 'number', step: '1', min: 0 }
        ]
    },
    {
        id: 'grain',
        name: '🍚 Grain Characters and Grain Yield',
        description: 'Observed at Maturity Stage or Harvest Stage',
        parameters: [
            { id: 'grainAwnColor', label: 'Awn Color', type: 'select', options: { '0': 'Absent (Awnless)', '1': 'Straw', '2': 'Gold', '3': 'Brown (Tawny)', '4': 'Red', '5': 'Purple', '6': 'Black' } },
            { id: 'grainAwnDist', label: 'Awn Distribution', type: 'select', stage: 'maturity', options: { '0': 'Absent (Awnless)', '1': 'Tip Only', '2': 'Upper Quarter Only', '3': 'Upper Half Only', '4': 'Upper Three-Quarters Only', '5': 'Whole Length' } },
            { id: 'grainApiculusColor', label: 'Apiculus Color', type: 'select', stage: 'maturity', options: { '1': 'White', '2': 'Straw', '3': 'Brown (Tawny)', '4': 'Red', '5': 'Red Apex', '6': 'Purple', '7': 'Purple Apex' } },
            { id: 'grainAnthocyaninColBelApiculus', label: 'Anthocyanin Coloration Below Apiculus', type: 'select', options: { '1': 'Very Weak', '2': 'Weak', '3': 'Medium', '4': 'Strong' } },
            { id: 'grainLemmaAndPaleaColor', label: 'Lemma and Palea Color', type: 'select', options: { '1': 'White', '2': 'Straw', '3': 'Gold and Gold Furrows', '4': 'Brown (Tawny)', '5': 'Brown Spots', '6': 'Brown Furrows', '7': 'Purple', '8': 'Reddish to Light Purple', '9': 'Purple Spots', '10': 'Purple Furrows', '11': 'Black' } },
            { id: 'grainStigmaColor', label: 'Stigma Color', type: 'select', options: { '1': 'White', '2': 'Light Green', '3': 'Yellow', '4': 'Light Purple', '5': 'Purple' } },
            { id: 'grainAwnLength', label: 'Awn Length (mm)', type: 'number', step: '0.1', min: 0 },
            { id: 'grainLength', label: 'Grain Length (mm)', type: 'number', step: '0.1', min: 0 },
            { id: 'grainWidth', label: 'Grain Width (mm)', type: 'number', step: '0.1', min: 0 },
            { id: 'grainWeight', label: '1000 Grain-Weight (g)', type: 'number', step: '1', min: 0 },
            { id: 'grainLemmaAndPaleaPub', label: 'Lemma and Palea Pubescence', type: 'select', options: { '1': 'Glabrous', '2': 'Hairs on Lemma Keel', '3': 'Hairs on Upper Portion', '4': 'Short Hairs', '5': 'Long Hairs (Velvety)' } },
            { id: 'grainYield', label: 'Yield per Plot (kg/5m^2)', type: 'number', step: '1', min: 0 }
        ]
    },
    {
        id: 'growth',
        name: '🌱 Growth Cycle Characters',
        description: 'Observed throughout the whole process',
        parameters: [
            { id: 'tillering', label: 'Number of days from Transplanting to Tillering', type: 'number', step: '1', min: 0 },
            { id: 'booting', label: 'Number of days from Transplanting to Booting', type: 'number', step: '1', min: 0 },
            { id: 'heading', label: 'Number of days from Transplanting to Heading', type: 'number', step: '1', min: 0 },
            { id: 'maturity', label: 'Number of days from Transplanting to Maturity', type: 'number', step: '1', min: 0 },
            { id: 'height', label: 'Height at Maturity (cm)', type: 'number', step: '0.1', min: 0 }
        ]
    }
];

// Stage Taxonomy
const STAGES = [
  { id: 'vegetative', label: 'Late Vegetative', order: 10 },
  { id: 'maturity', label: 'Post Flowering to Maturity', order: 20 },
  { id: 'harvest', label: 'Harvest', order: 30 },
  { id: 'cycle', label: 'Growth Cycle', order: 40 }
];

const TABLE_DEFAULT_STAGE = {
  plantvigorandleaf: 'vegetative',
  culm: 'maturity',
  panicle: 'maturity',
  grain: 'harvest',
  growth: 'cycle'
};

// Normalize: add stage and tableId to every parameter
const normalizedTables = availableTables.map(t => ({
  ...t,
  parameters: t.parameters.map(p => ({
    ...p,
    stage: p.stage ?? TABLE_DEFAULT_STAGE[t.id],
    tableId: t.id,
  })),
}));

window.STAGES = STAGES;
window.TABLE_DEFAULT_STAGE = TABLE_DEFAULT_STAGE;
window.availableTables = normalizedTables;
