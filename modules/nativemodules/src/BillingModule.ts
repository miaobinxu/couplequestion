import { NativeModule, requireNativeModule } from 'expo';
import { BillingModuleEvents } from './BillingModule.types';

declare class BillingModule extends NativeModule<BillingModuleEvents> {
  
  /**
   * Queries the Store (Google Play or App Store) to get details for the specified products.
   * Emits 'PRODUCTS_QUERIED' event with the list of products.
   * * @param productIds List of product IDs (SKUs) to fetch.
   * @param productType The type of product: 'subs' (subscriptions) or 'inapp' (one-time).
   * Note: 'productType' is mainly used by Android. iOS infers type automatically but accepts the param.
   */
  queryProducts(productIds: string[], productType: 'subs' | 'inapp'): Promise<void>;
  
  /**
   * Initiates the purchase flow for a product.
   * Emits 'PURCHASE_SUCCESS', 'PURCHASE_CANCELLED', or 'PURCHASE_FAILED' event.
   * * @param productId The ID of the product to buy.
   * @param offerToken (Android Only) The specific subscription offer token. 
   * Pass `null` or `undefined` for iOS or one-time purchases.
   */
  buyProduct(productId: string, offerToken?: string | null): Promise<void>;
  
  /**
   * Checks for active entitlements and syncs them.
   * Emits 'PURCHASES_RESTORED' event with valid purchases.
   */
  restorePurchases(): Promise<void>;
  
  /**
   * Checks if a specific subscription is currently active.
   * * @param productId The subscription product ID (SKU) to check.
   * @returns A Promise that resolves to `true` if active, `false` otherwise.
   */
  checkSubscriptionActive(productId: string): Promise<boolean>;
}

// Expo automatically loads the correct native code (Kotlin for Android, Swift for iOS)
export default requireNativeModule<BillingModule>('BillingModule');