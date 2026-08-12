
import axios from "axios";

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  environment: "sandbox" | "production";
}

interface AccessTokenResponse {
  access_token: string;
  expires_in?: string;
}

class MpesaService {
  private config: MpesaConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.config = {
      consumerKey: process.env.MPESA_CONSUMER_KEY || "",
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
      shortcode: process.env.MPESA_SHORTCODE || "",
      passkey: process.env.MPESA_PASSKEY || "",
      environment:
        (process.env.MPESA_ENVIRONMENT as "sandbox" | "production") ||
        "sandbox",
    };

    if (!this.config.consumerKey) {
      console.warn("⚠️ MPESA_CONSUMER_KEY is missing");
    }

    if (!this.config.consumerSecret) {
      console.warn("⚠️ MPESA_CONSUMER_SECRET is missing");
    }

    if (!this.config.shortcode) {
      console.warn("⚠️ MPESA_SHORTCODE is missing");
    }

    if (
      this.config.environment === "production" &&
      !this.config.passkey
    ) {
      console.warn("⚠️ MPESA_PASSKEY is missing");
    }
  }

  /**
   * Get M-Pesa OAuth access token
   */
  private async getAccessToken(): Promise<string> {
    // Reuse existing token if still valid
    if (
      this.accessToken &&
      this.tokenExpiry &&
      Date.now() < this.tokenExpiry
    ) {
      return this.accessToken;
    }

    if (
      !this.config.consumerKey ||
      !this.config.consumerSecret
    ) {
      throw new Error(
        "M-Pesa consumer key or consumer secret is not configured"
      );
    }

    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString("base64");

    const url =
      this.config.environment === "sandbox"
        ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    try {
      console.log("🔐 Requesting M-Pesa access token...");

      const response = await axios.get<AccessTokenResponse>(
        url,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      const accessToken = response.data.access_token;

      if (!accessToken) {
        throw new Error(
          "M-Pesa response did not contain an access token"
        );
      }

      this.accessToken = accessToken;

      // Keep token for approximately 55 minutes
      this.tokenExpiry = Date.now() + 55 * 60 * 1000;

      console.log("✅ M-Pesa access token obtained");

      return accessToken;
    } catch (error: any) {
      console.error(
        "❌ Failed to get M-Pesa access token:",
        error.response?.data || error.message
      );

      throw new Error("M-Pesa service unavailable");
    }
  }

  /**
   * STK Push
   * Lipa Na M-Pesa Online
   */
  async stkPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string
  ) {
    const accessToken = await this.getAccessToken();

    // Format phone number to 2547XXXXXXXX
    let formattedPhone = String(phoneNumber).trim();

    if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    }

    if (!/^2547\d{8}$/.test(formattedPhone)) {
      throw new Error(
        "Invalid Kenyan phone number. Use 07XXXXXXXX or 2547XXXXXXXX."
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    if (!this.config.shortcode) {
      throw new Error("M-Pesa shortcode is not configured");
    }

    if (!this.config.passkey) {
      throw new Error("M-Pesa passkey is not configured");
    }

    const timestamp = this.getTimestamp();

    const password = Buffer.from(
      `${this.config.shortcode}${this.config.passkey}${timestamp}`
    ).toString("base64");

    const url =
      this.config.environment === "sandbox"
        ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const callbackUrl = process.env.API_PUBLIC_URL;

    if (!callbackUrl) {
      throw new Error(
        "API_PUBLIC_URL is not configured"
      );
    }

    const data = {
      BusinessShortCode: this.config.shortcode,
      Password: password,
      Timestamp: timestamp,

      // For PayBill:
      TransactionType: "CustomerPayBillOnline",

      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: this.config.shortcode,
      PhoneNumber: formattedPhone,

      CallBackURL:
        `${callbackUrl}/api/payments/mpesa/callback`,

      AccountReference:
        String(accountReference).substring(0, 12),

      TransactionDesc:
        String(transactionDesc).substring(0, 13),
    };

    try {
      console.log("📲 Sending M-Pesa STK Push...");
      console.log("Phone:", formattedPhone);
      console.log("Amount:", amount);

      const response = await axios.post(
        url,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "✅ STK Push response:",
        response.data
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ STK Push error:",
        error.response?.data || error.message
      );

      throw new Error(
        error.response?.data?.errorMessage ||
          "Payment request failed"
      );
    }
  }

  /**
   * Query STK Push transaction status
   */
  async queryStatus(checkoutRequestID: string) {
    const accessToken = await this.getAccessToken();

    if (!checkoutRequestID) {
      throw new Error(
        "CheckoutRequestID is required"
      );
    }

    if (!this.config.shortcode) {
      throw new Error(
        "M-Pesa shortcode is not configured"
      );
    }

    if (!this.config.passkey) {
      throw new Error(
        "M-Pesa passkey is not configured"
      );
    }

    const timestamp = this.getTimestamp();

    const password = Buffer.from(
      `${this.config.shortcode}${this.config.passkey}${timestamp}`
    ).toString("base64");

    const url =
      this.config.environment === "sandbox"
        ? "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        : "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query";

    const data = {
      BusinessShortCode: this.config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    try {
      console.log(
        "🔍 Querying M-Pesa transaction:",
        checkoutRequestID
      );

      const response = await axios.post(
        url,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "✅ M-Pesa query response:",
        response.data
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Query status error:",
        error.response?.data || error.message
      );

      throw new Error(
        error.response?.data?.errorMessage ||
          "Failed to query payment status"
      );
    }
  }

  /**
   * Generate Safaricom timestamp
   * Format:
   * YYYYMMDDHHmmss
   */
  private getTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const hours = String(
      now.getHours()
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    const seconds = String(
      now.getSeconds()
    ).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}

export const mpesaService = new MpesaService();

