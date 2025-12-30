import { EmitterSubscription, Platform } from "react-native";
import BillingModule from "../../../modules/nativemodules/src/BillingModule"; 
// Ensure the import path above points to your unified module definition file

// ----------------------------------------------------
// 1. Unified Type Definitions
// ----------------------------------------------------

// --- Android Specific Types ---
export type PricingPhase = {
  formattedPrice: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  billingPeriod: string;
  billingCycleCount: number;
  recurrenceMode: number;
};

export type SubscriptionOffer = {
  offerId: string;
  basePlanId: string;
  offerToken: string;
  pricingPhases: PricingPhase[];
};

// --- Unified Product Type (Merges Android & iOS) ---
export type Product = {
  productId: string;
  title?: string;
  description?: string;
  productType?: 'subs' | 'inapp';

  // ✅ iOS Specific Fields (StoreKit 2)
  price?: string;         // e.g. "$9.99"
  priceAmount?: number;   // e.g. 9.99
  currency?: string;      // e.g. "USD"

  // ✅ Android Specific Fields (Google Play)
  subscriptionOfferDetails?: SubscriptionOffer[];
};

// ----------------------------------------------------
// 2. Event Payload Types
// ----------------------------------------------------

type ProductsQueriedEvent = {
  products: Product[];
};

type PurchaseSuccessEvent = {
  productId: string | null;
  transactionId: string | null;
  
  // Platform specific tokens
  purchaseToken?: string;        // Android Only
  originalTransactionId?: string; // iOS Only
};

// Adjusted to handle object structure from iOS/Android
type PurchasesRestoredEvent = {
  purchases: { productId: string; transactionId?: string }[] | string[];
};

type ProductNotFoundEvent = {
  productId: string;
};

type PurchaseFailedEvent = {
  responseCode?: number; 
  message?: string;
};

// ----------------------------------------------------
// 3. Public Functions
// ----------------------------------------------------

/**
 * Queries products from the store.
 * @param ids Array of product IDs (strings).
 */
export const queryProducts = (ids: string[]): void => {
  // 'subs' is required for Android logic, iOS ignores it but accepts it.
  BillingModule.queryProducts(ids, "subs");
};

/**
 * Buys a subscription.
 * @param id The product ID.
 * @param offerToken (Android Only) Required for subscriptions. Pass null for iOS.
 */
export const buySubscription = (id: string, offerToken?: string): void => {
  if (Platform.OS === 'ios') {
    // iOS doesn't need offerToken
    BillingModule.buyProduct(id, null);
  } else {
    // Android requires offerToken for subscriptions
    BillingModule.buyProduct(id, offerToken);
  }
};

export const restorePurchases = (): void => {
  BillingModule.restorePurchases();
};

export const checkSubscriptionActive = (productId: string): Promise<boolean> => {
  return BillingModule.checkSubscriptionActive(productId);
};

// ----------------------------------------------------
// 4. Event Listener Setup
// ----------------------------------------------------

type BillingEvent =
  | { name: "PURCHASE_SUCCESS"; cb: (data: PurchaseSuccessEvent) => void }
  | { name: "PRODUCTS_QUERIED"; cb: (data: ProductsQueriedEvent) => void }
  | { name: "PURCHASES_RESTORED"; cb: (data: PurchasesRestoredEvent) => void }
  | { name: "PRODUCT_NOT_FOUND"; cb: (data: ProductNotFoundEvent) => void }
  | { name: "PURCHASE_FAILED"; cb: (data: PurchaseFailedEvent) => void }
  | { name: "PURCHASE_CANCELLED"; cb: (data: { cancelled: boolean }) => void }
  | { name: "BILLING_CONNECTED"; cb: (data: { connected: boolean }) => void }
  | { name: "BILLING_DISCONNECTED"; cb: (data: { disconnected: boolean }) => void };

export const addBillingListener = (
  event: BillingEvent
): EmitterSubscription => {
  // @ts-ignore: Event names imply string literals which match the module events
  return BillingModule.addListener(event.name, event.cb);
};