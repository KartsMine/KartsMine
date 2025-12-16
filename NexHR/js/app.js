// Main Entry Point
import { Layout } from './components/Layout.js';
import { Chatbot } from './components/Chatbot.js';
import { Dashboard } from './views/Dashboard.js';
import { ATS } from './views/ATS.js';
import { Analytics } from './views/Analytics.js';
import { Onboarding } from './views/OnboardingV2.js';
import { Employees } from './views/Employees.js';
import { Training } from './views/Training.js';
import { Performance } from './views/Performance.js';
import { Engagement } from './views/Engagement.js';
import { Compensation } from './views/Compensation.js';
import './components/Toast.js'; // Global Toast Utility

// Simple Router State
const routes = {
    '/': Dashboard,
    '/ats': ATS,
    '/onboarding': Onboarding,
    '/analytics': Analytics,
    '/employees': Employees,
    '/training': Training,
    '/performance': Performance,
    '/engagement': Engagement,
    '/compensation': Compensation
};

const state = {
    currentPath: window.location.hash.slice(1) || '/'
};

function navigate(path) {
    window.location.hash = path;
    state.currentPath = path;
    render();
}

// Initial Render
function render() {
    const app = document.getElementById('app');

    // Clear and Setup Shell
    app.innerHTML = '';
    const layout = Layout();
    app.appendChild(layout);

    // Global Components
    app.appendChild(Chatbot());

    // Resolve View
    const hash = state.currentPath.split('?')[0]; // Simple hash parsing
    let ViewComponent = routes[hash];

    // Default to Dashboard if not found
    if (!ViewComponent) {
        ViewComponent = Dashboard;
    }

    // Render View into Layout's Main Content
    if (ViewComponent) {
        const viewNode = ViewComponent();
        layout.querySelector('#main-content').appendChild(viewNode);
    }

    // Re-trigger Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Handle Hash Change
window.addEventListener('hashchange', () => {
    state.currentPath = window.location.hash.slice(1) || '/';
    render();
});

// Start
render();
