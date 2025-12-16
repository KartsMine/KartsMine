import { AIService, AIPersonas } from '../ai.js';

export const CompetitorAnalysis = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';
    container.innerHTML = `
        <div class="grid-2">
            <div class="card">
                <h2><i data-lucide="${AIPersonas.STRATEGIST.icon}"></i> Competitor Deep Dive</h2>
                <p class="text-muted">Analyze your rivals' strategies using AI.</p>
                <div class="input-group" style="margin-top: 1.5rem;">
                    <label>Competitors (Comma separated)</label>
                    <input type="text" id="comp-names" placeholder="e.g. Nike, Adidas, Puma">
                </div>
                <button class="btn-primary" id="btn-analyze-comp" style="width: 100%; justify-content: center; margin-top: 1rem;">
                    Analyze Rivals <i data-lucide="search"></i>
                </button>
            </div>
            <div class="card" id="comp-results">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                    <p>Enter competitors to start analysis</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btn = container.querySelector('#btn-analyze-comp');
        const input = container.querySelector('#comp-names');
        const results = container.querySelector('#comp-results');

        btn.addEventListener('click', async () => {
            if (!input.value) return;

            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Analyzing...`;
            btn.disabled = true;

            const competitors = input.value.split(',').map(s => s.trim());
            const data = await AIService.analyzeCompetitors(competitors);

            results.innerHTML = `
                <h3>Analysis Results</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    ${data.map(d => `
                        <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-glass);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                                <div>
                                    <h3 style="margin: 0; color: var(--accent);">${d.name}</h3>
                                    <p style="font-size: 0.85rem; margin-top: 0.3rem;">Traffic: ${d.traffic} • Ad Spend: ${d.adSpend}</p>
                                </div>
                                <span style="background: rgba(255,255,255,0.1); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">Primary Rival</span>
                            </div>
                            
                            <p style="font-size: 0.95rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); line-height: 1.5;">
                                "${d.strategy}"
                            </p>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem;">
                                <div>
                                    <strong class="text-success" style="display: block; margin-bottom: 0.5rem;">Strengths</strong>
                                    <ul style="padding-left: 1.2rem; margin: 0; color: var(--text-muted);">
                                        ${d.swot.strengths.map(s => `<li>${s}</li>`).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <strong class="text-danger" style="display: block; margin-bottom: 0.5rem;">Weaknesses</strong>
                                    <ul style="padding-left: 1.2rem; margin: 0; color: var(--text-muted);">
                                        ${d.swot.weaknesses.map(w => `<li>${w}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            btn.innerHTML = `Analyze Rivals <i data-lucide="search"></i>`;
            btn.disabled = false;
            lucide.createIcons();
        });
    }, 0);

    return container;
};
