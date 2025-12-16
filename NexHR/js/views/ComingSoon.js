export function ComingSoon(title) {
    return function () {
        const div = document.createElement('div');
        div.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            flex-direction: column;
            gap: 24px;
            background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
            border-radius: 12px;
            border: 1px dashed #cbd5e1;
            margin-top: 10px;
        `;

        div.innerHTML = `
            <div style="width: 100px; height: 100px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                <i data-lucide="rocket" style="width: 48px; height: 48px; color: var(--primary);"></i>
            </div>
            <div style="text-align: center;">
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-bottom: 8px;">${title}</h2>
                <div style="font-size: 1rem; color: #64748b; font-weight: 500; background: #e2e8f0; display: inline-block; padding: 4px 12px; border-radius: 20px;">Coming Soon</div>
                <p style="color: #94a3b8; margin-top: 16px; max-width: 400px; line-height: 1.6;">
                    We are currently building this module. It will be part of the V2 release with enhanced AI capabilities.
                </p>
            </div>
            <button onclick="window.location.hash='/'" style="margin-top: 10px; padding: 10px 20px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                Return Dashboard
            </button>
        `;
        return div;
    }
}
