import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const baseUrl = "https://maccre.com";
  const currentDate = new Date().toISOString();

  // Read tests and categories
  const testsPath = path.join(process.cwd(), "data", "tests.json");
  const categoriesPath = path.join(process.cwd(), "data", "categories.json");

  const tests = JSON.parse(fs.readFileSync(testsPath, "utf8")).tests;
  const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"))
    .categories;

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="ko" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="ja" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />
  </url>

  <!-- Categories -->
  ${categories
    .map(
      (cat) => `
  <url>
    <loc>${baseUrl}/category/${cat.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/category/${cat.id}" />
    <xhtml:link rel="alternate" hreflang="ko" href="${baseUrl}/category/${cat.id}" />
    <xhtml:link rel="alternate" hreflang="ja" href="${baseUrl}/category/${cat.id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/category/${cat.id}" />
  </url>`
    )
    .join("")}

  <!-- Tests -->
  ${tests
    .map(
      (test) => `
  <url>
    <loc>${baseUrl}/test/${test.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/test/${test.id}" />
    <xhtml:link rel="alternate" hreflang="ko" href="${baseUrl}/test/${test.id}" />
    <xhtml:link rel="alternate" hreflang="ja" href="${baseUrl}/test/${test.id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/test/${test.id}" />
  </url>`
    )
    .join("")}

</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}
