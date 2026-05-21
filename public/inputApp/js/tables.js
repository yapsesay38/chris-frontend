// js/tables.js - All table/parameter definitions
const availableTables = [
    {
        id: 'agromorphological',
        name: '🌾 Agromorphological Parameters',
        description: 'Standard rice plant characteristics',
        parameters: [
            { id: 'plantVigor', label: 'Plant Vigor', type: 'select', options: { '1': 'Very Vigorous', '2': 'Vigorous', '3': 'Normal', '4': 'Weak', '5': 'Very Weak' } },
            { id: 'basalLeafSheet', label: 'Basal Leaf Sheet', type: 'select', options: { '1': 'Green', '2': 'Purple Lines', '3': 'Light Purple', '4': 'Purple' } },
            { id: 'leafSheathAnthocyanin', label: 'Leaf Sheath Anthocyanin', type: 'select', options: { '0': 'Absent', '3': 'Weak', '5': 'Medium', '7': 'Strong' } },
            { id: 'bladeAnthocyanin', label: 'Blade Anthocyanin', type: 'select', options: { '1': 'Tips Only', '2': 'On Margins Only', '3': 'In Blotches', '4': 'Even' } },
            { id: 'bladeIntensityGreen', label: 'Blade Green Intensity', type: 'select', options: { '0': 'No Green', '3': 'Light', '5': 'Medium', '7': 'Dark' } },
            { id: 'bladePubescence', label: 'Blade Pubescence', type: 'select', options: { '1': 'Glabrous', '2': 'Intermediate', '3': 'Pubescent' } },
            { id: 'auricleColor', label: 'Auricle Color', type: 'select', options: { '0': 'Absent', '1': 'Whitish', '2': 'Yellowish Green', '3': 'Purple', '4': 'Light Purple', '5': 'Purple Lines' } },
            { id: 'collarColor', label: 'Collar Color', type: 'select', options: { '0': 'Absent', '1': 'Green', '2': 'Light Green', '3': 'Purple', '4': 'Purple Lines' } },
            { id: 'liguleShape', label: 'Ligule Shape', type: 'select', options: { '0': 'Absent', '1': 'Truncate', '2': 'Acute', '3': '2-Cleft' } },
            { id: 'liguleColor', label: 'Ligule Color', type: 'select', options: { '0': 'Absent', '1': 'Whitish', '2': 'Yellowish Green', '3': 'Purple', '4': 'Light Purple', '5': 'Purple Lines' } },
            { id: 'liguleLength', label: 'Ligule Length (mm)', type: 'number', step: '0.1' },
            { id: 'flagLeafAttitude', label: 'Flag Leaf Attitude', type: 'select', options: { '1': 'Erect', '3': 'Intermediate', '5': 'Horizontal', '7': 'Descending' } },
            { id: 'leafLength', label: 'Leaf Length (cm)', type: 'number', step: '0.1' },
            { id: 'leafWidth', label: 'Leaf Width (cm)', type: 'number', step: '0.1' },
            { id: 'culmHabitAngle', label: 'Culm Habit Angle', type: 'select', options: { '1': 'Erect', '3': 'Semi-erect', '5': 'Open', '7': 'Spreading', '9': 'Procumbent' } },
            { id: 'tillerCount', label: 'Tiller Count', type: 'number', step: '1' }
        ]
    },
    {
        id: 'grainQuality',
        name: '🍚 Grain Quality',
        description: 'Rice grain characteristics',
        parameters: [
            { id: 'grainLength', label: 'Grain Length (mm)', type: 'number', step: '0.1' },
            { id: 'grainWidth', label: 'Grain Width (mm)', type: 'number', step: '0.1' },
            { id: 'grainShape', label: 'Grain Shape', type: 'select', options: { '1': 'Slender', '2': 'Medium', '3': 'Bold', '4': 'Round' } },
            { id: 'grainColor', label: 'Grain Color', type: 'select', options: { '1': 'White', '2': 'Brown', '3': 'Red', '4': 'Black', '5': 'Purple' } },
            { id: 'chalkiness', label: 'Chalkiness (%)', type: 'number', step: '5' }
        ]
    },
    {
        id: 'pestDisease',
        name: '🐛 Pest & Disease Resistance',
        description: 'Resistance scoring',
        parameters: [
            { id: 'pestResistance', label: 'Pest Resistance Score', type: 'select', options: { '1': 'Highly Resistant', '2': 'Resistant', '3': 'Moderate', '4': 'Susceptible', '5': 'Highly Susceptible' } },
            { id: 'diseaseResistance', label: 'Disease Resistance Score', type: 'select', options: { '1': 'Highly Resistant', '2': 'Resistant', '3': 'Moderate', '4': 'Susceptible', '5': 'Highly Susceptible' } },
            { id: 'pestObserved', label: 'Pest Observed', type: 'text' },
            { id: 'diseaseObserved', label: 'Disease Observed', type: 'text' },
            { id: 'severity', label: 'Severity Score (1-10)', type: 'number', step: '1' }
        ]
    }
];

// Make available globally
window.availableTables = availableTables;
