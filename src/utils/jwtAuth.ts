
import jwt from 'jsonwebtoken';
interface TokenPayload {
    userId: string;
  }

export function jwtAuth(req:any) {
    const token = req.headers.authorization?.split(" ")[1] || "";
    if (!token) return { user: null };

    try {
      const decoded = jwt.verify(token, process.env.APP_SECRET || "") as TokenPayload;
      return { user: decoded };
    } catch (e) {
      console.log("JWT verification error:", e);
      return { user: null };
    }

}