// Mock News Generator for Untrained Tickers
const generateMockNews = (ticker) => {
    const sentiments = ['Positive', 'Neutral', 'Negative'];
    const sources = ['Bloomberg', 'Reuters', 'CNBC', 'MarketWatch', 'Financial Times'];
    const headlines = [
        `Analysts upgrade ${ticker} citing strong earnings potential`,
        `Market volatility impacts ${ticker} amidst global uncertainty`,
        `Institutional investors increase stake in ${ticker}`,
        `${ticker} announces new strategic partnership to expand market share`,
        `Regulatory concerns loom over ${ticker}'s latest product launch`,
        `Tech sector rally boosts ${ticker} to new highs`,
        `${ticker} faces headwinds from supply chain disruptions`,
        `Insider trading activity reported at ${ticker}`,
        `${ticker} outlines ambitious roadmap for next fiscal year`,
        `Competitor moves put pressure on ${ticker}'s margins`
    ];

    // Generate 5 random news items
    return Array.from({ length: 5 }).map((_, i) => {
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        return {
            id: i,
            headline: headlines[Math.floor(Math.random() * headlines.length)],
            source: sources[Math.floor(Math.random() * sources.length)],
            sentiment: sentiment,
            url: "#", // Placeholder
            published_at: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString() // Last 2 days
        };
    });
};

export const getCompanyNews = async (req, res) => {
    const { ticker } = req.params;

    // In a real production app, we would call:
    // const news = await axios.get(`https://newsapi.org/v2/everything?q=${ticker}&apiKey=...`);

    // For this project/demo, we use the sophisticated generator
    const newsData = generateMockNews(ticker.toUpperCase());

    res.status(200).json({
        ticker: ticker.toUpperCase(),
        news: newsData,
        source: "Live News Feed (Simulated)"
    });
};
