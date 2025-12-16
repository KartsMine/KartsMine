import { store } from '../data/store.js';

export function Dashboard() {
    const div = document.createElement('div');
    div.className = 'view-dashboard';

    // Header
    const header = `
        <header style="margin-bottom: 24px;">
            <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: #0f172a;">Welcome back, ${store.user.name.split(' ')[0]}</h2>
            <p style="color: var(--text-muted);">Here's what your AI Assistant found today.</p>
        </header>
    `;

    // Stats Grid
    const statsGrid = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
            ${statCard('Total Employees', store.stats.totalEmployees, 'users', '+12% vs last month')}
            ${statCard('Open Positions', store.stats.openPos, 'briefcase', 'Urgent: Snr Dev')}
            ${statCard('Retention Rate', store.stats.retention, 'activity', 'Top 10% in Industry')}
            ${statCard('Offer Acceptance', store.stats.offerAcceptance, 'check-circle', '2 Pending')}
        </div>
    `;

    // AI Section
    const aiSection = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
            <div class="glass-panel" style="padding: 24px;">
                <h3 style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <i data-lucide="sparkles" style="color: var(--secondary);"></i>
                    AI Recruit Recommendations
                </h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${store.candidates.length > 0
            ? store.candidates.slice(0, 3).map(candidateRow).join('')
            : '<div style="color:var(--text-muted); font-size:0.9rem; padding:12px;">No specific recommendations yet. Add candidates to the ATS.</div>'
        }
                </div>
                <button style="margin-top: 16px; width: 100%; padding: 12px; background: rgba(255,255,255,0.05); color: var(--text-muted); border-radius: 8px;">View All Candidates</button>
            </div>
        </div>
    `;

    div.innerHTML = header + statsGrid + aiSection;
    return div;
}

function statCard(label, value, icon, subtext) {
    return `
        <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: var(--text-muted); font-size: 0.9rem;">${label}</span>
                <i data-lucide="${icon}" style="color: var(--primary); width: 20px;"></i>
            </div>
            <div style="font-size: 2rem; font-weight: 700; margin-bottom: 4px; color: #0f172a;">${value}</div>
            <div style="font-size: 0.8rem; color: #10b981;">${subtext}</div>
        </div>
    `;
}

function candidateRow(c) {
    return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; background: #e0e7ff; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;">${c.name.charAt(0)}</div>
                <div>
                    <div style="font-weight: 600; font-size: 0.95rem; color: #0f172a;">${c.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${c.role}</div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700; color: var(--secondary);">${c.matchScore}% Match</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${c.status}</div>
            </div>
        </div>
    `;
}
