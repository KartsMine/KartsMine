/**
 * AI Service Layer
 * Handles interactions with LLMs (Mocked for prototype)
 */

const MOCK_DELAY = 2000; // 2 seconds to simulate "thinking"

export const AIPersonas = {
    STRATEGIST: { name: "Chief Strategist", role: "Brand Strategy & Positioning", icon: "chess-bishop" },
    GROWTH: { name: "Growth Hacker", role: "User Acquisition & Viral Loops", icon: "rocket" },
    SEO: { name: "SEO Specialist", role: "Search Rankings & Organic Traffic", icon: "search" },
    COPYWRITER: { name: "Senior Copywriter", role: "Persuasive Messaging", icon: "pen-tool" },
    DESIGNER: { name: "Creative Director", role: "Visual Identity & Aesthetics", icon: "palette" },
    ANALYST: { name: "Data Scientist", role: "Performance Analysis", icon: "bar-chart-2" },
    SOCIAL: { name: "Social Media Mgr", role: "Community & Engagement", icon: "smartphone" },
    EMAIL: { name: "CRM Specialist", role: "Retention & Automation", icon: "mail" },
    PR: { name: "PR Director", role: "Public Relations & Comms", icon: "mic" },
    PSYCH: { name: "User Psychologist", role: "Behavioral Economics", icon: "brain-circuit" }
};

export const AIService = {

    async generatePoster(prompt) {
        return new Promise(resolve => {
            // Use Pollinations.ai for free, real-time image generation
            const encodedPrompt = encodeURIComponent(prompt + ", cinematic lighting, 8k, highly detailed, professional photography, advertisement");
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`;

            // Preload image to ensure it's visible before resolving
            const img = new Image();
            img.onload = () => {
                resolve({
                    prompt: prompt,
                    imageUrl: imageUrl
                });
            };
            img.onerror = () => {
                // Fallback if service is down
                resolve({
                    prompt: prompt,
                    imageUrl: "https://placehold.co/800x600/1a1a1a/FFF?text=Image+Generation+Failed"
                });
            };
            img.src = imageUrl;
        });
    },

    async generateStrategy(brief) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    title: `Campaign: ${brief.product}`,
                    theme: `Strategic focus on ${brief.goal} for ${brief.audience}`,
                    audience: brief.audience,
                    channels: ["Instagram Reels", "LinkedIn", "Targeted Email"],
                    steps: [
                        `Phase 1: Tease ${brief.product} to ${brief.audience} with mystery content.`,
                        `Phase 2: Launch with influencer partnerships focusing on ${brief.goal}.`,
                        `Phase 3: Retargeting and social proof to drive conversions.`
                    ],
                    abTests: brief.abTest ? [
                        { name: "Headline Variation A", control: "Unlock your potential", variant: "Unleash the beast within" },
                        { name: "Visual Style", control: "Minimalist", variant: "High contrast neon" }
                    ] : []
                });
            }, 1500);
        });
    },

    async generateCaptions(topic, platform, language = 'English') {
        const langPrefix = language !== 'English' ? `[${language}] ` : '';
        return new Promise(resolve => {
            setTimeout(() => {
                const hashtags = `#${topic.replace(/\s/g, '')} #Marketing #Growth`;
                if (platform === 'linkedin') {
                    resolve([
                        `${langPrefix}We are thrilled to introduce ${topic}. Designed specifically for professionals who value excellence. \n\nHow are you innovating today? 👇 ${hashtags}`,
                        `${langPrefix}Big news: ${topic} is finally here. It's not just a product, it's a game changer. ${hashtags}`
                    ]);
                } else {
                    resolve([
                        `${langPrefix}✨ ${topic} has arrived! Get ready. ${hashtags}`,
                        `${langPrefix}POV: You just discovered ${topic}. 🔥 ${hashtags}`,
                        `${langPrefix}The future is here: ${topic}. 🚀`
                    ]);
                }
            }, 1000);
        });
    },

    async analyzeCompetitors(competitors) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(competitors.map(comp => {
                    // Randomize slightly for variety
                    const strategies = ["Aggressive Social", "Content Marketing", "Influencer Heavy", "Price Undercutting", "Product Innovation"];
                    const strategy = strategies[Math.floor(Math.random() * strategies.length)];

                    return {
                        name: comp,
                        swot: {
                            strengths: ["Strong brand loyalty", "Global distribution", "High profit margins"],
                            weaknesses: ["Slow innovation cycle", "Legacy tech stack", "Poor customer support"],
                            opportunities: ["Emerging markets", "Gen Z adoption", "Sustainable product lines"],
                            threats: ["Regulatory changes", "New startups", "Economic downturn"]
                        },
                        strategy: `Primarily focuses on ${strategy} to capture market share.`,
                        traffic: Math.floor(Math.random() * 500000) + 50000 + " monthly visits",
                        adSpend: "$" + (Math.floor(Math.random() * 50) + 10) + "k/mo"
                    };
                }));
            }, 2000);
        });
    },

    async generateBrandIdentity(name, mission) {
        return new Promise(resolve => {
            setTimeout(() => {
                const archetypes = [
                    { name: "The Creator", trait: "Innovation" },
                    { name: "The Ruler", trait: "Control" },
                    { name: "The Sage", trait: "Wisdom" },
                    { name: "The Explorer", trait: "Freedom" },
                    { name: "The Magician", trait: "Transformation" }
                ];
                const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];

                resolve({
                    archetype: archetype,
                    voice: ["Professional", "Confident", "Empathetic"],
                    values: ["Integrity", "Innovation", "Customer Obsession"],
                    mission_statement: `To empower users through ${mission} by leveraging ${archetype.trait}.`,
                    slogan: `${name}: Redefining ${archetype.trait}.`
                });
            }, 1800);
        });
    },

    async generateGrowthHacks(product) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { title: "Viral Loop Referral", impact: "High", difficulty: "Medium", desc: "Offer double-sided incentives for user invites." },
                    { title: "SEO Programmatic Pages", impact: "High", difficulty: "High", desc: `Create 100s of landing pages for '${product} for [X]' keyword variations.` },
                    { title: "LinkedIn Founder Story", impact: "Medium", difficulty: "Low", desc: "Share the 'Building in Public' journey to build trust." },
                    { title: "Product Hunt Launch", impact: "High", difficulty: "Medium", desc: "Prepared launch with waitlist activation." },
                    { title: "Competitor Ad Targeting", impact: "Medium", difficulty: "Low", desc: "Bid on competitor keywords with comparison pages." }
                ]);
            }, 1500);
        });
    },

    async detectTrends() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { name: "Hyper-Personalization", growth: "+145%", sentiment: "Positive", category: "Strategy" },
                    { name: "Short-form Video SEO", growth: "+88%", sentiment: "Neutral", category: "Content" },
                    { name: "Voice Search Optimization", growth: "+62%", sentiment: "Positive", category: "SEO" },
                    { name: "Sustainable Packaging", growth: "+40%", sentiment: "Positive", category: "Product" },
                    { name: "Interactive Ads", growth: "+35%", sentiment: "Neutral", category: "Ads" }
                ]);
            }, 1200);
        });
    },

    async optimizeBudget(totalBudget) {
        const budget = parseInt(totalBudget) || 10000;
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { channel: "Social Ads (Meta/TikTok)", amount: budget * 0.4, percentage: 40, roi: "3.5x" },
                    { channel: "Search (Google Ads)", amount: budget * 0.3, percentage: 30, roi: "2.8x" },
                    { channel: "Influencer Marketing", amount: budget * 0.2, percentage: 20, roi: "4.2x" },
                    { channel: "Retargeting", amount: budget * 0.1, percentage: 10, roi: "5.0x" }
                ]);
            }, 1000);
        });
    },

    async generateContentCalendar(month, niche) {
        return new Promise(resolve => {
            setTimeout(() => {
                const days = [];
                const types = ["Educational", "Promotional", "Behind the Scenes", "User Generated", "Interactive"];
                for (let i = 1; i <= 30; i++) {
                    days.push({
                        day: i,
                        title: `${niche} Tip #${i}`,
                        type: types[Math.floor(Math.random() * types.length)],
                        status: Math.random() > 0.7 ? "Ready" : "Draft"
                    });
                }
                resolve(days);
            }, 1500);
        });
    }
};
