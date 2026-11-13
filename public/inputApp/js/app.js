const generateId = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

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
    
    const LOCATION_KEY = 'last_location';
    
    const saveLocation = (mun, brgy, lat, lng) => {
        localStorage.setItem(LOCATION_KEY, JSON.stringify({ municipality: mun, barangay: brgy, latitude: lat, longitude: lng }));
    };

    const loadLocation = () => {
        try {
            const data = JSON.parse(localStorage.getItem(LOCATION_KEY));
            return data || {};
        } catch { return {}; }
    };

    const clearLocationStorage = () => {
        localStorage.removeItem(LOCATION_KEY);
    };

    return {
        currentProvince: provinceFromUrl,
        municipality: '',
        barangay: '',
        latitude: '',
        longitude: '',
        treatmentNo: '',
        landrace: '',
        munSearch: '',
        barangaySearch: '',
        showMunDropdown: false,
        showBarangayDropdown: false,
        showSamplePrompt: false,
        lastSaveSummary: '',
        editMode: false,
        editIndex: -1,
        isOnline: navigator.onLine,
        availableTables: window.availableTables,
        collectionMode: 'stage',
        currentStage: 'vegetative',
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

        get stages() {
            return window.STAGES || [];
        },

        get currentSampleId() {
            const t = (this.treatmentNo || '').trim();
            const l = (this.landrace || '').trim();
            if (!t || !l) return '';
            return `${t}::${l}`;
        },

        get currentSampleLabel() {
            const t = (this.treatmentNo || '').trim();
            const l = (this.landrace || '').trim();
            if (!t || !l) return '(pending)';
            return `${t} / ${l}`;
        },

        get hasNextStage() {
            const sorted = [...(window.STAGES || [])].sort((a, b) => a.order - b.order);
            const idx = sorted.findIndex(s => s.id === this.currentStage);
            return idx >= 0 && idx < sorted.length - 1;
        },

        get filteredMunicipalities() {
            if (!this.municipalities.length) return [];
            if (!this.munSearch) return this.municipalities;
            const term = this.munSearch.toLowerCase();
            return this.municipalities.filter(mun => mun.toLowerCase().includes(term));
        },

        get filteredBarangays() {
            if (!this.barangays.length) return [];
            if (!this.barangaySearch) return this.barangays;
            const term = this.barangaySearch.toLowerCase();
            return this.barangays.filter(bgy => bgy.toLowerCase().includes(term));
        },

        get filteredRecords() {
            if (!this.currentProvince) return this.records;
            return this.records.filter(r => r.province === this.currentProvince);
        },

        get municipalities() {
            if (!this.currentProvince || !window.locationData) return [];
            const provinceData = window.locationData[this.currentProvince];
            return provinceData ? Object.keys(provinceData) : [];
        },

        get barangays() {
            if (!this.currentProvince || !this.municipality || !window.locationData) return [];
            const provinceData = window.locationData[this.currentProvince];
            if (!provinceData) return [];
            return provinceData[this.municipality] || [];
        },

        geoLocation() {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser.');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.latitude = position.coords.latitude.toFixed(6);
                    this.longitude = position.coords.longitude.toFixed(6);
                },
                (error) => {
                    alert('Unable to retrieve location: ' + error.message);
                },
                { enableHighAccuracy: true }
            );
        },

        selectMunicipality(mun) {
            this.municipality = mun;
            this.munSearch = mun;
            this.showMunDropdown = false;
            this.barangay = '';
            this.barangaySearch = '';
        },

        selectBarangay(bgy) {
            this.barangay = bgy;
            this.barangaySearch = bgy;
            this.showBarangayDropdown = false;
        },

        clearLocation() {
            this.municipality = '';
            this.barangay = '';
            this.latitude = '';
            this.longitude = '';
            this.munSearch = '';
            this.barangaySearch = '';
            clearLocationStorage();
        },
        
        rebuildParameters() {
            let params, title;
            if (this.collectionMode === 'stage') {
                params = this.availableTables
                    .flatMap(t => t.parameters)
                    .filter(p => p.stage === this.currentStage);
                title = (window.STAGES.find(s => s.id === this.currentStage)?.label) || this.currentStage;
            } else {
                const table = this.availableTables.find(t => t.id === this.currentTableId);
                params = table ? table.parameters : [];
                title = table ? table.name : '';
            }
            this.currentParameters = JSON.parse(JSON.stringify(params));
            this.currentTableName = title;
            this.trials = buildTrials(this.trialCount, this.currentParameters);
            if (!this.editMode) this.loadDraft();
        },

        changeTable() {
            this.rebuildParameters();
        },
        
        onCollectionModeChange() {
            this.rebuildParameters();
        },

        /*
        stageSpansMultipleTables() {
            return new Set(this.currentParameters.map(p => p.tableId)).size > 1;
        },
        */

        mergeTrials(existingTrials, newTrials, tableParams, overwriteIds) {
            const maxLen = Math.max(existingTrials?.length || 0, newTrials?.length || 0);
            const result = [];
            for (let i = 0; i < maxLen; i++) {
                const existing = existingTrials?.[i] || {};
                const incoming = newTrials?.[i];
                const hasIncoming = incoming !== undefined;
                const trial = {};
                for (const p of tableParams) {
                    trial[p.id] = (overwriteIds.has(p.id) && hasIncoming)
                        ? (incoming[p.id] ?? '')
                        : (existing[p.id] ?? '');
                }
                result.push(trial);
            }
            return result;
        },

        onControlChange(controlParamId, trialIndex) {
            const dependentParams = this.currentParameters.filter(p => 
                p.dependsOn && p.dependsOn.param === controlParamId
            );
            if (dependentParams.length > 0) {
                const controlValue = this.trials[trialIndex]?.[controlParamId];
                dependentParams.forEach(depParam => {
                    if (controlValue !== depParam.dependsOn.value) {
                        this.trials[trialIndex][depParam.id] = '';
                    }
                });
            }
            this.saveDraft();
        },
        
        // might produce a bug when text params are added to tables.js
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
        
        draftKey() {
            const suffix = this.collectionMode === 'stage'
                ? `stage_${this.currentStage}`
                : this.currentTableId;
            return `rice_draft_${this.currentProvince || 'unknown'}_${suffix}`;
        },
        
        saveDraft() {
            const hasData = this.trials.some(trial => Object.values(trial).some(v => v !== '' && v !== null))
                  || this.treatmentNo || this.landrace || this.municipality || this.barangay || this.latitude || this.longitude;
            if (hasData) {
                localStorage.setItem(this.draftKey(), JSON.stringify({
                    treatmentNo: this.treatmentNo,
                    landrace: this.landrace,
                    municipality: this.municipality,
                    barangay: this.barangay,
                    latitude: this.latitude,
                    longitude: this.longitude,
                    trialCount: this.trialCount,
                    collectionMode: this.collectionMode,
                    tableId: this.currentTableId,
                    stage: this.currentStage,
                    trials: this.trials
                }));
            }
        },

        loadDraft() {
            if (this.editMode) return;
            const draft = JSON.parse(localStorage.getItem(this.draftKey()));
            if (draft) {
                this.treatmentNo = draft.treatmentNo || '';
                this.landrace = draft.landrace || '';
                this.municipality = draft.municipality || '';
                this.barangay = draft.barangay || '';
                this.latitude = draft.latitude || '';
                this.longitude = draft.longitude || '';
                if (draft.trialCount) {
                    this.trialCount = draft.trialCount;
                    this.trials = draft.trials || buildTrials(this.trialCount, this.currentParameters);
                }
            }
        },
        
        clearDraft() {
            localStorage.removeItem(this.draftKey());
        },
        
        saveForm() {
            if (!this.treatmentNo || !this.landrace) {
                alert('Please fill in Block/Treatment No. and Landrace Name');
                return;
            }

            saveLocation(this.municipality, this.barangay, this.latitude, this.longitude);

            if (this.collectionMode === 'stage' && !this.editMode) {
                this.saveStageForm();
            } else {
                this.saveTableForm();
            }
        },

        saveTableForm() {
            const tableId = this.collectionMode === 'stage'
                ? this.currentParameters[0]?.tableId
                : this.currentTableId;
            const table = this.availableTables.find(t => t.id === tableId);

            const record = {
                recordId: generateId(),
                sampleId: this.currentSampleId,
                province: this.currentProvince,
                municipality: this.municipality,
                barangay: this.barangay,
                latitude: this.latitude,
                longitude: this.longitude,
                tableId: tableId,
                tableName: table ? table.name : this.currentTableName,
                treatmentNo: this.treatmentNo,
                landrace: this.landrace,
                trialCount: this.trialCount,
                trials: JSON.parse(JSON.stringify(this.trials)),
                timestamp: Date.now()
            };

            if (this.editMode && this.editIndex >= 0) {
                record.recordId = this.records[this.editIndex].recordId || record.recordId;
                this.records[this.editIndex] = record;
                alert('Record updated successfully!');
                this.clearDraft();
                this.cancelEdit();
            } else {
                this.records.push(record);
                alert('Data saved successfully!');
                this.clearDraft();
                this.resetForm();
            }
            saveRecords(this.records);
            this.records = loadRecords();
        },

        saveStageForm() {
            const byTable = {};
            for (const p of this.currentParameters) {
                if (!byTable[p.tableId]) byTable[p.tableId] = [];
                byTable[p.tableId].push(p);
            }
            
            const now = Date.now();
            let recordsSaved = 0;
            let recordsMerged = 0;
            
            for (const [tableId, stageParams] of Object.entries(byTable)) {
                const table = this.availableTables.find(t => t.id === tableId);
                if (!table) continue;
                
                const allTableParams = table.parameters;
                const stageParamIds = new Set(stageParams.map(p => p.id));
                
                const newTrials = [];
                for (let i = 0; i < this.trialCount; i++) {
                    const trial = {};
                    for (const p of allTableParams) {
                        trial[p.id] = stageParamIds.has(p.id) ? (this.trials[i]?.[p.id] ?? '') : '';
                    }
                    newTrials.push(trial);
                }
                
                const existingIdx = this.records.findIndex(
                    r => r.sampleId === this.currentSampleId && r.tableId === tableId
                );
                
                if (existingIdx >= 0) {
                    const existing = this.records[existingIdx];
                    const mergedTrials = this.mergeTrials(existing.trials, newTrials, allTableParams, stageParamIds);
                    this.records[existingIdx] = {
                        ...existing,
                        municipality: this.municipality || existing.municipality,
                        barangay: this.barangay || existing.barangay,
                        latitude: this.latitude || existing.latitude,
                        longitude: this.longitude || existing.longitude,
                        treatmentNo: this.treatmentNo,
                        landrace: this.landrace,
                        trialCount: mergedTrials.length,
                        trials: mergedTrials,
                        timestamp: now
                    };
                    recordsMerged++;
                } else {
                    this.records.push({
                        recordId: generateId(),
                        sampleId: this.currentSampleId,
                        province: this.currentProvince,
                        municipality: this.municipality,
                        barangay: this.barangay,
                        latitude: this.latitude,
                        longitude: this.longitude,
                        tableId: tableId,
                        tableName: table.name,
                        treatmentNo: this.treatmentNo,
                        landrace: this.landrace,
                        trialCount: newTrials.length,
                        trials: newTrials,
                        timestamp: now
                    });
                    recordsSaved++;
                }
            }
            
            saveRecords(this.records);
            this.records = loadRecords();
            this.clearDraft();
            const parts = [];
            if (recordsSaved) parts.push(`${recordsSaved} new`);
            if (recordsMerged) parts.push(`${recordsMerged} merged`);
            this.lastSaveSummary = parts.join(', ') || '0';
            this.showSamplePrompt = true;
        },
        
        editForm(index) {
            const record = this.filteredRecords[index];
            if (!record) {
               alert('Record not found');
               return;
            }

            this.collectionMode = 'table';
            const actualIndex = this.records.findIndex(r =>
                (r.recordId && r.recordId === record.recordId) ||
                (!r.recordId && r.timestamp === record.timestamp &&
                    r.treatmentNo === record.treatmentNo &&
                    r.landrace === record.landrace)
            );

            if (actualIndex !== -1) {
                const fullRecord = this.records[actualIndex];
                this.currentTableId = fullRecord.tableId;
                this.editMode = true;
                this.editIndex = actualIndex;
                this.rebuildParameters();

                this.currentProvince = fullRecord.province;
                this.treatmentNo = fullRecord.treatmentNo;
                this.landrace = fullRecord.landrace;
                this.trialCount = fullRecord.trialCount || DEFAULT_TRIAL_COUNT;
                this.trials = JSON.parse(JSON.stringify(fullRecord.trials));

                this.municipality = fullRecord.municipality || '';
                this.barangay = fullRecord.barangay || '';
                this.latitude = fullRecord.latitude || '';
                this.longitude = fullRecord.longitude || '';

                saveLocation(this.municipality, this.barangay, this.latitude, this.longitude);
            }

            window.scrollTo({ top: 20, behavior: 'smooth' });
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

        startNewSample() {
            this.showSamplePrompt = false;
            this.treatmentNo = '';
            this.landrace = '';
            this.trialCount = DEFAULT_TRIAL_COUNT;
            this.trials = buildTrials(DEFAULT_TRIAL_COUNT, this.currentParameters);
            this.clearDraft();
        },

        confirmNewSample() {
            this.startNewSample();
        },

        closeSamplePrompt() {
            this.showSamplePrompt = false;
        },

        continueCurrentSample() {
            this.showSamplePrompt = false;
            const sorted = [...(window.STAGES || [])].sort((a, b) => a.order - b.order);
            const idx = sorted.findIndex(s => s.id === this.currentStage);
            const next = idx >= 0 ? sorted[idx + 1] : null;
            if (next) {
                this.currentStage = next.id;
            }
            const draft = JSON.parse(localStorage.getItem(this.draftKey()));
            if (draft) {
                const draftMatches =
                    (draft.sampleId && draft.sampleId === this.currentSampleId) ||
                    (draft.treatmentNo === this.treatmentNo &&
                     draft.landrace === this.landrace &&
                     draft.treatmentNo && draft.landrace);
                if (!draftMatches) this.clearDraft();
            }
            this.rebuildParameters();
            if (!localStorage.getItem(this.draftKey())) {
                this.trials = buildTrials(this.trialCount, this.currentParameters);
            }
            window.scrollTo({ top: 20, behavior: 'smooth'});
        },

        init() {
            window.addEventListener('online', () => this.isOnline = true);
            window.addEventListener('offline', () => this.isOnline = false);
            this.rebuildParameters();
            this.loadDraft();

            if (!this.municipality && !this.barangay && !this.latitude && !this.longitude) {
                const last = loadLocation();
                this.municipality = last.municipality || '';
                this.barangay = last.barangay || '';
                this.latitude = last.latitude || '';
                this.longitude = last.longitude || '';
            }

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

    const SUPABASE_URL = window.SUPABASE_URL || '';
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

    let supabase;
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
        console.warn('Supabase client could not be initialised. Offline features will still work.', e);
        supabase = null;
    }
    
    return {
        availableTables: window.availableTables,
        allRecords: [],
        filteredRecordsList: [],
        provinceFilter: '',
        municipalityFilter: '',
        barangayFilter: '',
        tableFilter: '',
        provinceSearch: '',
        municipalitySearch: '',
        barangaySearch: '',
        showProvinceDropdown: false,
        showMunicipalityDropdown: false,
        showBarangayDropdown: false,
        showLoginModal: false,
        pendingUploadData: null,
        pendingUploadBtn: null,
        
        get filteredRecords() {
            return this.filteredRecordsList;
        },

        get filteredProvinces() {
            if (!window.locationData) return [];
            const provinces = Object.keys(window.locationData);
            if (!this.provinceSearch) return provinces;
            const term = this.provinceSearch.toLowerCase();
            return provinces.filter(p => p.toLowerCase().includes(term));
        },

        get filteredMunicipalities() {
            if (!this.provinceFilter || !window.locationData) return [];
            const provinceData = window.locationData[this.provinceFilter];
            if (!provinceData) return [];
            const muns = Object.keys(provinceData);
            if (!this.municipalitySearch) return muns;
            const term = this.municipalitySearch.toLowerCase();
            return muns.filter(m => m.toLowerCase().includes(term));
        },
        
        get filteredBarangays() {
            if (!this.provinceFilter || !this.municipalityFilter || !window.locationData) return [];
            const provinceData = window.locationData[this.provinceFilter];
            if (!provinceData) return [];
            const barangays = provinceData[this.municipalityFilter] || [];
            if (!this.barangaySearch) return barangays;
            const term = this.barangaySearch.toLowerCase();
            return barangays.filter(b => b.toLowerCase().includes(term));
        },
        
        selectProvince(province) {
            this.provinceFilter = province;
            this.provinceSearch = province;
            this.showProvinceDropdown = false;
            this.municipalityFilter = '';
            this.barangayFilter = '';
            this.municipalitySearch = '';
            this.barangaySearch = '';
            this.filterRecords();
        },

        selectMunicipality(mun) {
            this.municipalityFilter = mun;
            this.municipalitySearch = mun;
            this.showMunicipalityDropdown = false;
            this.barangayFilter = '';
            this.barangaySearch = '';
            this.filterRecords();
        },

        selectBarangay(bgy) {
            this.barangayFilter = bgy;
            this.barangaySearch = bgy;
            this.showBarangayDropdown = false;
            this.filterRecords();
        },

        filterRecords() {
            let filtered = [...this.allRecords];
            
            if (this.provinceFilter) {
                filtered = filtered.filter(r => r.province === this.provinceFilter);
            }

            if (this.municipalityFilter) {
                filtered = filtered.filter(r => r.municipality === this.municipalityFilter);
            }

            if (this.barangayFilter) {
                filtered = filtered.filter(r => r.barangay === this.barangayFilter);
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
                
                const headers = ['province', 'table_id', 'block_treatment_no', 'landrace_id', 'trial_number', 'record_date', 'sample_id'];
                paramIds.forEach(paramId => {
                    headers.push(paramId.replace(/([A-Z])/g, '_$1').toLowerCase());
                });
                
                const csvRows = [headers.join(',')];
                
                tableRecords.forEach(record => {
                    const trialCount = record.trialCount || 5;
                    const recordDate = new Date(record.timestamp).toISOString().slice(0, 10);
                    
                    for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                        const row = [record.province, record.tableId, record.treatmentNo, record.landrace, trialIdx + 1, recordDate, record.sampleId || `${record.treatmentNo}::${record.landrace}`];
                        
                        paramIds.forEach(paramId => {
                            let value = record.trials[trialIdx]?.[paramId] || '';
                            const paramConfig = tableParams.find(p => p.id === paramId);
                            if (paramConfig?.type === 'select' && value && paramConfig.options[value]) {
                                value = paramConfig.options[value];
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
            
            const headers = ['province', 'table_id', 'block_treatment_no', 'landrace_id', 'trial_number', 'record_date', 'sample_id'];
            paramIds.forEach(paramId => {
                headers.push(paramId.replace(/([A-Z])/g, '_$1').toLowerCase());
            });
            
            const csvRows = [headers.join(',')];
            const trialCount = record.trialCount || 5;
            const recordDate = new Date(record.timestamp).toISOString().slice(0, 10);
            
            for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                const row = [record.province, record.tableId, record.treatmentNo, record.landrace, trialIdx + 1, recordDate, record.sampleId || `${record.treatmentNo}::${record.landrace}`];
                
                paramIds.forEach(paramId => {
                    let value = record.trials[trialIdx]?.[paramId] || '';
                    const paramConfig = tableParams.find(p => p.id === paramId);
                    if (paramConfig?.type === 'select' && value && paramConfig.options[value]) {
                        value = paramConfig.options[value];
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

        isAuthenticated: false,
        authToken: null,
        
        async loginToSupabase(email, password) {
            if (!supabase) {
                console.warn('Supabase client not initialised, cannot login.');
                return false;
            }
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('Login failed:', error);
                return false;
            }
            this.isAuthenticated = true;
            this.authToken = data.session.access_token;
            return true;
        },
        
        async submitLogin(event) {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }
            
            const success = await this.loginToSupabase(email, password);
            
            if (success) {
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
                this.showLoginModal = false;
                if (this.pendingUploadData) {
                    await this.performUpload(this.pendingUploadData, this.pendingUploadBtn);
                    this.pendingUploadData = null;
                    this.pendingUploadBtn = null;
                }
            } else {
                alert('Login failed. Please check your credentials.');
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
            
            if (!this.isAuthenticated) {
                this.pendingUploadData = this.filteredRecords;
                this.pendingUploadBtn = event?.target?.closest?.('.export-btn');
                this.showLoginModal = true;
                return;
            }
            
            this.performUpload(this.filteredRecords, event?.target?.closest?.('.export-btn'));
        },
        
        async performUpload(records, uploadBtn) {
            if (!supabase) {
                alert('Upload unavailable: Supabase client not initialised. Please check your connection.');
                return;
            }
            const uploadData = [];
            for (const record of records) {
                const trialCount = record.trialCount || 5;
                const tableConfig = this.availableTables.find(t => t.id === record.tableId);
                for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                    const agroParams = {};
                    if (tableConfig) {
                        for (const param of tableConfig.parameters) {
                            let rawValue = record.trials[trialIdx]?.[param.id] || '';
                            if (param.type === 'select' && rawValue && param.options[rawValue]) {
                                agroParams[param.id] = param.options[rawValue];
                            } else {
                                agroParams[param.id] = rawValue;
                            }
                        }
                    }
                    uploadData.push({
                        province: record.province,
                        municipality: record.municipality,
                        barangay: record.barangay,
                        latitude: record.latitude ? parseFloat(record.latitude) : null,
                        longitude: record.longitude ? parseFloat(record.longitude) : null,
                        table_id: record.tableId,
                        block_treatment_no: record.treatmentNo,
                        landrace_id: record.landrace,
                        trial_number: trialIdx + 1,
                        record_date: new Date(record.timestamp).toISOString(),
                        agro_params: agroParams
                    });
                }
            }
            
            const originalText = uploadBtn ? uploadBtn.innerHTML : 'Upload';
            if (uploadBtn) {
                uploadBtn.innerHTML = '⏳ Uploading...';
                uploadBtn.disabled = true;
            }
            
            let successCount = 0;
            let failCount = 0;
            try {
                for (const record of uploadData) {
                    const { error } = await supabase.from('rice_data').insert(record);
                    if (error) {
                        console.error('Insert failed:', error);
                        failCount++;
                    } else {
                        successCount++;
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

        async uploadSingleRecord(index) {
            const record = this.filteredRecordsList[index];
            if (!record) {
                alert('Record not found.');
                return;
            }
            
            if (!navigator.onLine) {
                alert('You are offline. Please connect to the internet and try again.');
                return;
            }
            
            if (!this.isAuthenticated) {
                this.pendingUploadData = [record];
                this.pendingUploadBtn = null;
                this.showLoginModal = true;
                return;
            }
            
            await this.performSingleUpload(record);
        },
        
        async performSingleUpload(record) {
            if (!supabase) {
                alert('Upload unavailable: Supabase client not initialised. Please check your connection.');
                return;
            }
            const trialCount = record.trialCount || 5;
            const tableConfig = this.availableTables.find(t => t.id === record.tableId);
            
            const uploadData = [];
            for (let trialIdx = 0; trialIdx < trialCount; trialIdx++) {
                const agroParams = {};
                if (tableConfig) {
                    for (const param of tableConfig.parameters) {
                        let rawValue = record.trials[trialIdx]?.[param.id] || '';
                        if (param.type === 'select' && rawValue && param.options[rawValue]) {
                            agroParams[param.id] = param.options[rawValue];
                        } else {
                            agroParams[param.id] = rawValue;
                        }
                    }
                }
                uploadData.push({
                    province: record.province,
                    municipality: record.municipality,
                    barangay: record.barangay,
                    latitude: record.latitude ? parseFloat(record.latitude) : null,
                    longitude: record.longitude ? parseFloat(record.longitude) : null,
                    table_id: record.tableId,
                    block_treatment_no: record.treatmentNo,
                    landrace_id: record.landrace,
                    trial_number: trialIdx + 1,
                    record_date: new Date(record.timestamp).toISOString(),
                    agro_params: agroParams
                });
            }
            
            let successCount = 0;
            let failCount = 0;
            
            for (const data of uploadData) {
                const { error } = await supabase.from('rice_data').insert(data);
                if (error) {
                    console.error('Failed to upload trial:', error);
                    failCount++;
                } else {
                    successCount++;
                }
            }
            
            if (failCount === 0) {
                alert(`✅ Successfully uploaded "${record.landrace}" (${successCount} trials)`);
            } else {
                alert(`⚠️ Uploaded ${successCount} of ${uploadData.length} trials. ${failCount} failed.`);
            }
        },
        
        triggerImport() {
            document.getElementById('csvImportInput').click();
        },
        
        async importCSV(event) {
            const files = event.target.files;
            if (!files || files.length === 0) return;
            
            const confirmed = confirm(`Import ${files.length} CSV file(s)? This will ADD records to your existing data.`);
            if (!confirmed) {
                event.target.value = '';
                return;
            }
            
            let totalImported = 0;
            let totalFailed = 0;
            
            for (const file of Array.from(files)) {
                if (!file.name.endsWith('.csv')) {
                    console.warn(`Skipping "${file.name}": Not a CSV file.`);
                    totalFailed++;
                    continue;
                }
                
                const text = await file.text();
                const importedRecords = await this.parseCSVToRecords(text, file.name);
                
                if (importedRecords.length === 0) {
                    console.warn(`No valid records found in "${file.name}".`);
                    totalFailed++;
                    continue;
                }
                
                const existingRecords = this.allRecords;
                const mergedRecords = [...existingRecords, ...importedRecords];
                localStorage.setItem('heirloom_rice_records', JSON.stringify(mergedRecords));
                this.refreshRecords();
                
                totalImported += importedRecords.length;
                console.log(`✅ Imported ${importedRecords.length} record(s) from "${file.name}".`);
            }
            
            alert(`📊 Import complete!\nSuccess: ${totalImported} records from ${files.length - totalFailed} file(s)\nFailed: ${totalFailed} file(s)`);
            
            event.target.value = '';
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
            const sampleIdIdx = headers.indexOf('sample_id');

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
                        sampleId: (sampleIdIdx !== -1 && values[sampleIdIdx]) || `${treatmentNo}::${landrace}`,
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
                    recordId: generateId(),
                    sampleId: sample.sampleId,
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
        
        
        deleteRecord(index) {
            const record = this.filteredRecordsList[index];
            const actualIndex = this.allRecords.findIndex(r => 
                (r.recordId && r.recordId === record.recordId) ||
                (!r.recordId && r.province === record.province &&
                    r.province === record.province &&
                    r.treatmentNo === record.treatmentNo &&
                    r.landrace === record.landrace &&
                    r.timestamp === record.timestamp)
            );
            
            if (actualIndex !== -1 && confirm('Are you sure you want to delete this record?')) {
                const records = loadRecords();
                records.splice(actualIndex, 1);
                saveRecords(records);
                this.refreshRecords();
                alert('Record deleted successfully!');
            }
        },

        deleteFilteredData() {
            if (this.filteredRecordsList.length === 0) {
                alert('No records to delete.');
                return;
            }
            
            const countToDelete = this.filteredRecordsList.length;
            
            const confirmed = confirm(`⚠️ WARNING: You are about to delete ${countToDelete} record(s).\n\nThis action cannot be undone!`);
            
            if (!confirmed) return;
            
            const userInput = prompt(`Type "DELETE" to confirm:`);
            if (userInput !== 'DELETE') {
                alert('Deletion cancelled.');
                return;
            }
            
            const recordIds = new Set(
                this.filteredRecordsList.map(r => r.recordId).filter(Boolean)
            );
            const legacyTimestamps = new Set(
                this.filteredRecordsList.filter(r => !r.recordId).map(r => r.timestamp)
            );
            const remainingRecords = this.allRecords.filter(r =>
                (r.recordId && !recordIds.has(r.recordId)) ||
                (!r.recordId && !legacyTimestamps.has(r.timestamp))
            );
            
            localStorage.setItem('heirloom_rice_records', JSON.stringify(remainingRecords));
            
            this.refreshRecords();
            
            alert(`✅ Successfully deleted ${countToDelete} record(s).`);
        },

        clearAllFilters() {
            this.provinceFilter = '';
            this.municipalityFilter = '';
            this.barangayFilter = '';
            this.tableFilter = '';
            this.provinceSearch = '';
            this.municipalitySearch = '';
            this.barangaySearch = '';
            this.filterRecords();
        },

        init() {
            this.refreshRecords();

            this.$watch('provinceFilter', () => {
                this.municipalityFilter = '';
                this.barangayFilter = '';
                this.filterRecords();
            });

            this.$watch('municipalityFilter', () => {
                this.barangayFilter = '';
                this.filterRecords();
            });

            window.addEventListener('storage', () => {
                this.refreshRecords();
            });
        }
    };
}
