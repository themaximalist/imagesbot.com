const { Result, Search, Query } = require("../models");

module.exports = async function sitemap(req, res) {
    try {
        // Get favorited results
        const results = await Result.findAll({
            attributes: ['id', 'updatedAt'],
            where: { favorite: true },
            order: [['updatedAt', 'DESC']],
            limit: 1000
        });

        // Get searches with results and their queries
        const searches = await Search.findAll({
            attributes: ['id', 'updatedAt'],
            include: [{
                model: Query,
                attributes: ['id']
            }],
            order: [['updatedAt', 'DESC']],
            limit: 1000
        });

        // Map result URLs
        const resultUrls = results.map(result => `
    <url>
        <loc>${process.env.SITE_URL}/result/${result.id}</loc>
        <lastmod>${result.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('');

        // Map search URLs (for both results and show pages)
        const searchUrls = searches.map(search => `
    <url>
        <loc>${process.env.SITE_URL}/results/${search.Queries[0]?.id}</loc>
        <lastmod>${search.updatedAt.toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${process.env.SITE_URL}/show/${search.id}</loc>
        <lastmod>${search.updatedAt.toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
    </url>`).join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${process.env.SITE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${process.env.SITE_URL}/gallery</loc>
        <changefreq>hourly</changefreq>
        <priority>0.8</priority>
    </url>${searchUrls}${resultUrls}
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
};
