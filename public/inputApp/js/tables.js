const availableTables = [
    {
        id: 'plantvigorandleaf',
        name: '🍃 Plant Vigor and Leaf Characters',
        description: 'Observed at Late Vegetatvie Stage',
        parameters: [
            { id: 'plantVigor', label: 'Plant Vigor', type: 'select', options: { '1': 'Very Weak', '2': 'Weak', '3': 'Normal', '4': 'Vigorous', '5': 'Very Vigorous' } },
            { id: 'plantbasalLeafSheathColor', label: 'Basal Leaf Sheath Color', type: 'select', options: { '1': 'Green', '2': 'Purple Lines', '3': 'Light Purple', '4': 'Purple' } },
            { id: 'plantleafSheathAnthocyaninColoration', label: 'Leaf Sheath Anthocyanin Coloration', type: 'select', options: { '0': 'Absent', '1': 'Weak', '2': 'Medium', '3': 'Strong' } },
            { 
                id: 'plantbladeAnthocyaninColoration', 
                label: 'Blade Anthocyanin Coloration', 
                type: 'select', 
                options: { '0': 'Absent', '1': 'Present' },
                controls: ['bladeDistAnthocyaninColoration']
            },
            { 
                id: 'plantbladeDistAnthocyaninColoration', 
                label: 'Blade Distribution of Anthocyanin Coloration', 
                type: 'select', 
                options: { '1': 'Tips Only', '2': 'On Margins Only', '3': 'In Blotches', '4': 'Even (Uniform Purple)' },
                dependsOn: { param: 'bladeAnthocyaninColoration', value: '1' }
            },
            { id: 'plantbladeIntensityGreen', label: 'Blade Intensity of Green Color', type: 'select', options: { '0': 'No Green Color Due to Anthocyanin', '1': 'Light Green', '2': 'Medium Green', '3': 'Dark Green' } },
            { id: 'plantbladePubescence', label: 'Blade Pubescence', type: 'select', options: { '1': 'Glabrous', '2': 'Intermediate', '3': 'Pubescent' } },
            { id: 'plantauricleColor', label: 'Auricle Color', type: 'select', options: { '0': 'Absent', '1': 'Whitish', '2': 'Yellowish Green', '3': 'Purple', '4': 'Light Purple', '5': 'Purple Lines' } },
            { id: 'plantcollarColor', label: 'Collar Color', type: 'select', options: { '0': 'Absent', '1': 'Green', '2': 'Light Green', '3': 'Purple', '4': 'Purple Lines' } },
            { id: 'plantliguleShape', label: 'Ligule Shape', type: 'select', options: { '0': 'Absent', '1': 'Truncate', '2': 'Acute to Acuminate', '3': '2-Cleft' } },
            { id: 'plantliguleColor', label: 'Ligule Color', type: 'select', options: { '0': 'Absent', '1': 'Whitish', '2': 'Yellowish Green', '3': 'Purple', '4': 'Light Purple', '5': 'Purple Lines' } },
            { id: 'plantliguleLength', label: 'Ligule Length (mm)', type: 'number', step: '0.1', min: 0 },
            { id: 'plantflagLeafAttitude', label: 'Flag Leaf Attitude', type: 'select', options: { '1': 'Erect', '2': 'Intermediate', '3': 'Horizontal', '4': 'Descending' } },
            { id: 'plantflagLeafLength', label: 'Flag Leaf and Penultimate Leaf Length (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'plantflagLeafWidth', label: 'Flag Leaf and Penultimate Leaf Width (cm)', type: 'number', step: '0.1', min: 0 }
        ]
    },
    {
        id: 'culm',
        name: '🌿 Culm Characters',
        description: 'Observed after the Flowering Stage',
        parameters: [
            { id: 'culmHabitAngle', label: 'Culm Habit Angle', type: 'select', options: { '1': 'Erect (<15°)', '2': 'Semi-erect (~20°)', '3': 'Open (~40°)', '4': 'Spreading (>60-80°)', '5': 'Procumbent' } },
            { id: 'culmnodeAnthocyaninColoration', label: 'Node Anthocyanin Coloration', type: 'select', options: { '0': 'Absent', '1': 'Purple', '2': 'Light Purple', '3': 'Purple Lines' } },
            { id: 'culmunderlyingNodeColor', label: 'Underlying Node Color', type: 'select', options: { '0': 'No Underlying Color', '1': 'Light Gold', '2': 'Green' } },
            { id: 'culminternodeAnthocyaninColaration', label: 'Internode Anthocyanin Coloration', type: 'select', options: { '0': 'Absent', '1': 'Purple', '2': 'Purple Lines' } },
            { id: 'culmunderlyingInternodeColor', label: 'Underlying Internode Color', type: 'select', options: { '0': 'No Underlying Color', '1': 'Light Gold', '2': 'Green' } },
            { id: 'culmLodgingResistance', label: 'Culm Lodging Resistance', type: 'select', options: { '1': 'Very Weak (All Plants Flat)', '2': 'Weak (Most Plants Nearly Flat)', '3': 'Intermediate (Most Plants ~45°)', '4': 'Strong (Most Plants ~20° from Vertical)', '5': 'Very Strong (All Plants Vertical)' } },
            { id: 'culmLength', label: 'Culm Length (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'culmDiameter', label: 'Culm Diameter (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'culmnum', label: 'Number of Culms per Hill', type: 'number', step: '1', min: 0 }
        ]
    },
    {
        id: 'panicle',
        name: '🌾 Panicle Characters',
        description: 'Observed Near Maturity',
        parameters: [
            { id: 'panicleExsertion', label: 'Panicle Exsertion', type: 'select', options: { '1': 'Enclosed', '2': 'Partly Exserted', '3': 'Just Exserted', '4': 'Moderately Well Exserted', '5': 'Well Exserted' } },
            { id: 'panicleAttAxis', label: 'Panicle Attitude of the Main Axis', type: 'select', options: { '1': 'Upright', '2': 'Semi-upright', '3': 'Slightly Drooping', '4': 'Strongly Drooping' } },
            { id: 'panicleAttBran', label: 'Panicle Attitude of Branches', type: 'select', options: { '1': 'Compact', '2': 'Semi-compact', '3': 'Open', '4': 'Horizontal', '5': 'Drooping' } },
            { id: 'panicleSecBran', label: 'Panicle Secondary Branching', type: 'select', options: { '0': 'Absent', '1': 'Sparse', '2': 'Dense', '3': 'Clustered' } },
            { id: 'panicleShatter', label: 'Panicle Shattering', type: 'select', options: { '1': 'Very Low (<1%)', '2': 'Low (~3%)', '3': 'Moderate (~15%)', '4': 'High (~35%)', '5': 'Very High (>50%)' } },
            { id: 'panicleLength', label: 'Panicle Length (cm)', type: 'number', step: '0.1', min: 0 },
            { id: 'paniclenumfilled', label: 'Number of Filled Grains per Panicle', type: 'number', step: '1', min: 0 },
            { id: 'paniclenumunfilled', label: 'Number of Unfilled Grains per Panicle', type: 'number', step: '1', min: 0 }
        ]
    },
    {
        id: 'grain',
        name: '🍚 Grain Characters and Grain Yield',
        description: 'Observed at Maturity or Harvest',
        parameters: [
            { id: 'grainawnColor', label: 'Awn Color', type: 'select', options: { '0': 'Absent (Awnless)', '1': 'Straw', '2': 'Gold', '3': 'Brown (Tawny)', '4': 'Red', '5': 'Purple', '6': 'Black' } },
            { id: 'grainawnDist', label: 'Awn Distribution', type: 'select', options: { '0': 'Absent (Awnless)', '1': 'Tip Only', '2': 'Upper Quarter Only', '3': 'Upper Half Only', '4': 'Upper Three-Quarters Only', '5': 'Whole Length' } },
            { id: 'grainapiculusColor', label: 'Apiculus Color', type: 'select', options: { '1': 'White', '2': 'Straw', '3': 'Brown (Tawny)', '4': 'Red', '5': 'Red Apex', '6': 'Purple', '7': 'Purple Apex' } },
            { id: 'grainanthocyaninColBelApiculus', label: 'Anthocyanin Coloration Below Apiculus', type: 'select', options: { '1': 'Very Weak', '2': 'Weak', '3': 'Medium', '4': 'Strong' } },
            { id: 'grainlemmaAndPaleaColor', label: 'Lemma and Palea Color', type: 'select', options: { '1': 'White', '2': 'Straw', '3': 'Gold and Gold Furrows', '4': 'Brown (Tawny)', '5': 'Brown Spots', '6': 'Brown Furrows', '7': 'Purple', '8': 'Reddish to Light Purple', '9': 'Purple Spots', '10': 'Purple Furrows', '11': 'Black' } },
            { id: 'grainstigmaColor', label: 'Stigma Color', type: 'select', options: { '1': 'White', '2': 'Light Green', '3': 'Yellow', '4': 'Light Purple', '5': 'Purple' } },
            { id: 'grainawnLength', label: 'Awn Length (mm)', type: 'number', step: '0.1', min: 0 },
            { id: 'grainLength', label: 'Grain Length (mm)', type: 'number', step: '0.1', min: 0 },
            { id: 'grainWidth', label: 'Grain Width (mm)', type: 'number', step: '0.1', min: 0 },
            { id: 'grainWeight', label: '1000 Grain-Weight (g)', type: 'number', step: '1', min: 0 },
            { id: 'grainlemmaAndPaleaPub', label: 'Lemma and Palea Pubescence', type: 'select', options: { '1': 'Glabrous', '2': 'Hairs on Lemma Keel', '3': 'Hairs on Upper Portion', '4': 'Short Hairs', '5': 'Long Hairs (Velvety)' } },
            { id: 'grainyield', label: 'Yield per Plot (kg/5m^2)', type: 'number', step: '1', min: 0 }
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

window.availableTables = availableTables;
