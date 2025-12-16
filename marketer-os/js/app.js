import { Dashboard } from './components/Dashboard.js';
import { CampaignWizard } from './components/CampaignWizard.js';
import { CreativeStudio } from './components/CreativeStudio.js';
import { BrandDNA } from './components/BrandDNA.js';
import { GrowthHub } from './components/GrowthHub.js';
import { Calendar } from './components/Calendar.js';
import { CompetitorAnalysis } from './components/CompetitorAnalysis.js';
import { TrendDetector } from './components/TrendDetector.js';
import { BudgetOptimizer } from './components/BudgetOptimizer.js';

class App {
    constructor() {
        this.contentArea = document.getElementById('content-area');
        this.currentPage = 'dashboard';
        this.state = {
            apiKey: localStorage.getItem('marketer_api_key') || '',
            campaigns: []
        };

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSettings();
        this.render('dashboard');
    }

    setupNavigation() {
        // Sidebar Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.dataset.page;
                this.navigateTo(page);
            });
        });

        // Topbar Actions
        document.getElementById('new-campaign-btn').addEventListener('click', () => {
            this.navigateTo('wizard');
        });
    }

    setupSettings() {
        const modal = document.getElementById('settings-modal');
        const btn = document.getElementById('settings-btn');
        const close = document.getElementById('close-settings');
        const save = document.getElementById('save-settings');
        const input = document.getElementById('api-key');

        btn.addEventListener('click', () => {
            input.value = this.state.apiKey;
            modal.classList.remove('hidden');
        });

        close.addEventListener('click', () => modal.classList.add('hidden'));

        save.addEventListener('click', () => {
            this.state.apiKey = input.value;
            localStorage.setItem('marketer_api_key', input.value);
            modal.classList.add('hidden');
            alert('API Key Saved!');
        });
    }

    navigateTo(page) {
        // Update Active State
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });

        this.currentPage = page;
        this.render(page);
    }

    render(page) {
        this.contentArea.innerHTML = ''; // Clear content

        let component;
        switch (page) {
            case 'dashboard':
                component = Dashboard();
                document.getElementById('page-title').innerText = 'Dashboard';
                break;
            case 'wizard':
                component = CampaignWizard();
                document.getElementById('page-title').innerText = 'New Campaign';
                break;
            case 'studio':
                component = CreativeStudio();
                document.getElementById('page-title').innerText = 'Creative Studio';
                break;
            case 'growth':
                component = GrowthHub();
                document.getElementById('page-title').innerText = 'Growth Hub';
                break;
            case 'calendar':
                component = Calendar();
                document.getElementById('page-title').innerText = 'Content Calendar';
                break;
            case 'dna':
                component = BrandDNA();
                document.getElementById('page-title').innerText = 'Brand DNA';
                break;
            case 'competitors':
                component = CompetitorAnalysis();
                document.getElementById('page-title').innerText = 'Competitor Analysis';
                break;
            case 'trends':
                component = TrendDetector();
                document.getElementById('page-title').innerText = 'Trend Radar';
                break;
            case 'budget':
                component = BudgetOptimizer();
                document.getElementById('page-title').innerText = 'Budget Optimizer';
                break;
            default:
                component = Dashboard();
        }


        this.contentArea.appendChild(component);

        // Re-initialize icons for new content
        lucide.createIcons();
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    lucide.createIcons();
});
