// Dynamic Analytics View
import { store, subscribe } from '../data/store.js';

export function Analytics() {
    const div = document.createElement('div');
    div.className = 'view-analytics';

    function render() {
        // Dynamic values from store
        const riskScore = store.stats?.riskScore ?? 'N/A';
        const totalEmployees = store.stats?.totalEmployees ?? 0;
        const sentimentData = store.engagementSurveys?.length ?? 0;
        const biasLogs = store.biasLogs ?? [];

        div.innerHTML = `
            <header class="analytics-header">
                <div>
                    <h2 class="analytics-title">Analytics & Insights</h2>
                    <p class="analytics-subtitle">Predictive modeling and workforce trends.</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-export" onclick="window.showToast('Export not implemented', 'info')">Export Report</button>
                </div>
            </header>
            <div class="analytics-grid">
                <!-- Attrition Risk Model -->
                <div class="glass-panel risk-panel" style="padding: 24px;">
                    <div class="panel-header">
                        <h3 class="panel-title">Attrition Risk Prediction</h3>
                        <span class="priority-badge" style="background: #f1f5f9; color: #64748b;">${totalEmployees > 0 ? 'Data Available' : 'No Data'}</span>
                    </div>
                    <div class="chart-container" style="align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.9rem;">
                        ${totalEmployees > 0 ? `${riskScore}% Risk` : 'No predictive data available'}
                    </div>
                    <div class="axis-label" style="opacity: 0.5;">Risk Probability Score (%)</div>
                </div>
                <!-- Sentiment Grid -->
                <div class="glass-panel sentiment-panel" style="padding: 24px;">
                    <div class="panel-header" style="margin-bottom: 16px;">
                        <h3 class="panel-title">Pulse Sentiment Map</h3>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">Last 7 Days</div>
                    </div>
                    <div class="sentiment-grid" style="display: flex; align-items: center; justify-content: center; height: 160px; background: #f8fafc; border-radius: 8px; color: var(--text-muted);">
                        ${sentimentData > 0 ? `${sentimentData} responses` : 'Waiting for survey responses...'}
                    </div>
                    <div class="legend" style="opacity: 0.5;">
                        <div class="legend-item"><span class="legend-dot" style="background: #10b981;"></span>Positive</div>
                        <div class="legend-item"><span class="legend-dot" style="background: #818cf8;"></span>Neutral</div>
                        <div class="legend-item"><span class="legend-dot" style="background: #f43f5e;"></span>Needs Action</div>
                    </div>
                </div>
                <!-- Bias Detection -->
                <div class="glass-panel bias-panel" style="padding: 24px;">
                    <div class="bias-header">
                        <div class="icon-box">
                            <i data-lucide="shield-check" style="color: var(--primary);"></i>
                        </div>
                        <div>
                            <h3 class="panel-title">AI Bias Fairness Log</h3>
                            <p class="analytics-subtitle" style="font-size: 0.9rem;">Real-time audit of hiring and promotion decisions.</p>
                        </div>
                    </div>
                    <div class="bias-table-container">
                        <table class="bias-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Event Type</th>
                                    <th>Status</th>
                                    <th>Fairness Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${biasLogs.length === 0 ? `<tr><td colspan="4" style="text-align: center; padding: 32px; color: var(--text-muted);">No audit logs found.</td></tr>` : biasLogs.map(log => `
                                    <tr>
                                        <td>${log.date || '-'}</td>
                                        <td>${log.type || '-'}</td>
                                        <td>${log.status || '-'}</td>
                                        <td>${log.score ?? '-'}</td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }

    // Subscribe to store updates for live refresh
    subscribe(render);
    render();
    return div;
}
