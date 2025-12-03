// api/status.js

export default async function handler(req, res) {
  // --- CONFIG: CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- DAFTAR SERVER (SEMUA SUDAH ONLINE) ---
  const sites = [
    { name: "Main Website", url: "https://www.rifqydev.my.id" },
    { name: "Dashboard", url: "https://dash.rifqydev.my.id" },
    { name: "Lookup Tool", url: "https://lookup.rifqydev.my.id" },
    { name: "Design", url: "https://design.rifqydev.my.id" },
    { name: "Pastebin", url: "https://paste.rifqydev.my.id" },
    { name: "Notes", url: "https://notes.rifqydev.my.id" },
    { name: "Downloader", url: "https://downloader.rifqydev.my.id" },
    { name: "Profile", url: "https://profile.rifqydev.my.id" },
    { name: "QR Generator", url: "https://qr.rifqydev.my.id" },
    { name: "Task Manager", url: "https://task.rifqydev.my.id" },
    { name: "Budget App", url: "https://budget.rifqydev.my.id" },
    { name: "Translator", url: "https://translate.rifqydev.my.id" },
    { name: "Converter", url: "https://converter.rifqydev.my.id" },
    { name: "Weather", url: "https://weather.rifqydev.my.id" },
    { name: "Maps", url: "https://maps.rifqydev.my.id" },
    { name: "Compressor", url: "https://compress.rifqydev.my.id" },
    { name: "Calory Tracker", url: "https://calory.rifqydev.my.id" },
    // Yang baru rilis (sekarang dicek statusnya)
    { name: "Summary Tool", url: "https://summary.rifqydev.my.id" },
    { name: "Minecraft Status", url: "https://mc.rifqydev.my.id" },
  ];

  const checkStatus = async (site) => {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 detik timeout
      
      const response = await fetch(site.url, { 
          method: 'HEAD', 
          signal: controller.signal 
      });
      clearTimeout(timeoutId);
      const latency = Date.now() - start;
      
      return {
        name: site.name,
        url: site.url,
        status: response.ok ? "online" : "error",
        code: response.status,
        latency: `${latency}ms`
      };
    } catch (error) {
      return {
        name: site.name,
        url: site.url,
        status: "offline",
        code: 500,
        latency: "0ms"
      };
    }
  };

  const results = await Promise.all(sites.map(checkStatus));

  res.status(200).json({
    owner: "RifqyDev",
    updated_at: new Date().toISOString(),
    data: results
  });
}
