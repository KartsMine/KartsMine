import { store, actions, subscribe } from '../data/store.js';

export function Training() {
    const div = document.createElement('div');
    div.className = 'view-training';

    function render() {
        const programs = store.trainingPrograms || [];

        // Mock Available Courses if empty? Or just let user add.
        // Let's provide a "Course Catalog" and "My Assignments"

        div.innerHTML = `
            <header style="margin-bottom: 32px;">
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a;">Learning & Development</h2>
                <p style="color: var(--text-muted);">Upskill your workforce with AI-curated courses.</p>
            </header>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                <!-- Active Assignments -->
                <div class="glass-panel" style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <h3 style="font-weight: 600; color: #0f172a;">Active Training Assignments</h3>
                        <button id="btn-new-training" style="font-size: 0.9rem; color: var(--primary); font-weight: 500;">+ Assign Training</button>
                    </div>
                    
                    ${programs.length === 0 ? `
                        <div style="text-align: center; padding: 40px; color: var(--text-muted); background: #f8fafc; border-radius: 8px; border: 1px dashed #e2e8f0;">
                            No active training programs. Assign one to start tracking.
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${programs.map(p => `
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
                                    <div>
                                        <div style="font-weight: 600; color: #0f172a;">${p.course}</div>
                                        <div style="font-size: 0.85rem; color: #64748b;">Assigned to: ${p.assignee}</div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 16px;">
                                        <div style="text-align: right;">
                                            <div style="font-size: 0.85rem; font-weight: 600; color: ${p.progress === 100 ? '#10b981' : '#f59e0b'}">${p.status}</div>
                                            <div style="font-size: 0.8rem; color: #64748b;">${p.progress}% Complete</div>
                                        </div>
                                        ${p.progress < 100 ? `
                                            <button class="btn-update-progress" data-id="${p.id}" style="padding: 6px 12px; font-size: 0.8rem; background: #e0e7ff; color: #4338ca; border-radius: 6px; font-weight: 600; border: none; cursor: pointer;">
                                                + Update
                                            </button>
                                        ` : `
                                            <div style="width: 32px; height: 32px; background: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                <i data-lucide="check" style="color: #10b981; width: 16px;"></i>
                                            </div>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <!-- AI Recommendations -->
                <div class="glass-panel" style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: white; padding: 24px; border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                        <i data-lucide="sparkles" style="width: 20px;"></i>
                        <h3 style="font-weight: 600;">AI Recommendations</h3>
                    </div>
                    <p style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 20px;">Based on recent performance reviews, we suggest:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                            <div style="font-weight: 600; font-size: 0.95rem;">Advanced Conflict Resolution</div>
                            <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px;">For Engineering Leads</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                            <div style="font-weight: 600; font-size: 0.95rem;">Strategic Planning 101</div>
                            <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px;">For Product Managers</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            const btn = div.querySelector('#btn-new-training');
            if (btn) btn.onclick = () => {
                const course = prompt('Course Name:', 'Leadership 101');
                if (!course) return;
                const assignee = prompt('Assign To (Employee Name):');
                actions.assignTraining({ course, assignee });
                window.showToast(`${course} assigned to ${assignee}`, 'success');
            };

            // Bind Update Buttons
            div.querySelectorAll('.btn-update-progress').forEach(btn => {
                btn.onclick = () => {
                    const id = Number(btn.dataset.id);
                    const program = store.trainingPrograms.find(p => p.id === id);
                    if (program) {
                        program.progress = Math.min(100, (program.progress || 0) + 25);
                        program.status = program.progress === 100 ? 'Completed' : 'In Progress';
                        actions.saveSettings({}); // Trigger notify/save
                        window.showToast(`Progress updated to ${program.progress}%`, 'success');
                    }
                };
            });
        }, 0);
    }

    subscribe(render);
    render();
    return div;
}
