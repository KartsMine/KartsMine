export const Dashboard = () => {
    const container = document.createElement('div');
    container.className = 'animate-fade-in';

    // Check for saved campaigns in localStorage
    const campaigns = JSON.parse(localStorage.getItem('marketer_campaigns') || '[]');
    const totalAssets = campaigns.reduce((acc, c) => acc + (c.assets?.length || 0), 0);

    if (campaigns.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; margin-top: 4rem; padding: 2rem;">
                <div style="background: rgba(255,255,255,0.05); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
                    <i data-lucide="ghost" style="width: 40px; height: 40px; color: var(--text-muted);"></i>
                </div>
                <h2>Welcome to MarketerOS</h2>
                <p class="text-muted" style="max-width: 400px; margin: 0.5rem auto 2rem auto;">
                    Your AI Command Center is ready. Start a new campaign to generate strategies, visuals, and copy.
                </p>
                <button class="btn-primary" onclick="document.getElementById('new-campaign-btn').click()" style="margin: 0 auto;">
                    <i data-lucide="plus"></i> Create First Campaign
                </button>
            </div>
            </div>
        `;
    }

    return container;
};
