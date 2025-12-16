import { AIService } from '../ai.js';

export const CreativeStudio = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';

    container.innerHTML = `
        <div class="grid-2">
            <!-- Tool Selection -->
            <div class="card" style="height: fit-content;">
                <h3>Select Tool</h3>
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                    <button class="btn-secondary active-tool" id="tool-caption" style="text-align: left; border-color: var(--primary);">
                        <i data-lucide="message-square"></i> Caption Generator
                    </button>
                    <button class="btn-secondary" id="tool-poster" style="text-align: left;">
                        <i data-lucide="image"></i> Poster Generator
                    </button>
                </div>
            </div>

            <!-- Workspace -->
            <div class="card" id="workspace">
                <!-- Injected Tool UI -->
            </div>
        </div>
    `;

    // Tool UIs
    const renderCaptionTool = () => `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>Caption Generator</h3>
        </div>
        <div class="input-group" style="margin-top: 1rem;">
            <label>Topic / Product</label>
            <input type="text" id="cap-topic" placeholder="e.g. New Coffee Blend">
        </div>
        <div class="input-group">
            <label>Platform</label>
            <select id="cap-platform">
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter / X</option>
            </select>
        </div>
        <div class="input-group">
            <label>Language</label>
            <select id="cap-lang">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
            </select>
        </div>
        <button class="btn-primary" id="btn-generate-cap">
            <i data-lucide="sparkles"></i> Generate Captions
        </button>
        <div id="cap-results" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"></div>
    `;

    const renderPosterTool = () => `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>Poster Generator</h3>
        </div>
        <div class="input-group" style="margin-top: 1rem;">
            <label>Visual Description</label>
            <textarea id="post-prompt" rows="3" placeholder="e.g. Cyberpunk city with neon lights..."></textarea>
        </div>
        <button class="btn-primary" id="btn-generate-post">
            <i data-lucide="image"></i> Generate Poster
        </button>
        <div id="post-results" style="margin-top: 1.5rem;"></div>
    `;

    // Logic
    setTimeout(() => {
        const workspace = container.querySelector('#workspace');
        const btnCap = container.querySelector('#tool-caption');
        const btnPost = container.querySelector('#tool-poster');

        // Default View
        workspace.innerHTML = renderCaptionTool();
        attachCaptionListeners(workspace);

        // Switchers
        btnCap.addEventListener('click', () => {
            workspace.innerHTML = renderCaptionTool();
            attachCaptionListeners(workspace);
            btnCap.style.borderColor = 'var(--primary)';
            btnPost.style.borderColor = 'var(--border-glass)';
            lucide.createIcons();
        });

        btnPost.addEventListener('click', () => {
            workspace.innerHTML = renderPosterTool();
            attachPosterListeners(workspace);
            btnPost.style.borderColor = 'var(--primary)';
            btnCap.style.borderColor = 'var(--border-glass)';
            lucide.createIcons();
        });
    }, 0);

    // Event Handlers
    const attachCaptionListeners = (parent) => {
        const btn = parent.querySelector('#btn-generate-cap');
        const results = parent.querySelector('#cap-results');
        const topic = parent.querySelector('#cap-topic');
        const platform = parent.querySelector('#cap-platform');
        const lang = parent.querySelector('#cap-lang');

        btn.addEventListener('click', async () => {
            if (!topic.value) return;

            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Generating...`;
            btn.disabled = true;

            const captions = await AIService.generateCaptions(topic.value, platform.value, lang.value);

            results.innerHTML = captions.map(cap => `
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-glass);">
                    <p style="white-space: pre-wrap;">${cap}</p>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem;">
                        <button class="btn-icon" onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.innerText)" title="Copy">
                            <i data-lucide="copy" style="width: 14px;"></i>
                        </button>
                        <button class="btn-secondary" style="font-size: 0.7rem; padding: 0.3rem 0.8rem;" onclick="(() => {
                            const blob = new Blob(['${cap.replace(/'/g, "\\'")}'], {type: 'text/plain'});
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = 'caption.txt';
                            a.click();
                        })()">
                            Export <i data-lucide="download" style="width: 12px; margin-left: 4px;"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            btn.innerHTML = `<i data-lucide="sparkles"></i> Generate Captions`;
            btn.disabled = false;
            lucide.createIcons();
        });
    };

    const attachPosterListeners = (parent) => {
        const btn = parent.querySelector('#btn-generate-post');
        const results = parent.querySelector('#post-results');
        const prompt = parent.querySelector('#post-prompt');

        btn.addEventListener('click', async () => {
            if (!prompt.value) return;

            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Painting...`;
            btn.disabled = true;

            const data = await AIService.generatePoster(prompt.value);

            results.innerHTML = `
                <div style="border-radius: 12px; overflow: hidden; border: 1px solid var(--border-glass);">
                    <img src="${data.imageUrl}" style="width: 100%; display: block;" alt="Generated Poster" crossOrigin="anonymous">
                    <div style="padding: 1rem; background: rgba(0,0,0,0.5); display: flex; justify-content: space-between; align-items: center;">
                        <p class="text-muted" style="font-size: 0.8rem;">${data.prompt}</p>
                        <button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="(() => {
                            const a = document.createElement('a');
                            a.href = '${data.imageUrl}';
                            a.download = 'generated-poster.jpg';
                            a.target = '_blank';
                            a.click();
                        })()">
                            Download <i data-lucide="download" style="width: 12px; margin-left: 4px;"></i>
                        </button>
                    </div>
                </div>
            `;

            btn.innerHTML = `<i data-lucide="image"></i> Generate Poster`;
            btn.disabled = false;
            lucide.createIcons();
        });
    };

    return container;
};
