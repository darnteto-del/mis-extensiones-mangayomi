const source = {
    name: "Komiwa",
    url: "https://komiwa.lat",
    lang: "es",
    type: "manga",
    isFullSource: true,

    getPopular: async (page) => {
        const res = await client.get(`${source.url}/manga/page/${page}/?m_orderby=views`);
        return parseMangaList(res.body);
    },

    getLatestUpdates: async (page) => {
        const res = await client.get(`${source.url}/manga/page/${page}/?m_orderby=latest`);
        return parseMangaList(res.body);
    },

    search: async (query, page) => {
        const res = await client.get(`${source.url}/page/${page}/?s=${query}&post_type=wp-manga`);
        return parseMangaList(res.body);
    },

    getMangaDetail: async (url) => {
        const res = await client.get(url);
        const doc = dom.parse(res.body);
        return {
            name: doc.selectFirst("div.post-title h1").text,
            description: doc.selectFirst("div.description-summary").text,
            imageUrl: doc.selectFirst("div.summary_image img").attr("src"),
            chapters: doc.select("li.wp-manga-chapter").map(ch => ({
                name: ch.selectFirst("a").text,
                url: ch.selectFirst("a").attr("href")
            }))
        };
    },

    getPageList: async (url) => {
        const res = await client.get(url);
        const doc = dom.parse(res.body);
        return doc.select("div.page-break img").map(img => img.attr("data-src") || img.attr("src"));
    }
};

function parseMangaList(html) {
    const doc = dom.parse(html);
    return doc.select("div.manga-item").map(item => ({
        name: item.selectFirst("h3 a").text,
        link: item.selectFirst("h3 a").attr("href"),
        imageUrl: item.selectFirst("img").attr("src")
    }));
}
