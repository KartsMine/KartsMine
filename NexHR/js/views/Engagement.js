import { store, actions, subscribe } from '../data/store.js';

export function Engagement() {
    const div = document.createElement('div');
    div.className = 'view-timeoff';

    function render() {
        // Load requests from store, default to EMPTY array
        // HOTFIX: Filter out legacy mock data (IDs 1 and 2) if they persist in storage
        let requests = (store.leaveRequests || []).filter(r => r.id > 1000);

        // Update store if we did filter something out, to make it permanent (optional, but good)
        if (store.leaveRequests && requests.length !== store.leaveRequests.length) {
            store.leaveRequests = requests;
            // logic to save would be nice, but this view renders on subscribe, so avoid loops.
            // Just display clean list.
        }

        // Calculate Used Days
        const getUsed = (query) => requests
            .filter(r => r.status === 'Approved' && r.type.toLowerCase().trim().includes(query))
            .reduce((sum, r) => sum + (Number(r.days) || 1), 0);

        const usedVacation = getUsed('vacation');
        const usedSick = getUsed('sick');

        // Policies (Quota)
        const QUOTA_VACATION = 24;
        const QUOTA_SICK = 12;

        const balances = {
            vacation: QUOTA_VACATION - usedVacation,
            sick: QUOTA_SICK - usedSick,
            remote: 'Unlimited'
        };

        div.innerHTML = `
            <div style="margin-bottom: 32px;">
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a;">Time Off Management</h2>
                <p style="color: #64748b;">Manage leave requests, balances, and holidays.</p>
            </div>

            <!-- Balances Section Removed as requested -->
            <!-- Requests Table -->
            <div class="glass-panel" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0;">Leave Requests</h3>
                    <button id="btn-req-leave" style="padding: 8px 16px; background: #0f172a; color: white; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">+ New Request</button>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0; text-align: left;">
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Employee</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Type</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Duration</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Status</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${requests.length === 0 ?
                `<tr><td colspan="5" style="padding: 40px; text-align: center; color: #64748b;">No active leave requests. Click "+ New Request" to add one.</td></tr>` :
                requests.map(r => `
                            <tr style="border-bottom: 1px solid #f8fafc;">
                                <td style="padding: 16px; font-weight: 500; color: #0f172a;">${r.name}</td>
                                <td style="padding: 16px; color: #334155;">
                                    <span style="padding: 4px 10px; border-radius: 12px; background: #f1f5f9; color: #475569; font-size: 0.8rem; font-weight: 600;">${r.type}</span>
                                </td>
                                <td style="padding: 16px; color: #334155;">
                                    ${r.dates}
                                    <div style="font-size: 0.8rem; color: #94a3b8;">${r.days || 1} Day(s)</div>
                                </td>
                                <td style="padding: 16px;">
                                    <span style="font-weight: 600; color: ${r.status === 'Approved' ? '#16a34a' : r.status === 'Rejected' ? '#dc2626' : '#d97706'}">${r.status}</span>
                                </td>
                                <td style="padding: 16px;">
                                    ${r.status === 'Pending' ? `
                                        <button class="btn-approve" data-id="${r.id}" style="color: #16a34a; background: none; border: none; font-weight: 600; cursor: pointer; margin-right: 8px;">Approve</button>
                                        <button class="btn-reject" data-id="${r.id}" style="color: #dc2626; background: none; border: none; font-weight: 600; cursor: pointer;">Deny</button>
                                    ` : '<span style="color: #94a3b8; font-size: 0.8rem;">Completed</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        // Bind Events
        setTimeout(() => {
            const btn = div.querySelector('#btn-req-leave');
            if (btn) btn.onclick = () => {
                const name = prompt('Employee Name:', '');
                if (!name) return;
                const type = prompt('Leave Type (Vacation/Sick):', 'Vacation');
                if (!type) return;
                const dates = prompt('Dates (e.g. Dec 25):', 'Dec 25');
                const days = prompt('Duration (Number of Days):', '1');

                // Add to temporary store list (basic persistence)
                if (!store.leaveRequests) store.leaveRequests = [];
                store.leaveRequests.push({
                    id: Date.now(),
                    name: name,
                    type,
                    dates,
                    days: Number(days) || 1,
                    status: 'Pending'
                });
                actions.saveSettings({}); // Trigger update
                window.showToast('Leave request submitted.', 'success');
            }

            div.querySelectorAll('.btn-approve').forEach(b => {
                b.onclick = () => {
                    const req = store.leaveRequests.find(r => r.id == b.dataset.id);
                    if (req) {
                        req.status = 'Approved';
                        actions.saveSettings({});
                        window.showToast('Leave Approved', 'success');
                    }
                }
            });

            div.querySelectorAll('.btn-reject').forEach(b => {
                b.onclick = () => {
                    const req = store.leaveRequests.find(r => r.id == b.dataset.id);
                    if (req) {
                        req.status = 'Rejected';
                        actions.saveSettings({});
                        window.showToast('Leave Denied', 'success');
                    }
                }
            });

        }, 0);
    }

    subscribe(render);
    render();
    return div;
}
