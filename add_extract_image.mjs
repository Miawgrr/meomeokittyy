import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const apiRoute = `
  // Proxy to extract og:image from URLs (useful for Pinterest, Facebook links)
  app.get("/api/extract-image", async (req, res) => {
    try {
      const targetUrl = req.query.url;
      if (!targetUrl || typeof targetUrl !== "string") {
        return res.status(400).json({ error: "Missing url parameter" });
      }
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch URL" });
      }
      
      const html = await response.text();
      // Use regex to find og:image
      const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>|<meta[^>]*content="([^"]+)"[^>]*property="og:image"[^>]*>/i);
      
      let imageUrl = "";
      if (ogImageMatch) {
        imageUrl = ogImageMatch[1] || ogImageMatch[2];
      }
      
      if (!imageUrl) {
        // Fallback for some sites using twitter:image
        const twitterImageMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"[^>]*>|<meta[^>]*content="([^"]+)"[^>]*name="twitter:image"[^>]*>/i);
        if (twitterImageMatch) {
          imageUrl = twitterImageMatch[1] || twitterImageMatch[2];
        }
      }
      
      // Decode HTML entities if necessary
      if (imageUrl) {
        imageUrl = imageUrl.replace(/&amp;/g, '&');
      }
      
      res.json({ imageUrl: imageUrl || targetUrl });
    } catch (error) {
      console.error("Extract image error:", error);
      res.status(500).json({ error: error.message });
    }
  });
`;

if (!code.includes('/api/extract-image')) {
    code = code.replace('// Serve Vite', apiRoute + '\n  // Serve Vite');
    fs.writeFileSync('server.ts', code);
    console.log("Success server.ts");
} else {
    console.log("Already exists");
}
