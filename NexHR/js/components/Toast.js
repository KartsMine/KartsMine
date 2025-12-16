export function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');
    const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-circle' : 'info');

    toast.style.cssText = `
        background: white;
        border-left: 4px solid ${colors};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Inter', sans-serif;
    `;

    toast.innerHTML = `
        <i data-lucide="${icon}" style="color: ${colors}; width: 20px;"></i>
        <span style="font-size: 0.95rem; font-weight: 500; color: #1e293b;">${message}</span>
    `;

    container.appendChild(toast);

    // Animate In
    if (window.lucide) window.lucide.createIcons();
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });

    // Remove
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Expose globally
window.showToast = showToast;
