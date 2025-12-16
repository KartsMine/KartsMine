import { AIService, AIPersonas } from '../ai.js';

export const TrendDetector = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';
    container.innerHTML = `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2><i data-lucide="${AIPersonas.ANALYST.icon}"></i> Use Trend Radar</h2>
                <button class="btn-secondary" id="refresh-trends"><i data-lucide="refresh-cw"></i> Refresh</button>
            </div>
            <p class="text-muted">Real-time market signals and emerging topics.</p>
            
            <div id="trend-grid" class="grid-3" style="margin-top: 2rem;">
                <!-- Trends Injected Here -->
            </div>
        </div>
    `;

    const loadTrends = async () => {
        const grid = container.querySelector('#trend-grid');
        grid.innerHTML = `<div style="grid-column: span 3; text-align: center;"><i data-lucide="loader-2" class="spin"></i> Scanning global data...</div>`;
        lucide.createIcons();

        const trends = await AIService.detectTrends();

        grid.innerHTML = trends.map(t => `
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-glass);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">${t.category}</span>
                    <span style="color: var(--success); font-weight: bold;">${t.growth}</span>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${t.name}</h3>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: ${t.sentiment === 'Positive' ? 'var(--success)' : 'var(--warning)'};"></span>
                    <span style="font-size: 0.9rem;">${t.sentiment} Sentiment</span>
                </div>
            </div>
        `).join('');
    };

    setTimeout(() => {
        loadTrends();
        container.querySelector('#refresh-trends').addEventListener('click', loadTrends);
    }, 0);

    return container;
};
