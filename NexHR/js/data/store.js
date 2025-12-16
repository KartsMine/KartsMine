// Persistent Store (LocalStorage)

const STORAGE_KEY = 'nexhr_data_v1';

// Initial Defaults (only used if nothing in storage)
const DEFAULTS = {
    user: {
        name: 'Admin User',
        role: 'Head of People'
    },
    candidates: [], // Start empty for user input
    employees: [], // New: Employee Directory
    performanceReviews: [], // New: Performance
    trainingPrograms: [], // New: Training
    compensationEvents: [], // New: Comp & Ben
    engagementSurveys: [], // New: Engagement
    leaveRequests: [], // New: Time Off
    settings: {
        apiKey: 'AIzaSyARpJCfs8Qp7eoXQh-58APyKmC7d6FZ0V8'
    },
    stats: {
        totalEmployees: 0,
        openPos: 0,
        retention: '-',
        offerAcceptance: '-'
    }
};

// Load from Storage
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};

    // Merge saved state with DEFAULTS to ensure all keys exist (schema migration)
    return {
        ...DEFAULTS,
        ...parsed,
        stats: { ...DEFAULTS.stats, ...(parsed.stats || {}) },
        settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) }
    };
}

// Global State Object
export const store = loadState();

// Simple Subscriber System for Reactivity
const listeners = [];
export function subscribe(fn) {
    listeners.push(fn);
}

function notify() {
    // Save to disk
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    // Tell views to update
    listeners.forEach(fn => fn());
}

// Actions
export const actions = {
    // Candidates
    addCandidate(candidate) {
        store.candidates = [
            ...store.candidates,
            {
                id: Date.now(),
                ...candidate,
                status: candidate.status || 'New',
                matchScore: Math.floor(Math.random() * 30) + 70
            }
        ];
        notify();
    },

    // Employees
    addEmployee(emp) {
        store.employees = [...store.employees, { id: Date.now(), ...emp }];
        store.stats.totalEmployees = store.employees.length;
        notify();
    },

    // Performance
    addPerformanceReview(review) {
        store.performanceReviews = [...store.performanceReviews, { id: Date.now(), ...review }];
        notify();
    },

    // Training
    assignTraining(training) {
        store.trainingPrograms = [...store.trainingPrograms, { id: Date.now(), ...training, status: 'In Progress', progress: 0 }];
        notify();
    },

    // Generic
    saveSettings(settings) {
        store.settings = { ...store.settings, ...settings };
        notify();
    },

    resetData() {
        localStorage.removeItem(STORAGE_KEY); // Hard clear storage
        window.location.reload(); // Reload to force fresh state from code defaults
    }
};

// Expose actions on window for console debugging if needed
window.nexhr = { store, actions };

