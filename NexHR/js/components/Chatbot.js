import { actions } from '../data/store.js';

export function Chatbot() {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 16px;
    `;

    // Chat Window (Hidden by default)
    const window = document.createElement('div');
    window.style.cssText = `
        width: 350px;
        height: 500px;
        background: white;
        border: 1px solid var(--border-glass);
        border-radius: var(--radius-lg);
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        display: none; 
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
    `;

    // Add slideUp keyframe if not exists (handled in js for simplicity here)
    if (!document.getElementById('anim-style')) {
        const style = document.createElement('style');
        style.id = 'anim-style';
        style.innerHTML = `@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
        document.head.appendChild(style);
    }

    const header = `
        <div style="padding: 16px; background: rgba(255,255,255,0.05); border-bottom: 1px solid var(--border-glass); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                <span style="font-weight: 600;">NexHR AI Assistant</span>
            </div>
            <button id="close-chat" style="background: none; color: var(--text-muted);"><i data-lucide="x" style="width: 16px;"></i></button>
        </div>
    `;

    const messages = document.createElement('div');
    messages.style.cssText = `flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;`;
    messages.innerHTML = `
        ${msg('Hello! I am your AI HR Assistant. How can I help you today?', 'bot')}
    `;

    const inputArea = `
        <div style="padding: 16px; border-top: 1px solid var(--border-glass);">
            <div style="display: flex; background: #f1f5f9; border-radius: 20px; padding: 4px 4px 4px 16px;">
                <input type="text" placeholder="Ask about policies..." style="flex: 1; background: transparent; border: none; color: #0f172a; outline: none;">
                <button class="send-btn" style="width: 32px; height: 32px; background: var(--primary); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="send" style="width: 14px;"></i>
                </button>
            </div>
        </div>
    `;

    window.innerHTML = header;
    window.appendChild(messages);
    window.innerHTML += inputArea;

    // Floating Button
    const fab = document.createElement('button');
    fab.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--primary);
        box-shadow: 0 4px 20px var(--primary-glow);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
    `;
    fab.innerHTML = `<i data-lucide="message-square" style="width: 24px; height: 24px;"></i>`;
    fab.onclick = () => {
        const isOpen = window.style.display === 'flex';
        window.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
            // Re-render icons inside chat when opened
            setTimeout(() => window.lucide?.createIcons(), 0);
        }
    };
    fab.onmouseover = () => fab.style.transform = 'scale(1.1)';
    fab.onmouseout = () => fab.style.transform = 'scale(1)';

    // Reset Data Button (Small, above chat)
    const resetBtn = document.createElement('button');
    resetBtn.title = "Reset All Data";
    resetBtn.style.cssText = `
        padding: 6px 12px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        color: #64748b;
        font-size: 0.75rem;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 8px;
    `;
    resetBtn.innerText = "RESET";

    resetBtn.onclick = () => {
        if (confirm('Are you sure you want to RESET ALL DATA? This cannot be undone.')) {
            try {
                actions.resetData();
            } catch (e) {
                alert('Reset failed: ' + e.message);
                console.error(e);
            }
        }
    };

    resetBtn.onmouseover = () => {
        resetBtn.style.color = '#ef4444';
        resetBtn.style.borderColor = '#fca5a5';
        resetBtn.style.transform = 'scale(1.1)';
    };
    resetBtn.onmouseout = () => {
        resetBtn.style.color = '#64748b';
        resetBtn.style.borderColor = '#e2e8f0';
        resetBtn.style.transform = 'scale(1)';
    };

    // Append interactions
    container.appendChild(window);
    container.appendChild(resetBtn);
    container.appendChild(fab);

    // Logic
    async function send() {
        const input = window.querySelector('input');
        const text = input.value.trim();
        if (!text) return;

        // User Msg
        messages.innerHTML += msg(text, 'user');
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        // Loading
        const loadId = Math.random();
        messages.innerHTML += `<div id="load-${loadId}" style="align-self: flex-start; margin-left:12px; font-size: 0.8rem; color: #94a3b8;">Thinking...</div>`;
        messages.scrollTop = messages.scrollHeight;

        try {
            // Import AI service dynamically with cache busting
            const { ai } = await import(`../services/ai.js?v=${Date.now()}`);
            const response = await ai.chat([], text);

            document.getElementById(`load-${loadId}`).remove();
            messages.innerHTML += msg(response, 'bot');
        } catch (e) {
            document.getElementById(`load-${loadId}`).remove();
            messages.innerHTML += msg("I couldn't connect to the AI. Please check your API Key in Settings.", 'bot');
        }

        messages.scrollTop = messages.scrollHeight;
    }

    // Bindings
    setTimeout(() => {
        const input = window.querySelector('input');
        const btn = window.querySelector('button.send-btn');
        const close = container.querySelector('#close-chat');

        if (input) input.onkeypress = (e) => { if (e.key === 'Enter') send(); };
        if (btn) btn.onclick = send;
        if (close) close.onclick = () => window.style.display = 'none';
    }, 0);

    return container;
}

function msg(text, type) {
    const align = type === 'bot' ? 'flex-start' : 'flex-end';
    const bg = type === 'bot' ? '#f1f5f9' : 'var(--primary)';
    const color = type === 'bot' ? '#0f172a' : 'white';
    const radius = type === 'bot' ? '12px 12px 12px 0' : '12px 12px 0 12px';
    return `
        <div style="align-self: ${align}; max-width: 80%; padding: 12px; background: ${bg}; color: ${color}; border-radius: ${radius}; font-size: 0.9rem; line-height: 1.4; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            ${text}
        </div>
    `;
}
