// api/status.js

export default async function handler(req, res) {
  // --- CONFIG: CORS (Agar bisa diakses dari GitHub Pages) ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Boleh diakses dari mana saja
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request browser
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- DAFTAR SERVER RIFQYDEV ---
  const sites = [
    // Status: Active (Cek Koneksi)
    { name: "Main Website", url: "https://www.rifqydev.my.id", type: "active" },
    { name: "Dashboard", url: "https://dash.rifqydev.my.id", type: "active" },
    { name: "Lookup Tool", url: "https://lookup.rifqydev.my.id", type: "active" },
    { name: "Design", url: "https://design.rifqydev.my.id", type: "active" },
    { name: "Pastebin", url: "https://paste.rifqydev.my.id", type: "active" },
    { name: "Notes", url: "https://notes.rifqydev.my.id", type: "active" },
    { name: "Downloader", url: "https://downloader.rifqydev.my.id", type: "active" },
    { name: "Profile", url: "https://profile.rifqydev.my.id", type: "active" },
    { name: "QR Generator", url: "https://qr.rifqydev.my.id", type: "active" },
    { name: "Task Manager", url: "https://task.rifqydev.my.id", type: "active" },
    { name: "Budget App", url: "https://budget.rifqydev.my.id", type: "active" },
    { name: "Translator", url: "https://translate.rifqydev.my.id", type: "active" },
    { name: "Converter", url: "https://converter.rifqydev.my.id", type: "active" },
    { name: "Weather", url: "https://weather.rifqydev.my.id", type: "active" },
    { name: "Maps", url: "https://maps.rifqydev.my.id", type: "active" },
    { name: "Compressor", url: "https://compress.rifqydev.my.id", type: "active" },
    { name: "Calory Tracker", url: "https://calory.rifqydev.my.id", type: "active" },
    
    // Status: Coming Soon (Tidak perlu dicek/ping)
    { name: "Summary Tool", url: "https://summary.rifqydev.my.id", type: "upcoming" },
    { name: "Minecraft Status", url: "https://minecraft-status.rifqydev.my.id", type: "upcoming" },
  ];

  const checkStatus = async (site) => {
    // Jika tipe upcoming, langsung return status coming_soon
    if (site.type === 'upcoming') {
        return {
            name: site.name,
            url: site.url,
            status: "coming_soon",
            code: 0,
            latency: "-"
        };
    }

    const start = Date.now();
    try {
      // Timeout 5 detik
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(site.url, { 
          method: 'HEAD', 
          signal: controller.signal 
      });
      clearTimeout(timeoutId);

      const latency = Date.now() - start;
      
      return {
        name: site.name,
        url: site.url,
        status: response.ok ? "online" : "error", // 200-299 dianggap online
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

  // Jalankan pengecekan secara paralel agar cepat
  const results = await Promise.all(sites.map(checkStatus));

  res.status(200).json({
    owner: "RifqyDev",
    updated_at: new Date().toISOString(),
    data: results
  });
}
