import { NextRequest } from "next/server"


export const rateLimit = {
  async check(req: NextRequest) {
    // Implement your rate limiting logic
    return { success: true }
  }
}
