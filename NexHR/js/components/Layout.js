// Layout Component
// Returns a DOM Node
export function Layout() {
    const container = document.createElement('div');
    container.className = 'layout-container';
    container.style.cssText = `
        display: flex;
        width: 100vw;
        height: 100vh;
    `;

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'glass-panel';
    sidebar.style.cssText = `
        width: 260px;
        margin: 16px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid var(--border-glass);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    `;

    sidebar.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-left: 8px;">
            <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="cpu" style="color: white; width: 20px;"></i>
            </div>
            <h1 style="font-size: 1.3rem; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">NexHR</h1>
        </div>
        
        <nav style="display: flex; flex-direction: column; gap: 8px;">
            ${navItem('Layout Dashboard', '/', 'layout-dashboard')}
            ${navItem('Recruitment (ATS)', '#/ats', 'users')}
            ${navItem('Onboarding', '#/onboarding', 'user-plus')}
            ${navItem('Training & Dev', '#/training', 'book-open')}
            ${navItem('Performance', '#/performance', 'bar-chart-2')}
            ${navItem('Time Off', '#/engagement', 'calendar')}
            ${navItem('Compensation', '#/compensation', 'dollar-sign')}
            ${navItem('Analytics', '#/analytics', 'pie-chart')}
        </nav>

        <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid var(--border-glass);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-glow); color: var(--primary); display: flex; align-items: center; justify-content: center;">
                        <span style="font-weight: bold;">HR</span>
                    </div>
                    <div>
                        <div style="font-size: 0.9em; font-weight: 600; color: #0f172a;">User</div>
                    </div>
                </div>
                <button id="btn-settings" title="Settings" style="background: none; color: var(--text-muted); padding: 4px;"><i data-lucide="settings" style="width: 20px;"></i></button>
            </div>
        </div>
    `;

    // Settings Modal
    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.style.cssText = `display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 500; align-items: center; justify-content: center; backdrop-filter: blur(2px);`;
    modal.innerHTML = `
        <div style="background: white; width: 400px; padding: 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 16px; color: #0f172a; font-size: 1.2rem;">Application Settings</h3>
            <p style="margin-bottom: 16px; color: var(--text-muted); font-size: 0.9rem;">Configure AI features.</p>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9rem;">Gemini API Key</label>
            <input type="password" id="input-apikey" placeholder="AIwaSy..." style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 20px; outline: none;">
            
            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                <button id="btn-close-settings" style="padding: 8px 16px; border: 1px solid #e2e8f0; background: white; border-radius: 6px; color: #64748b;">Close</button>
                <button id="btn-save-settings" style="padding: 8px 16px; background: var(--primary); color: white; border-radius: 6px; font-weight: 600;">Save</button>
            </div>
        </div>
    `;

    // Logic for Modal (Hacky inline attachment for Layout)
    setTimeout(() => {
        const btn = document.getElementById('btn-settings');
        const m = document.getElementById('settings-modal');
        const close = document.getElementById('btn-close-settings');
        const save = document.getElementById('btn-save-settings');
        const input = document.getElementById('input-apikey');

        // Import store dynamically or assume global for Layout hacks... better to use events?
        // Let's rely on window.nexhr if available or local state
        // For now, simple standard JS

        if (btn) btn.onclick = () => {
            m.style.display = 'flex';
            // Load existing key
            const currentKey = JSON.parse(localStorage.getItem('nexhr_data_v1') || '{}').settings?.apiKey || '';
            input.value = currentKey;
        };
        if (close) close.onclick = () => m.style.display = 'none';
        if (save) save.onclick = () => {
            // We need to update the store. Use the exposed global for convenience from this 'dumb' component
            if (window.nexhr) {
                window.nexhr.actions.saveSettings({ apiKey: input.value });
                alert('Settings Saved');
                m.style.display = 'none';
            }
        };
    }, 500);

    // Main Content Area
    const main = document.createElement('main');
    main.id = 'main-content';
    main.style.cssText = `
        flex: 1;
        padding: 24px;
        overflow-y: auto;
        background: white;
    `;

    container.appendChild(sidebar);
    container.appendChild(main);
    container.appendChild(modal); // Append modal to root container

    return container;
}

function navItem(label, href, icon) {
    const isActive = (href === '/' && !window.location.hash) || window.location.hash === href.replace('#', '');
    const activeStyle = isActive ? 'background: #eef2ff; color: var(--primary); font-weight: 600;' : 'color: var(--text-muted);';

    return `
        <a href="${href}" style="
            text-decoration: none;
            padding: 10px 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s;
            ${activeStyle}
        " onmouseover="if(!this.style.background.includes('eef2ff')) this.style.background='#f1f5f9'" onmouseout="if(!this.style.background.includes('eef2ff')) this.style.background='transparent'">
            <i data-lucide="${icon}" style="width: 18px;"></i>
            <span style="font-size: 0.95rem;">${label}</span>
        </a>
    `;
}

