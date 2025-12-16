import { AIService, AIPersonas } from '../ai.js';

export const CampaignWizard = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';

    // State
    let step = 1;
    let campaignData = {};

    const renderStep1 = () => `
        <div class="card" style="max-width: 600px; margin: 0 auto;">
            <h2><i data-lucide="${AIPersonas.STRATEGIST.icon}"></i> Start New Campaign</h2>
            <p class="text-muted" style="margin-bottom: 2rem;">Tell the AI Director what you want to achieve.</p>
            
            <div class="input-group">
                <label>Product / Service Name</label>
                <input type="text" id="wiz-product" placeholder="e.g. Quantum Sneakers">
            </div>
            
            <div class="input-group">
                <label>Target Audience</label>
                <input type="text" id="wiz-audience" placeholder="e.g. Gen Z runners in urban areas">
            </div>

            <div class="grid-2">
                <div class="input-group">
                    <label>Key Goal</label>
                    <select id="wiz-goal">
                        <option>Brand Awareness</option>
                        <option>Lead Generation</option>
                        <option>Sales Conversion</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Language</label>
                    <select id="wiz-lang">
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                    </select>
                </div>
            </div>

            <div class="input-group" style="flex-direction: row; align-items: center; gap: 0.5rem; margin-top: 1rem;">
                <input type="checkbox" id="wiz-ab" style="width: auto;">
                <label for="wiz-ab" style="margin: 0; cursor: pointer;">Generate A/B Test Variations</label>
            </div>

            <button class="btn-primary" id="btn-start-campaign" style="width: 100%; justify-content: center; margin-top: 1rem;">
                Initialize Campaign <i data-lucide="arrow-right"></i>
            </button>
        </div>
    `;

    const renderLoading = () => `
        <div style="text-align: center; margin-top: 4rem;">
            <div style="display: inline-block; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 50%;">
                <i data-lucide="loader-2" class="spin" style="width: 48px; height: 48px; color: var(--accent);"></i>
            </div>
            <h2 style="margin-top: 1.5rem;">Orchestrating Campaign...</h2>
            <p class="text-muted" id="loading-text">Analyzing market trends...</p>
        </div>
    `;

    const renderResults = (data) => `
        <div class="grid-2" style="margin-bottom: 2rem;">
            <!-- Strategy Card -->
            <div class="card" style="grid-column: span 2;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>${data.strategy.title}</h2>
                    <span class="text-success" style="border: 1px solid var(--success); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">Ready to Launch</span>
                </div>
                <div class="grid-3" style="margin-top: 1.5rem;">
                    <div>
                        <label class="text-muted">Theme</label>
                        <p>${data.strategy.theme}</p>
                    </div>
                    <div>
                        <label class="text-muted">Audience</label>
                        <p>${data.strategy.audience}</p>
                    </div>
                    <div>
                        <label class="text-muted">Channels</label>
                        <p>${data.strategy.channels.join(', ')}</p>
                    </div>
                </div>

                ${data.strategy.abTests && data.strategy.abTests.length > 0 ? `
                    <div style="margin-top: 1.5rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                        <h4><i data-lucide="split"></i> A/B Test Experiments</h4>
                        <div class="grid-2" style="gap: 1rem; margin-top: 0.5rem;">
                            ${data.strategy.abTests.map(test => `
                                <div>
                                    <p class="text-muted" style="font-size: 0.8rem;">${test.name}</p>
                                    <div style="font-size: 0.9rem;">
                                        <span style="color: var(--text-muted);">A:</span> ${test.control}<br>
                                        <span style="color: var(--accent);">B:</span> ${test.variant}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="grid-2">
            <!-- Visuals -->
            <div class="card">
                <h3><i data-lucide="${AIPersonas.DESIGNER.icon}"></i> Visual Concepts</h3>
                <div style="margin-top: 1rem; border-radius: 12px; overflow: hidden; position: relative;">
                    <img src="${data.poster.imageUrl}" style="width: 100%; display: block;" alt="Generated Campaign Visual">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 1rem;">
                        <p style="font-size: 0.8rem; color: white;">${data.poster.prompt}</p>
                    </div>
                </div>
            </div>

            <!-- Copy -->
            <div class="card">
                <h3><i data-lucide="${AIPersonas.COPYWRITER.icon}"></i> Social Copy</h3>
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
                    ${data.captions.map(cap => `
                        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                            <p style="font-size: 0.9rem;">${cap}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Initial Render
    container.innerHTML = renderStep1();

    // Logic
    setTimeout(() => {
        const btnStart = container.querySelector('#btn-start-campaign');
        if (btnStart) {
            btnStart.addEventListener('click', async () => {
                const product = container.querySelector('#wiz-product').value;
                const audience = container.querySelector('#wiz-audience').value;
                const language = container.querySelector('#wiz-lang').value;
                const useAb = container.querySelector('#wiz-ab').checked;

                if (!product) return;

                // Switch to Loading
                container.innerHTML = renderLoading();
                lucide.createIcons();

                const loadingText = container.querySelector('#loading-text');
                const steps = ["Drafting Strategy...", "Designing Visuals...", "Writing Copy...", "Finalizing..."];

                let stepIdx = 0;
                const interval = setInterval(() => {
                    if (stepIdx < steps.length) {
                        loadingText.innerText = steps[stepIdx];
                        stepIdx++;
                    }
                }, 800);

                // Parallel Execution
                const [strategy, captions, poster] = await Promise.all([
                    AIService.generateStrategy({ product, audience, goal: container.querySelector('#wiz-goal').value, abTest: useAb }),
                    AIService.generateCaptions(product, 'instagram', language),
                    AIService.generatePoster(`${product} for ${audience} style modern advertisement`)
                ]);

                clearInterval(interval);

                // Save to LocalStorage
                const newCampaign = {
                    name: product,
                    goal: container.querySelector('#wiz-goal').value,
                    date: new Date().toISOString(),
                    assets: ['Strategy', 'Poster', ...captions]
                };

                const existing = JSON.parse(localStorage.getItem('marketer_campaigns') || '[]');
                localStorage.setItem('marketer_campaigns', JSON.stringify([newCampaign, ...existing]));

                // Render Results
                container.innerHTML = renderResults({ strategy, captions, poster });
                lucide.createIcons();
            });
        }
    }, 0);

    return container;
};
