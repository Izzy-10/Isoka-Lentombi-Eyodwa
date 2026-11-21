import { requireFirebaseUser } from "../../server/firebase-auth.js";
import { prepareApiResponse, sendApiError } from "../../server/http.js";

const allowedMethods = ["GET", "OPTIONS"];

export default async function handler(req, res) {
  if (!prepareApiResponse(req, res, allowedMethods)) return;
  if (!allowedMethods.includes(req.method)) {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ detail: "Method not allowed." });
  }

  try {
    await requireFirebaseUser(req);
    return res.status(200).json({ tier: "free", status: "inactive" });
  } catch (error) {
    return sendApiError(res, error);
  }
}
