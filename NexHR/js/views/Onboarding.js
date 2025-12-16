import { store, actions, subscribe } from '../data/store.js';

export function Onboarding() {
    const div = document.createElement('div');
    div.className = 'view-onboarding';
    div.style.padding = '32px';
    div.style.maxWidth = '1200px';
    div.style.margin = '0 auto';

    function render() {
        const candidates = store.candidates || [];

        // Stats Calculation
        const onboardingCount = candidates.filter(c => c.status !== 'Hired').length;
        const employeeCount = (store.employees || []).length;

        div.innerHTML = `
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                <div>
                    <h1 style="font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px;">Onboarding</h1>
                    <p style="color: #64748b; margin-top: 8px; font-size: 1.05rem;">Manage new hires and document verification.</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-refresh-data" style="padding: 10px 16px; background: white; border: 1px solid #cbd5e1; color: #475569; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                        <i data-lucide="refresh-cw" style="width: 18px; margin-right: 6px;"></i> Refresh
                    </button>
                    <button id="btn-new-hire" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                        <i data-lucide="plus" style="width: 20px;"></i> Add New Hire
                    </button>
                </div>
            </div>

            <!-- Stats Grid Removed -->

            <!-- Main Table -->
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="padding: 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                    <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #334155;">Candidates Pipeline</h3>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <th style="padding: 16px 24px; text-align: left; font-weight: 600; color: #475569; font-size: 0.9rem;">Candidate</th>
                            <th style="padding: 16px 24px; text-align: left; font-weight: 600; color: #475569; font-size: 0.9rem;">Role</th>
                            <th style="padding: 16px 24px; text-align: left; font-weight: 600; color: #475569; font-size: 0.9rem;">Status</th>
                            <th style="padding: 16px 24px; text-align: left; font-weight: 600; color: #475569; font-size: 0.9rem;">Progress</th>
                            <th style="padding: 16px 24px; text-align: right; font-weight: 600; color: #475569; font-size: 0.9rem;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${candidates.length === 0 ? `
                            <tr>
                                <td colspan="5" style="padding: 64px; text-align: center;">
                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                                        <div style="background: #f1f5f9; padding: 16px; border-radius: 50%;">
                                            <i data-lucide="inbox" style="width: 32px; height: 32px; color: #94a3b8;"></i>
                                        </div>
                                        <div style="color: #64748b; font-weight: 500;">No candidates found. Add one to get started.</div>
                                    </div>
                                </td>
                            </tr>
                        ` : candidates.map(c => `
                            <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s;">
                                <td style="padding: 16px 24px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="width: 40px; height: 40px; background: #eff6ff; color: #2563eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                                            ${c.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style="font-weight: 600; color: #0f172a;">${c.name}</div>
                                            <div style="font-size: 0.8rem; color: #64748b;">Added ${c.id ? 'Recently' : 'Today'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style="padding: 16px 24px; color: #334155; font-weight: 500;">${c.role}</td>
                                <td style="padding: 16px 24px;">
                                    <span style="background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                                        <span style="width: 6px; height: 6px; background: #94a3b8; border-radius: 50%;"></span>
                                        ${c.status || 'New'}
                                    </span>
                                </td>
                                <td style="padding: 16px 24px;">
                                    <div style="width: 120px; height: 6px; background: #e2e8f0; border-radius: 3px;">
                                        <div style="width: ${c.trainingProgress || 10}%; height: 100%; background: #2563eb; border-radius: 3px;"></div>
                                    </div>
                                </td>
                                <td style="padding: 16px 24px; text-align: right;">
                                    <button style="color: #64748b; background: none; border: none; cursor: pointer; padding: 8px;">
                                        <i data-lucide="more-horizontal"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Modal for Adding Candidate -->
            <div id="modal-new-candidate" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                <div style="background: white; width: 450px; padding: 32px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
                    <h2 style="margin: 0 0 24px 0; font-size: 1.5rem; font-weight: 800; color: #0f172a;">Add New Candidate</h2>
                    
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div>
                            <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #334155; margin-bottom: 8px;">Full Name</label>
                            <input type="text" id="inp-nc-name" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; outline: none; transition: border-color 0.2s;" placeholder="e.g. Sarah Connor">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #334155; margin-bottom: 8px;">Role Applying For</label>
                            <input type="text" id="inp-nc-role" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; outline: none;" placeholder="e.g. Security Analyst">
                        </div>

                        <div style="display: flex; gap: 12px; margin-top: 12px;">
                            <button id="btn-cancel-nc" style="flex: 1; padding: 12px; border: 2px solid #e2e8f0; background: white; color: #475569; border-radius: 10px; font-weight: 600; cursor: pointer;">Cancel</button>
                            <button id="btn-save-nc" style="flex: 1; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Save Candidate</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        // Event Binding
        setTimeout(() => {
            const btnNew = div.querySelector('#btn-new-hire');
            const btnRefresh = div.querySelector('#btn-refresh-data');
            const modal = div.querySelector('#modal-new-candidate');
            const btnCancel = div.querySelector('#btn-cancel-nc');
            const btnSave = div.querySelector('#btn-save-nc');

            if (btnRefresh) btnRefresh.onclick = () => {
                store.candidates = [...store.candidates]; // Force reactivity
                // Also hard reload for safety? No, let's just re-render.
                render();
                window.showToast('Data Refreshed', 'success');
            };

            if (btnNew) btnNew.onclick = () => modal.style.display = 'flex';
            if (btnCancel) btnCancel.onclick = () => {
                modal.style.display = 'none';
                div.querySelector('#inp-nc-name').value = '';
                div.querySelector('#inp-nc-role').value = '';
            };

            if (btnSave) btnSave.onclick = () => {
                const name = div.querySelector('#inp-nc-name').value;
                const role = div.querySelector('#inp-nc-role').value;

                if (!name || !role) return alert('Please enter name and role');

                actions.addCandidate({
                    name,
                    role,
                    status: 'Onboarding',
                    docStatus: 'processing',
                    trainingProgress: 0
                });

                modal.style.display = 'none';
                div.querySelector('#inp-nc-name').value = '';
                div.querySelector('#inp-nc-role').value = '';
                window.showToast(`${name} added!`, 'success');
            };

        }, 0);
    }

    subscribe(render);
    render();
    return div;
}
