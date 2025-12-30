/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://natnaelalemseged.com",
    generateRobotsTxt: true,
    exclude: ["/admin/*"],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: "/admin",
            },
        ],
    },
};
