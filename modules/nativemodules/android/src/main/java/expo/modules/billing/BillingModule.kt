package expo.modules.billing

import android.app.Activity
import com.android.billingclient.api.*
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

/**
 * An Expo Native Module for integrating Google Play Billing (In-App Purchases and Subscriptions).
 */
class BillingModule : Module(), PurchasesUpdatedListener {

  private var billingClient: BillingClient? = null
  // Cache to store product details because launchBillingFlow needs the object
  private val productsCache = mutableMapOf<String, ProductDetails>()

  // Helper: Check if billing client is initialized AND connected
  private fun isBillingReady(): Boolean {
    return billingClient != null && billingClient!!.isReady
  }

  override fun definition() = ModuleDefinition {
    Name("BillingModule")

    // --- 1. Events ---
    // Register all events that we send to JS
    Events(
      "BILLING_CONNECTED",
      "BILLING_DISCONNECTED",
      "PRODUCTS_QUERIED",
      "PRODUCT_NOT_FOUND",
      "PURCHASES_RESTORED",
      "PURCHASE_CANCELLED", // Triggered on user cancellation
      "PURCHASE_FAILED",    // Triggered on billing error or failed acknowledgement
      "PURCHASE_SUCCESS"    // Triggered upon successful purchase and acknowledgement
    )

    // --- 2. Lifecycle Hooks ---
    // Initialize Billing Client when module loads
    OnCreate {
      val context = appContext.reactContext
      if (context != null) {
        billingClient = BillingClient.newBuilder(context)
          .setListener(this@BillingModule)
          .enablePendingPurchases()
          .build()
        
        connectToBilling()
      }
    }

    // Crucial: Disconnect and clear resources when the module is destroyed
    // OnDestroy {
    //   billingClient?.let { client ->
    //     if (client.isReady) {
    //       // It's crucial to call endConnection() when the activity is destroyed
    //       // to prevent memory leaks and unhandled callbacks.
    //       client.endConnection()
    //     }
    //   }
    //   billingClient = null // Clear the reference
    //   productsCache.clear() // Clear the cache
    // }

    // --- 3. Async Functions (JS exposed) ---
    
    // Function: Query Products
    AsyncFunction("queryProducts") { productIds: List<String>, productType: String ->
      if (!isBillingReady()) {
        // Send empty products so JS doesn't hang waiting for event
        sendEvent("PRODUCTS_QUERIED", mapOf("products" to emptyList<Map<String, Any?>>()))
        return@AsyncFunction Unit
      }

      val productList = productIds.map { id ->
        QueryProductDetailsParams.Product.newBuilder()
          .setProductId(id)
          .setProductType(productType)
          .build()
      }

      val params = QueryProductDetailsParams.newBuilder().setProductList(productList).build()

      billingClient!!.queryProductDetailsAsync(params) { _, productDetailsList ->
        // Convert the complex Google object to a Simple Map for JS
        val products = productDetailsList.map { productDetails ->
          productsCache[productDetails.productId] = productDetails // Cache it

          mapOf(
            "productId" to productDetails.productId,
            "title" to productDetails.title,
            "description" to productDetails.description,
            "subscriptionOfferDetails" to productDetails.subscriptionOfferDetails?.map { offer ->
              mapOf(
                "offerId" to offer.offerId,
                "basePlanId" to offer.basePlanId,
                "offerToken" to offer.offerToken,
                "pricingPhases" to offer.pricingPhases.pricingPhaseList.map { phase ->
                  mapOf(
                    "formattedPrice" to phase.formattedPrice,
                    "priceAmountMicros" to phase.priceAmountMicros.toDouble(),
                    "priceCurrencyCode" to phase.priceCurrencyCode,
                    "billingPeriod" to phase.billingPeriod,
                    "billingCycleCount" to phase.billingCycleCount,
                    "recurrenceMode" to phase.recurrenceMode
                  )
                }
              )
            }
          )
        }

        // Send Event with the data
        sendEvent("PRODUCTS_QUERIED", mapOf("products" to products))
      }
    }

    // Function: Buy Product
    AsyncFunction("buyProduct") { productId: String, offerToken: String? ->
      if (!isBillingReady()) {
        sendEvent("PURCHASE_FAILED", mapOf("message" to "Billing client is not ready. Please try again."))
        return@AsyncFunction Unit
      }

      val productDetails = productsCache[productId]
      if (productDetails == null) {
        sendEvent("PRODUCT_NOT_FOUND", mapOf("productId" to productId))
        return@AsyncFunction Unit
      }

      val productDetailsParams = BillingFlowParams.ProductDetailsParams.newBuilder()
        .setProductDetails(productDetails)

      if (offerToken != null) {
        productDetailsParams.setOfferToken(offerToken)
      }

      val billingFlowParams = BillingFlowParams.newBuilder()
        .setProductDetailsParamsList(listOf(productDetailsParams.build()))
        .build()

      // Get Current Activity from Expo Context
      val activity: Activity? = appContext.currentActivity
      if (activity != null) {
        billingClient!!.launchBillingFlow(activity, billingFlowParams)
      } else {
        sendEvent("PURCHASE_FAILED", mapOf("message" to "Current Activity is null."))
      }
    }

    // Function: Restore Purchases
    AsyncFunction("restorePurchases") {
      if (!isBillingReady()) {
        sendEvent("PURCHASE_FAILED", mapOf("message" to "Billing client is not ready. Please try again."))
        return@AsyncFunction Unit
      }

      val params = QueryPurchasesParams.newBuilder()
        .setProductType(BillingClient.ProductType.SUBS) // Querying subscriptions for restoration
        .build()

      billingClient!!.queryPurchasesAsync(params) { billingResult, purchases ->
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
          val restored = purchases
            .filter { it.purchaseState == Purchase.PurchaseState.PURCHASED }
            .map { it.products.first() }
          
          sendEvent("PURCHASES_RESTORED", mapOf("purchases" to restored))
        } else {
          // Send a failure event if restoration query fails
          sendEvent("PURCHASE_FAILED", mapOf("message" to "Restore purchases failed: ${billingResult.debugMessage}"))
        }
      }
    }

    // Function: Check for an active subscription
    AsyncFunction("checkSubscriptionActive") { productId: String, promise: Promise ->
      if (!isBillingReady()) {
        promise.reject("BILLING_NOT_READY", "Billing client is not ready. Please try again.", null)
        return@AsyncFunction Unit
      }

      val params = QueryPurchasesParams.newBuilder()
        .setProductType(BillingClient.ProductType.SUBS)
        .build()

      billingClient!!.queryPurchasesAsync(params) { billingResult, purchases ->
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
          val isActive = purchases.any { purchase ->
            purchase.products.contains(productId) && purchase.purchaseState == Purchase.PurchaseState.PURCHASED
          }
          promise.resolve(isActive)
        } else {
          // Reject the promise if the query fails
          promise.reject("QUERY_FAILED", "Failed to query purchases: ${billingResult.debugMessage}", null)
        }
      }
    }
  }

  // --- 4. Helper Functions and Billing Callbacks ---

  // Helper: Connect Logic
  private fun connectToBilling() {
    billingClient?.startConnection(object : BillingClientStateListener {
      override fun onBillingSetupFinished(billingResult: BillingResult) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
          sendEvent("BILLING_CONNECTED", mapOf("connected" to true))
        }
      }
      override fun onBillingServiceDisconnected() {
        sendEvent("BILLING_DISCONNECTED", mapOf("disconnected" to true))
        // Production Note: You should implement a retry policy here.
        connectToBilling() 
      }
    })
  }

  // Helper: Handle Updates from all purchase flows (Crucial: This runs on the Main Thread)
  override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {

    when (billingResult.responseCode) {
  
      BillingClient.BillingResponseCode.USER_CANCELED -> {
        sendEvent("PURCHASE_CANCELLED", mapOf("cancelled" to true))
        return
      }
  
      BillingClient.BillingResponseCode.OK -> {
  
        if (purchases == null) {
          // Google sends OK + null when user cancels on some devices
          sendEvent(
            "PURCHASE_FAILED",
            mapOf(
              "responseCode" to billingResult.responseCode,
              "message" to "Purchase returned null purchases"
            )
          )
          return
        }
  
        purchases.forEach { purchase ->
          if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED &&
              !purchase.isAcknowledged
          ) {
            handlePurchase(purchase)
          }
        }
  
        return
      }
  
      else -> {
        // Always ensure message is NEVER null
        val message = billingResult.debugMessage ?: "Unknown error"
        sendEvent(
          "PURCHASE_FAILED",
          mapOf(
            "responseCode" to billingResult.responseCode,
            "message" to message
          )
        )
        return
      }
    }
  }

  // Helper: Acknowledge Purchase and notify JS
  private fun handlePurchase(purchase: Purchase) {
    if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED && !purchase.isAcknowledged) {

      if (!isBillingReady()) {
        sendEvent("PURCHASE_FAILED", mapOf("message" to "Billing client disconnected during purchase acknowledgement."))
        return
      }

      val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
        .setPurchaseToken(purchase.purchaseToken)
        .build()

      // Acknowledge the purchase
      billingClient!!.acknowledgePurchase(acknowledgePurchaseParams) { ackResult ->

        if (ackResult.responseCode == BillingClient.BillingResponseCode.OK) {
          // SUCCESS: Purchase acknowledged
          val map = mapOf(
            "productId" to purchase.products.firstOrNull(),
            "purchaseToken" to purchase.purchaseToken,
            "transactionId" to purchase.orderId
          )
          sendEvent("PURCHASE_SUCCESS", map)

        } else {
          // FAILED: Failed to acknowledge purchase
          val errorDetails = mapOf(
            "responseCode" to ackResult.responseCode,
            "message" to "Failed to acknowledge purchase: ${ackResult.debugMessage}"
          )
          sendEvent("PURCHASE_FAILED", errorDetails)
        }
      }
    }
  }
}