export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const previewOrigin = /^https:\/\/[a-z0-9-]+\.v0\.build$/i;

function allowedOrigin(origin, req) {
  if (!origin) return true;
  const protocol = (req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
  if (req.headers.host && origin === `${protocol}://${req.headers.host}`) return true;
  if (
    origin === "http://localhost:5173" ||
    origin === "http://127.0.0.1:5173" ||
    previewOrigin.test(origin)
  ) return true;

  const deploymentHosts = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter(Boolean)
    .map((host) => `https://${host.replace(/^https?:\/\//, "")}`);

  try {
    const configuredApi = process.env.VITE_API_URL;
    if (configuredApi && new URL(configuredApi).origin === origin) return true;
  } catch {
    return false;
  }

  return deploymentHosts.includes(origin);
}

export function prepareApiResponse(req, res, methods) {
  res.setHeader("Cache-Control", "no-store");
  const origin = req.headers.origin;
  if (!allowedOrigin(origin, req)) {
    res.status(403).json({ detail: "This origin is not allowed." });
    return false;
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", methods.join(", "));
  res.setHeader("Access-Control-Max-Age", "600");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }
  return true;
}

export function sendApiError(res, error) {
  const status = error instanceof ApiError ? error.status : 500;
  if (status >= 500) console.error("[api] Request failed", error?.name || "UnknownError");
  const detail = error instanceof ApiError ? error.message : "The service is temporarily unavailable. Please try again.";
  return res.status(status).json({ detail });
}
