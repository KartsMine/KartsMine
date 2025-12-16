import { store, actions, subscribe } from '../data/store.js';

export function Performance() {
    const div = document.createElement('div');
    div.className = 'view-performance';

    function render() {
        const reviews = store.performanceReviews || [];

        const avgRating = reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
            : '0.0';

        div.innerHTML = `
             <header style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a;">Performance Management</h2>
                    <p style="color: var(--text-muted); margin-top: 4px;">Continuous feedback and quarterly reviews.</p>
                </div>
                <button id="btn-log-review" style="padding: 10px 16px; background: white; border: 1px solid #e2e8f0; color: #0f172a; border-radius: 8px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="clipboard-list"></i> Log Review
                </button>
            </header>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <div class="glass-panel" style="padding: 20px; background: white; border: 1px solid #e2e8f0;">
                    <div style="color: #64748b; font-size: 0.9rem; font-weight: 500;">Reviews Completed</div>
                    <div style="font-size: 2rem; font-weight: 700; color: #0f172a;">${reviews.length}</div>
                </div>
                <div class="glass-panel" style="padding: 20px; background: white; border: 1px solid #e2e8f0;">
                    <div style="color: #64748b; font-size: 0.9rem; font-weight: 500;">Avg Rating</div>
                    <div style="font-size: 2rem; font-weight: 700; color: #0f172a;">${avgRating}</div>
                </div>
                <div class="glass-panel" style="padding: 20px; background: white; border: 1px solid #e2e8f0;">
                    <div style="color: #64748b; font-size: 0.9rem; font-weight: 500;">Scheduled</div>
                    <div style="font-size: 2rem; font-weight: 700; color: #0f172a;">0</div>
                </div>
            </div>

            <div class="glass-panel" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <h3 style="padding: 20px; border-bottom: 1px solid #e2e8f0; font-size: 1.1rem; font-weight: 700; margin: 0; color: #0f172a;">Recent Reviews</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: #f1f5f9; text-align: left; border-bottom: 1px solid #e2e8f0;">
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Employee</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Review Type</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Date</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Rating</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reviews.length === 0 ? `
                            <tr><td colspan="5" style="padding: 40px; text-align: center; color: var(--text-muted);">No reviews logged.</td></tr>
                        ` : reviews.map(r => `
                             <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 16px; font-weight: 500; color: #0f172a;">${r.employee}</td>
                                <td style="padding: 16px; color: #334155;">${r.type}</td>
                                <td style="padding: 16px; color: #64748b;">${r.date}</td>
                                <td style="padding: 16px;">
                                    <span style="font-weight: 700; color: ${r.rating >= 4 ? '#10b981' : '#f59e0b'}">${r.rating}/5</span>
                                </td>
                                <td style="padding: 16px;"><span style="font-size: 0.8rem; background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Submitted</span></td>
                             </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            const btn = div.querySelector('#btn-log-review');
            if (btn) btn.onclick = () => {
                const employee = prompt('Employee Name:');
                if (!employee) return;
                const rating = prompt('Rating (1-5):', '5');
                actions.addPerformanceReview({
                    employee,
                    type: 'Quarterly',
                    date: new Date().toLocaleDateString(),
                    rating: parseInt(rating)
                });
                window.showToast('Performance Review Saved', 'success');
            };
        }, 0);
    }

    subscribe(render);
    render();
    return div;
}
