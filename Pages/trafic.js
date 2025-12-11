function init() {
  trackVisitor();
}

// Collect comprehensive visitor data
async function trackVisitor() {
  const visitorData = await collectVisitorData();
  const htmlMessage = formatVisitorDataAsHTML(visitorData);
  sendMail(htmlMessage);
}

async function collectVisitorData() {
  const data = {
    // Basic Info
    timestamp: new Date().toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    // Page Info
    currentPage: window.location.href,
    pageTitle: document.title,
    referrer: document.referrer || "Direct Visit (No Referrer)",

    // Device & Browser
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages
      ? navigator.languages.join(", ")
      : navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,

    // Screen Info
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,

    // Connection Info
    connection: getConnectionInfo(),

    // Device Detection
    device: detectDevice(),
    browser: detectBrowser(),
    os: detectOS(),

    // Visit History
    isFirstVisit: checkFirstVisit(),
    visitCount: getVisitCount(),
    lastVisit: getLastVisit(),

    // Unique Identifier
    visitorId: getOrCreateVisitorId(),

    // Location (will be fetched async)
    location: await getLocationData(),

    // Additional Info
    touchSupport: "ontouchstart" in window,
    onlineStatus: navigator.onLine,
    historyLength: history.length,
    javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
    pdfViewerEnabled: navigator.pdfViewerEnabled || false,
  };

  // Update visit tracking
  updateVisitTracking();

  return data;
}

function getConnectionInfo() {
  if (navigator.connection) {
    return {
      effectiveType: navigator.connection.effectiveType || "Unknown",
      downlink: navigator.connection.downlink || "Unknown",
      rtt: navigator.connection.rtt || "Unknown",
      saveData: navigator.connection.saveData || false,
    };
  }
  return { effectiveType: "Not Available" };
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "Mobile";
  if (/Tablet|iPad/i.test(ua)) return "Tablet";
  return "Desktop";
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edge")) return "Edge (Legacy)";
  if (ua.includes("Edg")) return "Edge (Chromium)";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Unknown Browser";
}

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Windows NT 10")) return "Windows 10/11";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad"))
    return "iOS";
  return "Unknown OS";
}

function checkFirstVisit() {
  return !localStorage.getItem("visitor_first_visit");
}

function getVisitCount() {
  return parseInt(localStorage.getItem("visitor_count") || "0") + 1;
}

function getLastVisit() {
  return localStorage.getItem("visitor_last_visit") || "First Visit";
}

function updateVisitTracking() {
  if (!localStorage.getItem("visitor_first_visit")) {
    localStorage.setItem("visitor_first_visit", new Date().toISOString());
  }
  localStorage.setItem("visitor_last_visit", new Date().toISOString());
  localStorage.setItem("visitor_count", getVisitCount().toString());
}

function getOrCreateVisitorId() {
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId =
      "VIS_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
}

async function getLocationData() {
  try {
    // Using free IP geolocation API
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      ip: data.ip || "Unknown",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "Unknown",
      postal: data.postal || "Unknown",
      latitude: data.latitude || "Unknown",
      longitude: data.longitude || "Unknown",
      isp: data.org || "Unknown",
      asn: data.asn || "Unknown",
    };
  } catch (error) {
    return {
      ip: "Failed to fetch",
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      error: error.message,
    };
  }
}

function formatVisitorDataAsHTML(data) {
  const isFirstVisitBadge = data.isFirstVisit
    ? '<span style="background:#4CAF50;color:white;padding:3px 8px;border-radius:4px;font-size:12px;">🆕 NEW VISITOR</span>'
    : '<span style="background:#2196F3;color:white;padding:3px 8px;border-radius:4px;font-size:12px;">🔄 RETURNING VISITOR</span>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0; opacity: 0.9; }
            .badge-container { margin-top: 15px; }
            .section { padding: 20px; border-bottom: 1px solid #eee; }
            .section:last-child { border-bottom: none; }
            .section-title { font-size: 14px; font-weight: 600; color: #667eea; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { background: #f8f9fa; padding: 12px; border-radius: 8px; }
            .info-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { font-size: 14px; color: #333; font-weight: 500; margin-top: 4px; word-break: break-all; }
            .full-width { grid-column: 1 / -1; }
            .highlight { background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%); border: 1px solid #667eea30; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>👤 Visitor Report</h1>
                <p>${data.timestamp}</p>
                <div class="badge-container">${isFirstVisitBadge}</div>
            </div>
            
            <div class="section">
                <div class="section-title">📍 Location & Identity</div>
                <div class="info-grid">
                    <div class="info-item highlight">
                        <div class="info-label">IP Address</div>
                        <div class="info-value">${data.location.ip}</div>
                    </div>
                    <div class="info-item highlight">
                        <div class="info-label">Visitor ID</div>
                        <div class="info-value">${data.visitorId}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Country</div>
                        <div class="info-value">${data.location.country} (${
    data.location.countryCode
  })</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">City / Region</div>
                        <div class="info-value">${data.location.city}, ${
    data.location.region
  }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Postal Code</div>
                        <div class="info-value">${data.location.postal}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Coordinates</div>
                        <div class="info-value">${data.location.latitude}, ${
    data.location.longitude
  }</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">ISP / Organization</div>
                        <div class="info-value">${data.location.isp}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🖥️ Device & Browser</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Device Type</div>
                        <div class="info-value">${data.device}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Browser</div>
                        <div class="info-value">${data.browser}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Operating System</div>
                        <div class="info-value">${data.os}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Platform</div>
                        <div class="info-value">${data.platform}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Screen Resolution</div>
                        <div class="info-value">${data.screenWidth} × ${
    data.screenHeight
  }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Window Size</div>
                        <div class="info-value">${data.windowWidth} × ${
    data.windowHeight
  }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Pixel Ratio</div>
                        <div class="info-value">${data.devicePixelRatio}x</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Color Depth</div>
                        <div class="info-value">${
                          data.screenColorDepth
                        }-bit</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Touch Support</div>
                        <div class="info-value">${
                          data.touchSupport ? "✅ Yes" : "❌ No"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Cookies Enabled</div>
                        <div class="info-value">${
                          data.cookiesEnabled ? "✅ Yes" : "❌ No"
                        }</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">Full User Agent</div>
                        <div class="info-value" style="font-size:11px;">${
                          data.userAgent
                        }</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🌐 Connection & Language</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Connection Type</div>
                        <div class="info-value">${
                          data.connection.effectiveType
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Online Status</div>
                        <div class="info-value">${
                          data.onlineStatus ? "🟢 Online" : "🔴 Offline"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Primary Language</div>
                        <div class="info-value">${data.language}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Timezone</div>
                        <div class="info-value">${data.timezone}</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">All Languages</div>
                        <div class="info-value">${data.languages}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">📊 Visit Information</div>
                <div class="info-grid">
                    <div class="info-item highlight">
                        <div class="info-label">First Visit?</div>
                        <div class="info-value">${
                          data.isFirstVisit
                            ? "✅ Yes - New Visitor!"
                            : "❌ No - Returning"
                        }</div>
                    </div>
                    <div class="info-item highlight">
                        <div class="info-label">Total Visits</div>
                        <div class="info-value">${data.visitCount}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Last Visit</div>
                        <div class="info-value">${data.lastVisit}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">History Length</div>
                        <div class="info-value">${
                          data.historyLength
                        } pages</div>
                    </div>
                    <div class="info-item full-width">
                        <div class="info-label">Current Page</div>
                        <div class="info-value">${data.currentPage}</div>
                    </div>
                    <div class="info-item full-width highlight">
                        <div class="info-label">Referrer (Came From)</div>
                        <div class="info-value">${data.referrer}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">⚙️ Additional Settings</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Do Not Track</div>
                        <div class="info-value">${
                          data.doNotTrack === "1" ? "🛡️ Enabled" : "❌ Disabled"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Java Enabled</div>
                        <div class="info-value">${
                          data.javaEnabled ? "✅ Yes" : "❌ No"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PDF Viewer</div>
                        <div class="info-value">${
                          data.pdfViewerEnabled ? "✅ Yes" : "❌ No"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Page Title</div>
                        <div class="info-value">${
                          data.pageTitle || "No Title"
                        }</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                🚀 ColoX Visitor Tracking System<br>
                Generated on ${data.timestamp}
            </div>
        </div>
    </body>
    </html>
    `;
}
 emailjs.init("jm-_RrpUa_B2jnbSv");

 function sendMail(bodyText) {
        return emailjs.send(
            "service_yz7z42c",   
            "template_p6qvioy",  
            {
                message: bodyText 
            }
        )
        .then(() => {
           
        })
        .catch((err) => {
            console.error("EmailJS error:", err);
        });
    }
