import { AIService, AIPersonas } from '../ai.js';

export const BrandDNA = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';
    container.innerHTML = `
        <div class="grid-2">
            <div class="card">
                <h2><i data-lucide="${AIPersonas.STRATEGIST.icon}"></i> Brand Identity Core</h2>
                <p class="text-muted">Define your brand's soul with AI assistance.</p>
                
                <div class="input-group" style="margin-top: 1.5rem;">
                    <label>Brand Name</label>
                    <input type="text" id="dna-name" placeholder="e.g. Apex Dynamics">
                </div>

                <div class="input-group">
                    <label>Mission / Vision (Brief)</label>
                    <textarea id="dna-mission" rows="3" placeholder="e.g. Making space travel accessible to everyone..."></textarea>
                </div>

                <button class="btn-primary" id="btn-dna-gen" style="width: 100%; justify-content: center; margin-top: 1rem;">
                    Decode Brand DNA <i data-lucide="fingerprint"></i>
                </button>
            </div>

            <div class="card" id="dna-results">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                    <p>Enter details to reveal identity</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btn = container.querySelector('#btn-dna-gen');
        const results = container.querySelector('#dna-results');
        const nameInput = container.querySelector('#dna-name');
        const missionInput = container.querySelector('#dna-mission');

        btn.addEventListener('click', async () => {
            if (!nameInput.value) return;

            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Decoding...`;
            btn.disabled = true;

            const dna = await AIService.generateBrandIdentity(nameInput.value, missionInput.value);

            results.innerHTML = `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">🧬</div>
                    <h2 class="text-accent">${dna.archetype.name}</h2>
                    <p class="text-muted">Primary Archetype • ${dna.archetype.trait}</p>
                </div>
                
                <div style="display: grid; gap: 1rem;">
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                        <label class="text-muted" style="font-size: 0.8rem;">Slogan Recommendation</label>
                        <p style="font-size: 1.1rem; font-weight: 500;">"${dna.slogan}"</p>
                    </div>

                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                        <label class="text-muted" style="font-size: 0.8rem;">Tone of Voice</label>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            ${dna.voice.map(v => `<span style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">${v}</span>`).join('')}
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                        <label class="text-muted" style="font-size: 0.8rem;">Core Values</label>
                         <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            ${dna.values.map(v => `<span style="border: 1px solid var(--accent); color: var(--accent); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">${v}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;

            btn.innerHTML = `Decode Brand DNA <i data-lucide="fingerprint"></i>`;
            btn.disabled = false;
            lucide.createIcons();
        });
    }, 0);

    return container;
};
