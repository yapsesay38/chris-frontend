// js/app.js - Main application logic (UPDATED)
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
        // State
        currentProvince: provinceFromUrl,
        treatmentNo: '',
        landrace: '',
        editMode: false,
        editIndex: -1,
        isOnline: navigator.onLine,
        availableTables: window.availableTables,
        currentTableId: 'plantvigorandleaf',
        currentTableName: '🌾 Plant Vigor and Leaf Characters',
        currentParameters: [],
        trialCount: DEFAULT_TRIAL_COUNT,
        trials: [],
        records: loadRecords(),
        
        get parameters() { 
            // Return ALL parameters - no filtering
            // We'll handle visibility in the template instead
            return this.currentParameters;
        },
        
        // NEW: Check if a parameter should be visible for a specific trial
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
        
        // Handle when a controlling parameter changes
        onControlChange(controlParamId, trialIndex) {
            // Find parameters that depend on this control
            const dependentParams = this.currentParameters.filter(p => 
                p.dependsOn && p.dependsOn.param === controlParamId
            );
            
            if (dependentParams.length === 0) return;
            
            // For dependent parameters, clear their values if the condition is no longer met
            const controlValue = this.trials[trialIndex]?.[controlParamId];
            dependentParams.forEach(depParam => {
                if (controlValue !== depParam.dependsOn.value) {
                    // Clear the dependent parameter value (keeps the field in data structure, but empty)
                    this.trials[trialIndex][depParam.id] = '';
                }
            });
            
            this.saveDraft();
        },
        
        updateTrialValue(paramId, trialIndex) {
            // Get the value and ensure it's not negative
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
        
        saveRecord() {
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
        
        editRecord(index) {
            const record = this.records[index];
            if (record.tableId !== this.currentTableId) {
                this.currentTableId = record.tableId;
                this.changeTable();
            }
            this.editMode = true;
            this.editIndex = index;
            this.currentProvince = record.province;
            this.treatmentNo = record.treatmentNo;
            this.landrace = record.landrace;
            this.trialCount = record.trialCount || DEFAULT_TRIAL_COUNT;
            this.trials = JSON.parse(JSON.stringify(record.trials));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        
        deleteRecord(index) {
            if (confirm('Are you sure you want to delete this record?')) {
                this.records.splice(index, 1);
                saveRecords(this.records);
                this.records = loadRecords();
            }
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
        
        exportToCSV() {
            if (this.records.length === 0) {
                alert('No records to export.');
                return;
            }
            
            const recordsByTable = {};
            this.records.forEach(record => {
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
                const fileName = `${tableName}_${today}.csv`;
                const tableParams = tableConfig?.parameters || [];
                const paramIds = tableParams.map(p => p.id);
                
                const headers = ['province', 'block_treatment_no', 'sample_id', 'trial_number', 'record_date'];
                paramIds.forEach(paramId => {
                    headers.push(paramId.replace(/([A-Z])/g, '_$1').toLowerCase());
                });
                
                const csvRows = [headers.join(',')];
                
                tableRecords.forEach(record => {
                    const trialCount = record.trialCount || 5;
                    const recordDate = new Date(record.timestamp).toISOString().slice(0, 10);
                    
                    for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                        const row = [record.province, record.treatmentNo, record.landrace, trialIdx + 1, recordDate];
                        
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
        
        async uploadToServer() {
            if (this.records.length === 0) {
                alert('No records to upload.');
                return;
            }

            if (!navigator.onLine) {
                alert('You are offline. Please connect to the internet and try again.');
                return;
            }

            // Confirm with user
            const confirmed = confirm(`Upload ${this.records.length} record(s) to server?`);
            if (!confirmed) return;

            // Initialize PocketBase client
            // Change URL to your PocketBase server address
            const PB_URL = 'http://localhost:8090'; // Update to your server URL
            const pb = new PocketBase(PB_URL);

            // Prepare data: convert each record into trial rows
            const uploadData = [];
    
            for (const record of this.records) {
                const trialCount = record.trialCount || 5;
                const tableConfig = this.availableTables.find(t => t.id === record.tableId);
        
                for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                    const row = {
                        province: record.province,
                        table_id: record.tableId,
                        treatment_no: record.treatmentNo,
                        sample_id: record.landrace,
                        trial_number: trialIdx + 1,
                        recorded_at: new Date(record.timestamp).toISOString()
                    };
            
                    // Add each parameter value
                    if (tableConfig) {
                        for (const param of tableConfig.parameters) {
                            let value = record.trials[trialIdx]?.[param.id] || '';
                            // For select options, store the code (not the description)
                            if (param.type === 'select' && value && param.options[value]) {
                                // Keep the code as is; PocketBase will store the code.
                            }
                            row[param.id] = value;
                        }
                    }
                    uploadData.push(row);
                }
            }

            // Show uploading indicator
            const uploadBtn = event?.target?.closest?.('.export-btn');
            const originalText = uploadBtn ? uploadBtn.innerHTML : 'Upload';
            if (uploadBtn) {
                uploadBtn.innerHTML = '⏳ Uploading...';
                uploadBtn.disabled = true;
            }

            let successCount = 0;
            let failCount = 0;

            try {
                // Send records one by one (or batch if you prefer)
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
