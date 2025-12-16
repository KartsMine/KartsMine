import { AIService } from '../ai.js';

export const Calendar = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';

    container.innerHTML = `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2><i data-lucide="calendar"></i> Content Calendar</h2>
                <button class="btn-primary" id="btn-generate-calendar">
                    <i data-lucide="wand-2"></i> Auto-Schedule Month
                </button>
            </div>
            
            <div id="calendar-grid" class="grid-3">
                <div style="grid-column: span 3; color: var(--text-muted); text-align: center; padding: 2rem;">
                    Click "Auto-Schedule Month" to generate a content plan.
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const btn = container.querySelector('#btn-generate-calendar');
        const grid = container.querySelector('#calendar-grid');

        btn.addEventListener('click', async () => {
            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Scheduling...`;
            btn.disabled = true;

            const days = await AIService.generateContentCalendar('Current', 'Tech Startup');

            grid.innerHTML = days.map(day => `
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; border-left: 3px solid ${getStatusColor(day.status)}">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.5rem; color: var(--text-muted);">
                        <span>Day ${day.day}</span>
                        <span>${day.type}</span>
                    </div>
                    <strong>${day.title}</strong>
                    <div style="margin-top: 0.5rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                         <span style="width: 6px; height: 6px; border-radius: 50%; background: ${getStatusColor(day.status)}"></span>
                         ${day.status}
                    </div>
                </div>
            `).join('');

            btn.innerHTML = `<i data-lucide="wand-2"></i> Auto-Schedule Month`;
            btn.disabled = false;
            lucide.createIcons();
        });
    }, 0);

    return container;
};

function getStatusColor(status) {
    return status === 'Ready' ? 'var(--success)' : 'var(--warning)';
}
