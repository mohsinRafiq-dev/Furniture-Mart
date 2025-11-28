import { apiConfig } from "../config/api";

// Generate or retrieve session ID
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem("furniture_mart_session_id");

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("furniture_mart_session_id", sessionId);
  }

  return sessionId;
};

// Detect device type
export const detectDeviceType = (): "mobile" | "tablet" | "desktop" => {
  const width = window.innerWidth;

  if (width < 768) {
    return "mobile";
  } else if (width < 1024) {
    return "tablet";
  }

  return "desktop";
};

// Detect traffic source
export const detectTrafficSource = (): "direct" | "search" | "social" | "referral" => {
  const referrer = document.referrer.toLowerCase();

  if (!referrer) {
    return "direct";
  }

  if (
    referrer.includes("google") ||
    referrer.includes("bing") ||
    referrer.includes("yahoo")
  ) {
    return "search";
  }

  if (
    referrer.includes("facebook") ||
    referrer.includes("twitter") ||
    referrer.includes("instagram") ||
    referrer.includes("linkedin")
  ) {
    return "social";
  }

  return "referral";
};

// Track visitor session on page load
export const trackVisitorSession = async (): Promise<void> => {
  try {
    const sessionId = getOrCreateSessionId();
    const ipAddress = await getClientIp();

    const response = await fetch(`${apiConfig.baseURL}/analytics/track-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        ipAddress,
        userAgent: navigator.userAgent,
        referrer: document.referrer || "direct",
        source: detectTrafficSource(),
        deviceType: detectDeviceType(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to track session");
    }

    // Store session tracking timestamp
    sessionStorage.setItem("session_tracked", "true");
  } catch (error) {
    console.warn("Analytics: Failed to track session", error);
    // Fail silently - don't break the app
  }
};

// Track product view
export const trackProductView = async (
  productId: string,
  productName: string,
  action: "view" | "add_to_cart" | "purchase" | "wishlist",
  timeSpent?: number
): Promise<void> => {
  try {
    const sessionId = getOrCreateSessionId();

    const response = await fetch(
      `${apiConfig.baseURL}/analytics/track-product-view`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          sessionId,
          action,
          timeSpent: timeSpent || 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to track product view");
    }
  } catch (error) {
    console.warn("Analytics: Failed to track product view", error);
    // Fail silently - don't break the app
  }
};

// Get analytics summary (admin only)
export const getAnalyticsSummary = async (days: number = 30): Promise<any> => {
  try {
    const response = await fetch(
      `${apiConfig.baseURL}/analytics/summary?days=${days}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics summary");
    }

    return await response.json();
  } catch (error) {
    console.error("Analytics: Failed to fetch summary", error);
    throw error;
  }
};

// Get product analytics (admin only)
export const getProductAnalytics = async (productId: string): Promise<any> => {
  try {
    const response = await fetch(`${apiConfig.baseURL}/analytics/product/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product analytics");
    }

    return await response.json();
  } catch (error) {
    console.error("Analytics: Failed to fetch product analytics", error);
    throw error;
  }
};

// Get client IP (using ipify API)
const getClientIp = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch {
    return "unknown";
  }
};
