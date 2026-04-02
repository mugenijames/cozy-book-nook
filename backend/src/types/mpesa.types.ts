// backend/src/types/mpesa.types.ts
export interface MpesaTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface MpesaStkPushResponse {
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface MpesaCallbackRequest {
  Body: {
    stkCallback: {
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string;
        }>;
      };
    };
  };
}