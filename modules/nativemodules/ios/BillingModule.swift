import ExpoModulesCore
import StoreKit

public class BillingModule: Module {
  
  // Task to listen for background transaction updates (Renewals, external purchases)
  private var updateListenerTask: Task<Void, Error>? = nil
  
  public func definition() -> ModuleDefinition {
    Name("BillingModule")

    // --- 1. Events ---
    // Matches your Android events for a unified JS API
    Events(
      "PRODUCTS_QUERIED",
      "PRODUCT_NOT_FOUND",
      "PURCHASES_RESTORED",
      "PURCHASE_CANCELLED",
      "PURCHASE_FAILED",
      "PURCHASE_SUCCESS"
    )

    // --- 2. Lifecycle Hooks ---
    
    // Start listening to transactions as soon as the module loads
    OnCreate {
      startTransactionListener()
    }

    // Clean up the task when the module is destroyed
    OnDestroy {
      updateListenerTask?.cancel()
      updateListenerTask = nil
    }

    // --- 3. Async Functions ---

    // Function: Query Products
    AsyncFunction("queryProducts") { (productIds: [String], productType: String) in
      do {
        // StoreKit 2 fetches products directly
        let products = try await Product.products(for: productIds)
        
        // Map data to JSON for JS
        let formattedProducts = products.map { product in
          return [
            "productId": product.id,
            "title": product.displayName,
            "description": product.description,
            "price": product.displayPrice, // Formatted price string (e.g. $1.99)
            "priceAmount": product.price,  // Decimal number
            "currency": product.priceFormatStyle.currencyCode,
            "type": product.type == .autoRenewable ? "subs" : "inapp"
          ]
        }
        
        self.sendEvent("PRODUCTS_QUERIED", [
          "products": formattedProducts
        ])
      } catch {
        print("Failed to query products: \(error)")
        // iOS doesn't usually throw here, returning empty list instead, 
        // but safe to handle error.
        self.sendEvent("PRODUCTS_QUERIED", ["products": []])
      }
    }

    // Function: Buy Product
    // Note: 'offerToken' is Android specific, ignored here but kept for API consistency
    AsyncFunction("buyProduct") { (productId: String, offerToken: String?) in
      // 1. Fetch the product object again to ensure validity
      guard let product = try? await Product.products(for: [productId]).first else {
        self.sendEvent("PRODUCT_NOT_FOUND", ["productId": productId])
        return
      }

      // 2. Initiate Purchase
      do {
        let result = try await product.purchase()

        switch result {
        case .success(let verification):
          // The transaction is verified and successful
          let transaction = try checkVerified(verification)
          
          // Must finish the transaction to acknowledge delivery
          await transaction.finish()
          
          self.sendEvent("PURCHASE_SUCCESS", [
            "productId": transaction.productID,
            "transactionId": String(transaction.id),
            "originalTransactionId": String(transaction.originalID)
          ])

        case .userCancelled:
          self.sendEvent("PURCHASE_CANCELLED", ["cancelled": true])

        case .pending:
          // Transaction is pending (e.g. Ask to Buy)
          // We don't send success yet, the listener will catch it later
          self.sendEvent("PURCHASE_FAILED", ["message": "Transaction is pending approval."])

        @unknown default:
          self.sendEvent("PURCHASE_FAILED", ["message": "Unknown purchase result."])
        }

      } catch {
        self.sendEvent("PURCHASE_FAILED", ["message": error.localizedDescription])
      }
    }

    // Function: Restore Purchases
    // In StoreKit 2, "Restore" is just checking current entitlements.
    AsyncFunction("restorePurchases") {
      var restoredProducts: [[String: Any]] = []

      // Iterate over valid entitlements
      for await result in Transaction.currentEntitlements {
        if let transaction = try? checkVerified(result) {
          restoredProducts.append([
            "productId": transaction.productID,
            "transactionId": String(transaction.id),
            "purchaseDate": transaction.purchaseDate.timeIntervalSince1970 * 1000
          ])
        }
      }

      self.sendEvent("PURCHASES_RESTORED", ["purchases": restoredProducts])
    }

    // Function: Check Subscription Active
    AsyncFunction("checkSubscriptionActive") { (productId: String) -> Bool in
      // Iterate over entitlements to find the specific ID
      for await result in Transaction.currentEntitlements {
        if let transaction = try? checkVerified(result) {
          if transaction.productID == productId {
            // It is in entitlements, so it is active
            return true
          }
        }
      }
      return false
    }
  }

  // --- 4. Helper Functions ---

  // Helper: Start the background listener for updates (Renewals, etc.)
  private func startTransactionListener() {
    updateListenerTask = Task.detached {
      // Listen for transactions updates (e.g. subscription renewals happening in background)
      for await result in Transaction.updates {
        do {
          let transaction = try self.checkVerified(result)

          // Deliver content to the user...
          // In React Native, we just notify JS that a purchase happened/renewed
          self.sendEvent("PURCHASE_SUCCESS", [
            "productId": transaction.productID,
            "transactionId": String(transaction.id),
            "isRenewal": true
          ])

          // Always finish the transaction
          await transaction.finish()
        } catch {
          print("Transaction verification failed")
        }
      }
    }
  }

  // Helper: Verify the cryptographically signed transaction
  private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
    // Check if the transaction is verified by Apple
    switch result {
    case .unverified:
      throw NSError(domain: "StoreKit", code: 401, userInfo: [NSLocalizedDescriptionKey: "Transaction unverified"])
    case .verified(let safe):
      return safe
    }
  }
}