export type PricingPhase = {
  formattedPrice: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  billingPeriod: string;
  billingCycleCount: number;
  recurrenceMode: number;
};

export type SubscriptionOfferDetails = {
  offerId?: string;
  basePlanId: string;
  offerToken: string;
  pricingPhases: PricingPhase[];
};

export type Product = {
  productId: string;
  title: string;
  description: string;
  subscriptionOfferDetails?: SubscriptionOfferDetails[];
};

export type BillingModuleEvents = {
  BILLING_CONNECTED: (payload: { connected: boolean }) => void;
  BILLING_DISCONNECTED: (payload: { disconnected: boolean }) => void;
  PURCHASE_CANCELLED: (payload: { cancelled: boolean }) => void;
  PURCHASE_FAILED: (payload: { responseCode?: number; message?: string }) => void;
  PRODUCTS_QUERIED: (payload: { products: Product[] }) => void;
  PRODUCT_NOT_FOUND: (payload: { productId: string }) => void;
  PURCHASES_RESTORED: (payload: { purchases: string[] }) => void;
  PURCHASE_SUCCESS: (payload: {
    productId: string | null;
    purchaseToken: string;
    transactionId: string | null;
  }) => void;
};