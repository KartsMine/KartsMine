import { AIService, AIPersonas } from '../ai.js';

export const GrowthHub = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';
    container.innerHTML = `
        <div class="grid-2">
            <div class="card">
                <h2><i data-lucide="${AIPersonas.GROWTH.icon}"></i> Growth Lab</h2>
                <p class="text-muted">Generate viral loops and acquisition hacks.</p>
                
                 <div class="input-group" style="margin-top: 1.5rem;">
                    <label>Product / Metric to Boost</label>
                    <input type="text" id="growth-metric" placeholder="e.g. Mobile App Installs">
                </div>

                <button class="btn-primary" id="btn-growth-gen" style="width: 100%; justify-content: center; margin-top: 1rem;">
                    Generate Experiments <i data-lucide="flask-conical"></i>
                </button>
            </div>
            
             <div class="card" id="growth-results">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                    <p>Ready to hack? Enter a goal.</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btn = container.querySelector('#btn-growth-gen');
        const results = container.querySelector('#growth-results');
        const input = container.querySelector('#growth-metric');

        btn.addEventListener('click', async () => {
            if (!input.value) return;

            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Hacking...`;
            btn.disabled = true;

            const hacks = await AIService.generateGrowthHacks(input.value);

            results.innerHTML = `
                <h3>Recommended Experiments</h3>
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
                    ${hacks.map(hack => `
                        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; border-left: 2px solid ${getImpactColor(hack.impact)}">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <h4 style="margin: 0;">${hack.title}</h4>
                                <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">ICE: ${hack.impact}</span>
                            </div>
                            <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-muted);">${hack.desc}</p>
                            <div style="font-size: 0.8rem;">
                                Difficulty: <span style="color: ${hack.difficulty === 'Low' ? 'var(--success)' : 'var(--warning)'};">${hack.difficulty}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            btn.innerHTML = `Generate Experiments <i data-lucide="flask-conical"></i>`;
            btn.disabled = false;
            lucide.createIcons();
        });
    }, 0);

    return container;
};

function getImpactColor(impact) {
    if (impact === 'High') return 'var(--accent)';
    if (impact === 'Medium') return 'var(--success)';
    return 'var(--text-muted)';
}
