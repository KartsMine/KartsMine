import { store, actions, subscribe } from '../data/store.js';

export function ATS() {
    const div = document.createElement('div');
    div.className = 'view-ats';

    function render() {
        try {
            const candidates = Array.isArray(store.candidates) ? store.candidates : [];

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a;">Recruitment & ATS</h2>
                        <p style="color: #64748b; font-size: 0.9rem;">Smart Resume Parsing & Candidate Management</p>
                    </div>
                    <div>
                         <input type="file" id="resume-upload" hidden accept=".txt,.pdf,.docx" />
                         <button id="btn-upload" style="padding: 10px 16px; background: #0f172a; color: white; border-radius: 8px; font-weight: 500; display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <i data-lucide="upload"></i> Upload CV
                        </button>
                    </div>
                </div>
                
                <div class="glass-panel" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0; text-align: left;">
                                <th style="padding: 16px; color: #475569; font-weight: 600;">Name</th>
                                <th style="padding: 16px; color: #475569; font-weight: 600;">Role</th>
                                <th style="padding: 16px; color: #475569; font-weight: 600;">Match</th>
                                <th style="padding: 16px; color: #475569; font-weight: 600;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${candidates.length === 0 ?
                    `<tr><td colspan="4" style="padding: 20px; text-align: center; color: #64748b;">No candidates. Upload a resume to start.</td></tr>` :
                    candidates.map(c => `
                                    <tr style="border-bottom: 1px solid #f1f5f9;">
                                        <td style="padding: 16px; color: #0f172a; font-weight: 500;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                 <div style="width: 28px; height: 28px; background: #e0e7ff; color: #4338ca; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;">${c.name.charAt(0)}</div>
                                                 ${c.name}
                                            </div>
                                        </td>
                                        <td style="padding: 16px; color: #334155;">${c.role}</td>
                                        <td style="padding: 16px;">
                                            <div style="display: flex; flex-direction: column;">
                                                <span style="font-weight: 600; color: ${c.matchScore > 80 ? '#059669' : '#d97706'}">${c.matchScore}% Match</span>
                                                <span style="font-size: 0.75rem; color: #64748b; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.analysis || ''}">${c.analysis || 'No analysis'}</span>
                                            </div>
                                        </td>
                                        <td style="padding: 16px;">
                                            <span style="padding: 4px 10px; background: #f1f5f9; color: #475569; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${c.status}</span>
                                        </td>
                                    </tr>
                              `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Loader -->
                <div id="ai-loading" style="display: none; position: fixed; inset: 0; background: rgba(255,255,255,0.8); z-index: 100; align-items: center; justify-content: center; flex-direction: column;">
                    <div style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #0f172a; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 16px; color: #0f172a; font-weight: 600;">Analyzing Resume...</p>
                </div>
                <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            `;

            if (window.lucide) window.lucide.createIcons();

            // Events
            setTimeout(() => {
                const btn = div.querySelector('#btn-upload');
                const pInput = div.querySelector('#resume-upload');
                const loader = div.querySelector('#ai-loading');

                if (btn && pInput) {
                    btn.onclick = () => pInput.click();
                    pInput.onchange = async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        loader.style.display = 'flex';
                        try {
                            const { ai } = await import(`../services/ai.js?v=${Date.now()}`);
                            let result = { name: 'Unknown', role: 'Applicant', skills: [], matchScore: 50 };

                            if (file.name.endsWith('.docx')) {
                                const buffer = await readAsArrayBuffer(file);
                                const text = await extractDocxText(buffer);
                                result = await ai.parseResume(text);
                            } else if (file.type === 'application/pdf') {
                                // Simple fallback for PDF if complex parsing fails (passing base64)
                                const b64 = await readAsBase64(file);
                                result = await ai.parseResumeFromPdf(b64);
                            } else {
                                const text = await readAsText(file);
                                result = await ai.parseResume(text);
                            }

                            actions.addCandidate({
                                name: result.name || 'New Candidate',
                                role: result.role || 'General',
                                skills: result.skills || [],
                                matchScore: result.matchScore || 50,
                                analysis: result.analysis || 'AI Analysis pending...'
                            });

                            window.showToast(`Score: ${result.matchScore}/100. ${result.analysis}`, 'success');
                        } catch (err) {
                            console.error(err);
                            window.showToast('Parse Failed: ' + err.message, 'error');
                            // Fallback Add
                            actions.addCandidate({ name: 'Manual Upload', role: 'Review Needed', status: 'New' });
                        } finally {
                            loader.style.display = 'none';
                            pInput.value = '';
                        }
                    };
                }
            }, 0);

        } catch (e) {
            console.error(e);
            div.innerText = 'Error: ' + e.message;
        }
    }

    subscribe(render);
    render();
    return div;
}

// Helpers
function readAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
function readAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
function readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
async function extractDocxText(arrayBuffer) {
    if (!window.mammoth) {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return result.value;
}
