async function verify() {
  const BASE_URL = 'http://localhost:3001';

  console.log('\n======================================');
  console.log('1. Check sitemap.xml');
  console.log('======================================');
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapBody = await sitemapRes.text();
  console.log(`Status:`, sitemapRes.status);
  console.log(`Content-Type:`, sitemapRes.headers.get('content-type'));
  // Extract a few lines to show
  console.log(`\nExcerpt:\n${sitemapBody.split('\n').slice(0, 15).join('\n')}...`);
  
  // Verify it contains home, works
  console.log(`\nContains /works?`, sitemapBody.includes('<loc>http://localhost:3000/works</loc>'));

  console.log('\n======================================');
  console.log('2. Check robots.txt');
  console.log('======================================');
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  const robotsBody = await robotsRes.text();
  console.log(`Status:`, robotsRes.status);
  console.log(`\nContent:\n${robotsBody}`);

  console.log('\n======================================');
  console.log('3. Check OG Image Route');
  console.log('======================================');
  const ogRes = await fetch(`${BASE_URL}/api/og?title=Test%20Title&type=Article`);
  console.log(`Status:`, ogRes.status);
  console.log(`Content-Type:`, ogRes.headers.get('content-type'));

  console.log('\n======================================');
  console.log('4. Check Metadata and JSON-LD');
  console.log('======================================');

  async function checkPage(path: string, label: string) {
    console.log(`\n--- ${label} (${path}) ---`);
    const res = await fetch(`${BASE_URL}${path}`);
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i) || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i);
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i) || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i);

    console.log(`<title>:`, titleMatch ? titleMatch[1] : null);
    console.log(`<meta name="description">`, descMatch ? descMatch[1] : null);
    console.log(`<meta property="og:title">`, ogTitleMatch ? ogTitleMatch[1] : null);
    console.log(`<meta property="og:image">`, ogImageMatch ? ogImageMatch[1] : null);

    // Find JSON-LD script tags
    const scriptMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    if (scriptMatches.length > 0) {
      console.log(`Found ${scriptMatches.length} JSON-LD block(s):`);
      scriptMatches.forEach(match => {
        try {
          const parsed = JSON.parse(match[1]);
          console.log(`  Type: ${parsed['@type']} | Context: ${parsed['@context']}`);
        } catch(e) {
          console.log(`  Could not parse JSON-LD block: ${match[1].substring(0,50)}...`);
        }
      });
    } else {
      console.log(`No JSON-LD found.`);
    }
  }

  await checkPage('/', 'Homepage');
  await checkPage('/works', 'Works Listing');
  
  // To check dynamic pages, we'll extract the first URL from sitemap for works
  const worksMatch = sitemapBody.match(/<loc>(http:\/\/localhost:3000\/works\/[^<]+)<\/loc>/);
  if (worksMatch) {
    const worksUrl = worksMatch[1].replace('http://localhost:3000', '');
    await checkPage(worksUrl, 'Project Detail');
  } else {
    console.log('\nNo /works/[slug] found in sitemap to test.');
  }

}

verify().catch(console.error);
