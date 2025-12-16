import { AIService, AIPersonas } from '../ai.js';

export const BudgetOptimizer = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';
    container.innerHTML = `
        <div class="grid-2">
            <div class="card">
                <h2><i data-lucide="${AIPersonas.GROWTH.icon}"></i> Budget Allocator</h2>
                <p class="text-muted">Maximize ROI with AI-driven attribution.</p>
                
                <div class="input-group" style="margin-top: 1.5rem;">
                    <label>Total Budget ($)</label>
                    <input type="number" id="budget-input" value="10000">
                </div>
                
                <button class="btn-primary" id="btn-optimize" style="width: 100%; justify-content: center; margin-top: 1rem;">
                    Optimize Allocation <i data-lucide="pie-chart"></i>
                </button>
            </div>
            
            <div class="card" id="budget-results">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                    <p>Run optimization to see breakdown</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btn = container.querySelector('#btn-optimize');
        const input = container.querySelector('#budget-input');
        const results = container.querySelector('#budget-results');

        btn.addEventListener('click', async () => {
            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Calculating...`;
            btn.disabled = true;

            const allocation = await AIService.optimizeBudget(input.value);

            results.innerHTML = `
                <h3>Optimal Allocation</h3>
                <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                    ${allocation.map(item => `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                                <span>${item.channel}</span>
                                <span>$${item.amount.toLocaleString()}</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${item.percentage}%; height: 100%; background: var(--accent);"></div>
                            </div>
                            <div style="text-align: right; font-size: 0.8rem; color: var(--success); margin-top: 0.2rem;">
                                Est. ROI: ${item.roi}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            btn.innerHTML = `Optimize Allocation <i data-lucide="pie-chart"></i>`;
            btn.disabled = false;
            lucide.createIcons();
        });
    }, 0);

    return container;
};
