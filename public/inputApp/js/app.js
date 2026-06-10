function riceDataApp() {
    const STORAGE_KEY = 'heirloom_rice_records';
    const DEFAULT_TRIAL_COUNT = 5;
    const MAX_TRIALS = 20;
    const MIN_TRIALS = 1;
    
    const loadRecords = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const saveRecords = (records) => localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    
    const urlParams = new URLSearchParams(window.location.search);
    const provinceFromUrl = urlParams.get('province') || '';
    
    const buildEmptyTrial = (params) => {
        const trial = {};
        params.forEach(param => { trial[param.id] = ''; });
        return trial;
    };
    
    const buildTrials = (count, params) => {
        return Array(count).fill().map(() => buildEmptyTrial(params));
    };
    
    return {
        currentProvince: provinceFromUrl,
        treatmentNo: '',
        landrace: '',
        editMode: false,
        editIndex: -1,
        isOnline: navigator.onLine,
        availableTables: window.availableTables,
        currentTableId: 'plantvigorandleaf',
        currentTableName: '🍃 Plant Vigor and Leaf Characters',
        currentParameters: [],
        trialCount: DEFAULT_TRIAL_COUNT,
        trials: [],
        records: loadRecords(),
        
        get parameters() { 
            return this.currentParameters;
        },
        
        isParamVisibleForTrial(param, trialIndex) {
            if (!param.dependsOn) return true;
            const controlParam = param.dependsOn.param;
            const requiredValue = param.dependsOn.value;
            const controlValue = this.trials[trialIndex]?.[controlParam];
            return controlValue === requiredValue;
        },
        
        get filteredRecords() {
            if (!this.currentProvince) return this.records;
            return this.records.filter(r => r.province === this.currentProvince);
        },
        
        changeTable() {
            const selectedTable = this.availableTables.find(t => t.id === this.currentTableId);
            if (selectedTable) {
                this.currentTableName = selectedTable.name;
                this.currentParameters = JSON.parse(JSON.stringify(selectedTable.parameters));
                this.trials = buildTrials(this.trialCount, this.currentParameters);
                this.saveDraft();
            }
        },
        
        onControlChange(controlParamId, trialIndex) {
            const dependentParams = this.currentParameters.filter(p => 
                p.dependsOn && p.dependsOn.param === controlParamId
            );
            if (dependentParams.length === 0) return;
            const controlValue = this.trials[trialIndex]?.[controlParamId];
            dependentParams.forEach(depParam => {
                if (controlValue !== depParam.dependsOn.value) {
                    this.trials[trialIndex][depParam.id] = '';
                }
            });
            this.saveDraft();
        },
        
        updateTrialValue(paramId, trialIndex) {
            let value = this.trials[trialIndex][paramId];
            if (value !== '' && !isNaN(value) && parseFloat(value) < 0) {
                this.trials[trialIndex][paramId] = 0;
            }
            this.saveDraft();
        },
        
        updateTrialCount() {
            let newCount = parseInt(this.trialCount);
            if (isNaN(newCount)) newCount = MIN_TRIALS;
            if (newCount < MIN_TRIALS) newCount = MIN_TRIALS;
            if (newCount > MAX_TRIALS) newCount = MAX_TRIALS;
            if (newCount === this.trials.length) return;

            const oldTrials = this.trials;
            const newTrials = [];
            for (let i = 0; i < newCount; i++) {
                newTrials.push(i < oldTrials.length ? oldTrials[i] : buildEmptyTrial(this.currentParameters));
            }
            this.trials = newTrials;
            this.trialCount = newCount;
            this.saveDraft();
        },

        incrementTrials() {
            let newCount = this.trialCount + 1;
            if (newCount <= MAX_TRIALS) {
                this.trialCount = newCount;
                this.updateTrialCount();
            }
        },

        decrementTrials() {
            let newCount = this.trialCount - 1;
            if (newCount >= MIN_TRIALS) {
                this.trialCount = newCount;
                this.updateTrialCount();
            }
        },
        
        saveDraft() {
            const draftKey = `rice_draft_${this.currentProvince || 'unknown'}_${this.currentTableId}`;
            const hasData = this.trials.some(trial => Object.values(trial).some(v => v !== '' && v !== null)) || this.treatmentNo || this.landrace;
            if (hasData) {
                localStorage.setItem(draftKey, JSON.stringify({
                    treatmentNo: this.treatmentNo,
                    landrace: this.landrace,
                    trialCount: this.trialCount,
                    tableId: this.currentTableId,
                    trials: this.trials
                }));
            }
        },
        
        loadDraft() {
            if (this.editMode) return;
            const draftKey = `rice_draft_${this.currentProvince || 'unknown'}_${this.currentTableId}`;
            const draft = JSON.parse(localStorage.getItem(draftKey));
            if (draft) {
                this.treatmentNo = draft.treatmentNo || '';
                this.landrace = draft.landrace || '';
                if (draft.trialCount) {
                    this.trialCount = draft.trialCount;
                    this.trials = draft.trials || buildTrials(this.trialCount, this.currentParameters);
                }
            }
        },
        
        clearDraft() {
            localStorage.removeItem(`rice_draft_${this.currentProvince || 'unknown'}_${this.currentTableId}`);
        },
        
        saveForm() {
            if (!this.treatmentNo || !this.landrace) {
                alert('Please fill in Block/Treatment No. and Landrace Name');
                return;
            }
            const record = {
                province: this.currentProvince,
                tableId: this.currentTableId,
                tableName: this.currentTableName,
                treatmentNo: this.treatmentNo,
                landrace: this.landrace,
                trialCount: this.trialCount,
                trials: JSON.parse(JSON.stringify(this.trials)),
                timestamp: Date.now()
            };
            if (this.editMode && this.editIndex >= 0) {
                this.records[this.editIndex] = record;
                alert('Record updated successfully!');
                this.cancelEdit();
            } else {
                this.records.push(record);
                alert('Data saved successfully!');
                this.resetForm();
            }
            saveRecords(this.records);
            this.clearDraft();
            this.records = loadRecords();
        },
        
        editForm(index) {
            const record = this.filteredRecords[index];
            if (!record) return;

            const actualIndex = this.records.findIndex(r => r.timestamp === record.timestamp);

            if (actualIndex !== -1) {
                this.editMode = true;
                this.editIndex = actualIndex;
                this.currentProvince = record.province;
                this.treatmentNo = record.treatmentNo;
                this.landrace = record.landrace;
                this.trialCount = record.trialCount || DEFAULT_TRIAL_COUNT;
                this.trials = JSON.parse(JSON.stringify(record.trials));

                if (record.tableId !== this.currentTableId) {
                    this.currentTableId = record.tableId;
                    this.changeTable();
                }
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        
        cancelEdit() {
            this.editMode = false;
            this.editIndex = -1;
            this.resetForm();
        },
        
        resetForm() {
            this.treatmentNo = '';
            this.landrace = '';
            this.trialCount = DEFAULT_TRIAL_COUNT;
            this.trials = buildTrials(DEFAULT_TRIAL_COUNT, this.currentParameters);
            if (this.currentProvince) this.loadDraft();
        },

        buildEmptyTrial(params) {
            const trial = {};
            params.forEach(param => { trial[param.id] = ''; });
            return trial;
        },
        
        init() {
            window.addEventListener('online', () => this.isOnline = true);
            window.addEventListener('offline', () => this.isOnline = false);
            this.changeTable();
            this.loadDraft();
            if (this.currentProvince) {
                document.title = `${this.currentProvince} - CAR Rice Collection`;
            }
        }
    };
}

function allRecordsApp() {
    const STORAGE_KEY = 'heirloom_rice_records';
    
    const loadRecords = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const saveRecords = (records) => localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    
    return {
        availableTables: window.availableTables,
        allRecords: [],
        filteredRecordsList: [],
        provinceFilter: '',
        tableFilter: '',
        
        get filteredRecords() {
            return this.filteredRecordsList;
        },
        
        filterRecords() {
            let filtered = [...this.allRecords];
            
            if (this.provinceFilter) {
                filtered = filtered.filter(r => r.province === this.provinceFilter);
            }
            
            if (this.tableFilter) {
                filtered = filtered.filter(r => r.tableId === this.tableFilter);
            }
            
            this.filteredRecordsList = filtered.map(record => ({
                ...record,
                formattedDate: new Date(record.timestamp).toLocaleDateString()
            }));
        },
        
        refreshRecords() {
            this.allRecords = loadRecords();
            this.filterRecords();
        },
        
        exportFilteredData() {
            if (this.filteredRecordsList.length === 0) {
                alert('No records to export.');
                return;
            }
            
            const recordsByTable = {};
            this.filteredRecordsList.forEach(record => {
                const tableId = record.tableId || 'unknown';
                if (!recordsByTable[tableId]) recordsByTable[tableId] = [];
                recordsByTable[tableId].push(record);
            });
            
            const today = new Date().toISOString().slice(0, 10);
            let filesCreated = 0;
            let fileList = [];
            
            for (const [tableId, tableRecords] of Object.entries(recordsByTable)) {
                const tableConfig = this.availableTables.find(t => t.id === tableId);
                const tableName = tableConfig?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || tableId;
                const fileName = `${tableName}_filtered_${today}.csv`;
                const tableParams = tableConfig?.parameters || [];
                const paramIds = tableParams.map(p => p.id);
                
                const headers = ['province', 'table_id', 'block_treatment_no', 'landrace_id', 'trial_number', 'record_date'];
                paramIds.forEach(paramId => {
                    headers.push(paramId.replace(/([A-Z])/g, '_$1').toLowerCase());
                });
                
                const csvRows = [headers.join(',')];
                
                tableRecords.forEach(record => {
                    const trialCount = record.trialCount || 5;
                    const recordDate = new Date(record.timestamp).toISOString().slice(0, 10);
                    
                    for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                        const row = [record.province, record.tableId, record.treatmentNo, record.landrace, trialIdx + 1, recordDate];
                        
                        paramIds.forEach(paramId => {
                            let value = record.trials[trialIdx]?.[paramId] || '';
                            const paramConfig = tableParams.find(p => p.id === paramId);
                            if (paramConfig?.type === 'select' && value && paramConfig.options[value]) {
                                value = `${value}-${paramConfig.options[value]}`;
                            }
                            row.push(value);
                        });
                        
                        csvRows.push(row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));
                    }
                });
                
                const csvContent = "\uFEFF" + csvRows.join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
                
                filesCreated++;
                fileList.push(fileName);
            }
            
            alert(`✅ Exported ${filesCreated} CSV file(s):\n\n${fileList.join('\n')}`);
        },
        
        exportSingleRecord(index) {
            const record = this.filteredRecordsList[index];
            if (!record) {
                alert('Record not found.');
                return;
            }
            
            const tableConfig = this.availableTables.find(t => t.id === record.tableId);
            if (!tableConfig) {
                alert('Table configuration not found.');
                return;
            }
            
            const tableName = tableConfig.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const today = new Date().toISOString().slice(0, 10);
            const fileName = `${tableName}_${record.landrace.replace(/\s+/g, '_')}_${today}.csv`;
            
            const tableParams = tableConfig.parameters;
            const paramIds = tableParams.map(p => p.id);
            
            const headers = ['province', 'table_id', 'block_treatment_no', 'landrace_id', 'trial_number', 'record_date'];
            paramIds.forEach(paramId => {
                headers.push(paramId.replace(/([A-Z])/g, '_$1').toLowerCase());
            });
            
            const csvRows = [headers.join(',')];
            const trialCount = record.trialCount || 5;
            const recordDate = new Date(record.timestamp).toISOString().slice(0, 10);
            
            for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                const row = [record.province, record.tableId, record.treatmentNo, record.landrace, trialIdx + 1, recordDate];
                
                paramIds.forEach(paramId => {
                    let value = record.trials[trialIdx]?.[paramId] || '';
                    const paramConfig = tableParams.find(p => p.id === paramId);
                    if (paramConfig?.type === 'select' && value && paramConfig.options[value]) {
                        value = `${value}-${paramConfig.options[value]}`;
                    }
                    row.push(value);
                });
                
                csvRows.push(row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));
            }
            
            const csvContent = "\uFEFF" + csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
            
            alert(`✅ Exported "${record.landrace}" to ${fileName}`);
        },
        
        deleteRecord(index) {
            const record = this.filteredRecordsList[index];
            const actualIndex = this.allRecords.findIndex(r => 
                r.province === record.province && 
                r.treatmentNo === record.treatmentNo && 
                r.landrace === record.landrace &&
                r.timestamp === record.timestamp
            );
            
            if (actualIndex !== -1 && confirm('Are you sure you want to delete this record?')) {
                const records = loadRecords();
                records.splice(actualIndex, 1);
                saveRecords(records);
                this.refreshRecords();
                alert('Record deleted successfully!');
            }
        },

        async uploadFilteredData(event) {
            if (this.filteredRecords.length === 0) {
                alert('No records to upload.');
                return;
            }
            if (!navigator.onLine) {
                alert('You are offline. Please connect to the internet and try again.');
                return;
            }
            
            const confirmed = confirm(`Upload ${this.filteredRecords.length} filtered record(s) to server?`);
            if (!confirmed) return;
        
            const PB_URL = window.location.origin;
            const pb = new PocketBase(PB_URL);
        
            const uploadData = [];
            for (const record of this.filteredRecords) {
                const trialCount = record.trialCount || 5;
                const tableConfig = this.availableTables.find(t => t.id === record.tableId);
                for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                    const agroParams = {};
                    if (tableConfig) {
                        for (const param of tableConfig.parameters) {
                            agroParams[param.id] = record.trials[trialIdx]?.[param.id] || '';
                        }
                    }
                    uploadData.push({
                        province: record.province,
                        table_id: record.tableId,
                        block_treatment_no: record.treatmentNo,
                        landrace_id: record.landrace,
                        trial_number: trialIdx + 1,
                        record_date: new Date(record.timestamp).toISOString(),
                        agro_params: agroParams
                    });
                }
            }
        
            const uploadBtn = event?.target?.closest?.('.export-btn');
            const originalText = uploadBtn ? uploadBtn.innerHTML : 'Upload';
            if (uploadBtn) {
                uploadBtn.innerHTML = '⏳ Uploading...';
                uploadBtn.disabled = true;
            }
        
            let successCount = 0;
            let failCount = 0;
            try {
                for (const record of uploadData) {
                    try {
                        await pb.collection('rice_data').create(record);
                        successCount++;
                    } catch (err) {
                        console.error('Failed to upload record:', record, err);
                        failCount++;
                    }
                }
                alert(`✅ Upload complete!\nSuccess: ${successCount}\nFailed: ${failCount}`);
            } catch (error) {
                console.error('Upload error:', error);
                alert('Upload failed. Please check your server address and try again.');
            } finally {
                if (uploadBtn) {
                    uploadBtn.innerHTML = originalText;
                    uploadBtn.disabled = false;
                }
            }
        },
        
        triggerImport() {
            document.getElementById('csvImportInput').click();
        },
        
        async importCSV(event) {
            const file = event.target.files[0];
            if (!file) return;
        
            if (!file.name.endsWith('.csv')) {
                alert('Please select a CSV file.');
                event.target.value = '';
                return;
            }
        
            const confirmed = confirm(`Import data from "${file.name}"? This will ADD records to your existing data.`);
            if (!confirmed) {
                event.target.value = '';
                return;
            }
        
            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvText = e.target.result;
                
                const importedRecords = await this.parseCSVToRecords(csvText, file.name);
                
                if (importedRecords.length === 0) {
                    alert('No valid records found in the CSV file.');
                    event.target.value = '';
                    return;
                }
        
                const existingRecords = this.allRecords;
                const mergedRecords = [...existingRecords, ...importedRecords];
                
                localStorage.setItem('heirloom_rice_records', JSON.stringify(mergedRecords));
                this.refreshRecords();
                
                alert(`✅ Successfully imported ${importedRecords.length} record(s) from "${file.name}".\nTotal records now: ${this.allRecords.length}`);
                
                event.target.value = '';
            };
            reader.onerror = () => {
                alert('Error reading file.');
                event.target.value = '';
            };
            reader.readAsText(file);
        },
        
        async parseCSVToRecords(csvText, fileName) {
            const lines = csvText.split('\n');
            if (lines.length < 2) {
                return [];
            }
            
            const headers = this.parseCSVRow(lines[0]);
            
            let tableId = null;
            let tableConfig = null;
            
            const fileNameMatch = fileName.match(/^(.+?)_\d{4}-\d{2}-\d{2}\.csv$/);
            if (fileNameMatch) {
                const tableNameFromFile = fileNameMatch[1];
                tableConfig = this.availableTables.find(t => 
                    t.name.toLowerCase().replace(/[^a-z0-9]/g, '_') === tableNameFromFile
                );
                if (tableConfig) {
                    tableId = tableConfig.id;
                }
            }
            
            if (!tableId) {
                for (const table of this.availableTables) {
                    const expectedParams = table.parameters.map(p => p.id.replace(/([A-Z])/g, '_$1').toLowerCase());
                    const matchCount = expectedParams.filter(p => headers.includes(p)).length;
                    if (matchCount >= 5) {
                        tableId = table.id;
                        tableConfig = table;
                        break;
                    }
                }
            }
            
            if (!tableId || !tableConfig) {
                alert(`Could not identify the table type for file: ${fileName}`);
                return [];
            }
            
            const provinceIdx = headers.indexOf('province');
            const treatmentIdx = headers.indexOf('block_treatment_no');
            const landraceIdx = headers.indexOf('landrace_id');
            const trialNumIdx = headers.indexOf('trial_number');
            const recordDateIdx = headers.indexOf('record_date');

    console.log('province index:', headers.indexOf('province'));
    console.log('block_treatment_no index:', headers.indexOf('block_treatment_no'));
    console.log('landrace_id index:', headers.indexOf('landrace_id'));
    console.log('trial_number index:', headers.indexOf('trial_number'));
            
            if (provinceIdx === -1 || treatmentIdx === -1 || landraceIdx === -1 || trialNumIdx === -1) {
                alert('CSV is missing required columns.');
                return [];
            }
            
            const sampleMap = new Map();
            
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                const values = this.parseCSVRow(lines[i]);
                if (values.length < headers.length) continue;
                
                const province = values[provinceIdx];
                const treatmentNo = values[treatmentIdx];
                const landrace = values[landraceIdx];
                const trialNumber = parseInt(values[trialNumIdx]);
                const recordDate = recordDateIdx !== -1 ? values[recordDateIdx] : new Date().toISOString().slice(0, 10);
                
                const sampleKey = `${province}|${treatmentNo}|${landrace}`;
                
                if (!sampleMap.has(sampleKey)) {
                    sampleMap.set(sampleKey, {
                        province: province,
                        treatmentNo: treatmentNo,
                        landrace: landrace,
                        tableId: tableId,
                        tableName: tableConfig.name,
                        trials: {},
                        trialCount: 0,
                        timestamp: new Date(recordDate).getTime() || Date.now()
                    });
                }
                
                const sample = sampleMap.get(sampleKey);
                
                const trialData = {};
                for (const param of tableConfig.parameters) {
                    const paramHeader = param.id.replace(/([A-Z])/g, '_$1').toLowerCase();
                    const paramIdx = headers.indexOf(paramHeader);
                    if (paramIdx !== -1 && values[paramIdx]) {
                        let value = values[paramIdx];
                        const match = value.match(/^(\d+)-/);
                        if (match) {
                            value = match[1];
                        }
                        trialData[param.id] = value;
                    } else {
                        trialData[param.id] = '';
                    }
                }
                
                sample.trials[trialNumber] = trialData;
                if (trialNumber > sample.trialCount) sample.trialCount = trialNumber;
            }
            
            const importedRecords = [];
            for (const sample of sampleMap.values()) {
                const trialsArray = [];
                for (let i = 1; i <= sample.trialCount; i++) {
                    trialsArray.push(sample.trials[i] || this.buildEmptyTrial(tableConfig.parameters));
                }
                
                importedRecords.push({
                    province: sample.province,
                    tableId: sample.tableId,
                    tableName: sample.tableName,
                    treatmentNo: sample.treatmentNo,
                    landrace: sample.landrace,
                    trialCount: sample.trialCount,
                    trials: trialsArray,
                    timestamp: sample.timestamp
                });
            }
            
            return importedRecords;
        },
        
        parseCSVRow(line) {
            const result = [];
            let inQuotes = false;
            let currentValue = '';
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            result.push(currentValue.trim());
            
            return result.map(v => v.replace(/^"|"$/g, ''));
        },
        
        buildEmptyTrial(params) {
            const trial = {};
            params.forEach(param => { trial[param.id] = ''; });
            return trial;
        },
        
        init() {
            this.refreshRecords();
            
            window.addEventListener('storage', () => {
                this.refreshRecords();
            });
        }
    };
}
