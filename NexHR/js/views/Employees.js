import { store, actions, subscribe } from '../data/store.js';

export function Employees() {
    const div = document.createElement('div');
    div.className = 'view-employees';

    // Modal
    const modal = document.createElement('div');
    modal.id = 'modal-add-emp';
    modal.style.cssText = `display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(2px);`;
    modal.innerHTML = `
        <div style="background: white; width: 400px; padding: 24px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
            <h3 style="margin-bottom: 16px; color: #0f172a; font-size: 1.25rem; font-weight: 600;">Add Employee</h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #475569; margin-bottom: 4px;">Full Name</label>
                    <input type="text" id="inp-emp-name" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" placeholder="e.g. Michael Scott">
                </div>
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #475569; margin-bottom: 4px;">Role</label>
                    <input type="text" id="inp-emp-role" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" placeholder="e.g. Regional Manager">
                </div>
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #475569; margin-bottom: 4px;">Department</label>
                    <select id="inp-emp-dept" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <option value="Engineering">Engineering</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Design">Design</option>
                    </select>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
                    <button id="btn-cancel-emp" style="padding: 8px 16px; border: 1px solid #cbd5e1; background: white; color: #475569; border-radius: 6px; font-weight: 500;">Cancel</button>
                    <button id="btn-save-emp" style="padding: 8px 16px; background: var(--primary); color: white; border-radius: 6px; font-weight: 600;">Save Employee</button>
                </div>
            </div>
        </div>
    `;
    div.appendChild(modal);

    function render() {
        const employees = store.employees || [];

        div.innerHTML = `
            <header style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a;">Employee Directory</h2>
                    <p style="color: var(--text-muted); margin-top: 4px;">Manage your workforce profiles and roles.</p>
                </div>
                <button id="btn-add-emp" style="padding: 10px 16px; background: var(--primary); color: white; border-radius: 8px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="plus"></i> Add Employee
                </button>
            </header>

            <div class="glass-panel" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0; text-align: left;">
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Name</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Role</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Department</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Status</th>
                            <th style="padding: 16px; font-weight: 600; color: #475569;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees.length === 0 ? `
                            <tr>
                                <td colspan="5" style="padding: 40px; text-align: center; color: var(--text-muted);">
                                    No employees found. Use the "Add Employee" button above.
                                </td>
                            </tr>
                        ` : employees.map(e => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 16px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="width: 32px; height: 32px; background: #e0e7ff; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                            ${e.name.charAt(0)}
                                        </div>
                                        <span style="font-weight: 500; color: #0f172a;">${e.name}</span>
                                    </div>
                                </td>
                                <td style="padding: 16px; color: #334155;">${e.role}</td>
                                <td style="padding: 16px; color: #334155;">${e.dept || 'Engineering'}</td>
                                <td style="padding: 16px;"><span style="background: #ecfdf5; color: #059669; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Active</span></td>
                                <td style="padding: 16px;">
                                    <button style="color: var(--primary); font-weight: 500; background: none; border: none; cursor: pointer;">Edit</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody >
                </table >
            </div >
        `;

        if (window.lucide) window.lucide.createIcons();

        // Bind Events
        setTimeout(() => {
            const btn = div.querySelector('#btn-add-emp');
            const emptyBtn = div.querySelector('#btn-empty-add');

            const openModal = () => {
                modal.style.display = 'flex';
                div.appendChild(modal); // Ensure modal is in DOM
            }

            if (btn) btn.onclick = openModal;
            if (emptyBtn) emptyBtn.onclick = openModal;
        }, 0);
    }

    // Bind Modal Events
    setTimeout(() => {
        const cancel = modal.querySelector('#btn-cancel-emp');
        const save = modal.querySelector('#btn-save-emp');

        const close = () => {
            modal.style.display = 'none';
            modal.querySelector('#inp-emp-name').value = '';
            modal.querySelector('#inp-emp-role').value = '';
        }

        if (cancel) cancel.onclick = close;
        if (save) save.onclick = () => {
            const name = modal.querySelector('#inp-emp-name').value;
            const role = modal.querySelector('#inp-emp-role').value;
            const dept = modal.querySelector('#inp-emp-dept').value;

            if (!name || !role) return alert('Name and Role are required');

            actions.addEmployee({ name, role, dept });
            window.showToast(`${name} added to directory!`, 'success');
            close();
        }
    }, 0);

    subscribe(render);
    render();
    return div;
}
