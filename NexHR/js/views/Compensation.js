import { store, actions, subscribe } from '../data/store.js';

export function Compensation() {
    const div = document.createElement('div');
    div.className = 'view-comp';

    function render() {
        try {
            const employees = Array.isArray(store.employees) ? store.employees : [];

            // Ensure every employee has a salary for demo purposes
            employees.forEach(e => {
                if (!e.salary) e.salary = 120000;
                if (!e.equity) e.equity = '0.1%';
            });

            // Calculate Stats
            const totalPayroll = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
            const avgSalary = employees.length ? Math.round(totalPayroll / employees.length) : 0;
            const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

            div.innerHTML = `
                <div style="margin-bottom: 32px;">
                    <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a;">Compensation & Benefits</h2>
                    <p style="color: #64748b;">Payroll planning and equity management.</p>
                </div>

                <!-- Stats -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                    <div class="glass-panel" style="padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <div style="font-size: 0.9rem; color: #64748b; font-weight: 500;">Annual Payroll</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #0f172a;">${fmt(totalPayroll)}</div>
                    </div>
                    <div class="glass-panel" style="padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <div style="font-size: 0.9rem; color: #64748b; font-weight: 500;">Avg Salary</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #0f172a;">${fmt(avgSalary)}</div>
                    </div>
                    <div class="glass-panel" style="padding: 24px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <div style="font-size: 0.9rem; color: #64748b; font-weight: 500;">Next Run</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #0f172a;">Dec 30</div>
                    </div>
                </div>

                <!-- Table -->
                <div class="glass-panel" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0;">Employee Compensation</h3>
                        <div style="display: flex; gap: 12px;">
                            <button id="btn-add-payee" style="padding: 8px 16px; background: white; border: 1px solid #e2e8f0; color: #0f172a; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">+ Add Employee</button>
                            <button onclick="window.showToast('Payroll Run Triggered', 'success')" style="padding: 8px 16px; background: #0f172a; color: white; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer;">Run Payroll</button>
                        </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f1f5f9; border-bottom: 1px solid #e2e8f0; text-align: left;">
                                <th style="padding: 16px; font-weight: 600; color: #475569;">Employee</th>
                                <th style="padding: 16px; font-weight: 600; color: #475569;">Role</th>
                                <th style="padding: 16px; font-weight: 600; color: #475569;">Base Salary</th>
                                <th style="padding: 16px; font-weight: 600; color: #475569;">Equity</th>
                                <th style="padding: 16px; font-weight: 600; color: #475569;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.length === 0 ?
                    `<tr><td colspan="5" style="padding: 40px; text-align: center; color: #64748b;">No employees loaded. Add them in Employee Directory.</td></tr>` :
                    employees.map(e => `
                                    <tr style="border-bottom: 1px solid #f8fafc;">
                                        <td style="padding: 16px; font-weight: 500; color: #0f172a;">${e.name}</td>
                                        <td style="padding: 16px; color: #334155;">${e.role}</td>
                                        <td style="padding: 16px; font-weight: 600; color: #0f172a;">${fmt(e.salary)}</td>
                                        <td style="padding: 16px; color: #334155;">${e.equity}</td>
                                        <td style="padding: 16px;">
                                            <button class="btn-edit-salary" data-id="${e.id}" style="color: #2563eb; font-weight: 500; background: none; border: none; cursor: pointer;">Edit</button>
                                        </td>
                                    </tr>
                                `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

            // Events
            setTimeout(() => {
                const addBtn = div.querySelector('#btn-add-payee');
                if (addBtn) {
                    addBtn.onclick = () => {
                        const name = prompt('Employee Name:');
                        if (!name) return;
                        const role = prompt('Role:', 'Staff');
                        const salary = prompt('Annual Base Salary ($):', '100000');
                        const equity = prompt('Equity (%):', '0.0%');

                        actions.addEmployee({
                            name,
                            role,
                            salary: Number(salary) || 0,
                            equity: equity || '0%'
                        });
                        window.showToast(`${name} added to Payroll.`, 'success');
                    };
                }

                div.querySelectorAll('.btn-edit-salary').forEach(btn => {
                    btn.onclick = () => {
                        const id = Number(btn.dataset.id);
                        const emp = store.employees.find(e => e.id === id);
                        if (emp) {
                            const newSal = prompt(`Update Salary for ${emp.name}:`, emp.salary);
                            if (newSal && !isNaN(newSal)) {
                                emp.salary = Number(newSal);
                                actions.saveSettings({}); // Save
                                window.showToast('Salary Updated', 'success');
                            }
                        }
                    }
                });
            }, 0);

        } catch (e) {
            console.error(e);
            div.innerHTML = `<div style="padding: 20px; color: red;">Error: ${e.message}</div>`;
        }
    }

    subscribe(render);
    render();
    return div;
}
