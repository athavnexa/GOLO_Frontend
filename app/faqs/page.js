"use client";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
// Each section id matches the anchor used in the HTML sidebar nav.
// Answers use \n for line breaks which the renderer converts to <br/>.
const SECTIONS = [
  { id:"1-general-golo-faq", title:"1. General GOLO FAQ", qs:[
    ["1. What is GOLO?","GOLO is a hyper-local discovery and retail savings platform designed to connect neighborhood merchants with local shoppers. It allows customers to discover nearby retail stores, browse real-time product catalogs, claim exclusive discount vouchers, and interact directly with store owners. For local merchants, GOLO provides digital storefronts, inventory management tools, geo-targeted promotional ad campaigns, and voucher redemption verification."],
    ["2. How does GOLO work?","For Customers: Shoppers set their location, discover promotions and products in their vicinity, claim digital vouchers with unique QR codes, and redeem them at physical store counters or chat with merchants in real time.\nFor Merchants: Store owners register their business, set store location coordinates, list products, launch time-bound promotional deals and banners, track customer analytics, and scan customer QR codes to validate voucher redemptions."],
    ["3. Who can use GOLO?","Customers / Shoppers: Anyone looking to find local deals, explore neighborhood stores, save money with vouchers, and earn loyalty rewards.\nMerchants / Retailers: Local business owners (boutiques, supermarkets, restaurants, specialty shops) wanting to increase footfall and digitize their business.\nService Providers: Local professionals offering appointment-based services."],
    ["4. Is GOLO available to merchants?","Yes. GOLO provides dedicated merchant tools and an onboarding portal. Merchants can manage store profiles, configure business hours, maintain inventory, launch banner promotions, manage customer orders, and view performance metrics from a unified merchant dashboard."],
    ["5. Is GOLO available as a mobile application?","Yes. GOLO is built as a fully responsive, mobile-first platform with dedicated customer and merchant mobile experiences, supporting push notifications, real-time map navigation, camera-based QR scanning, and mobile chat."],
    ["6. How can I contact GOLO support?","Customers and merchants can access the integrated Help Center & Support Ticket System. You can raise support tickets categorized by topic (Billing, Technical, Security, Products), chat directly with support representatives within the ticket thread, or reach out via official support email (support@golo.com)."],
  ]},
  { id:"2-customer-faq", title:"2. Customer FAQ", qs:[
    ["1. Can I use GOLO without creating an account?","Yes, guest visitors can browse the home page, explore product categories, view nearby merchant locations, and inspect deal details. However, to claim offer vouchers, save items to your wishlist, message merchants, post ads, or earn loyalty points, an account is required."],
    ["2. How do I search for a product on GOLO?","Search Bar: Type keywords, brands, or item names into the top navigation search bar.\nCategory Filter: Browse curated category sections.\n\"I Want\" Assistant: Use the intent discovery tool to enter what you are looking for, and GOLO will match nearby merchants and products."],
    ["3. How do I find offers and deals near me?","1. Click Nearby Deals in the navigation bar.\n2. Allow location access or manually set your current city or area via Select Location.\n3. View nearby deals sorted by distance on interactive maps and deal cards."],
    ["4. How do I view a merchant's store and catalog?","Click on any merchant's name or store card from a deal or search listing to navigate to their Public Store Profile. You can view their full product catalog, active promotions, store photos, address, operating hours, and contact details."],
    ["5. How do I claim an offer voucher?","1. Find a deal that interests you on the home page or nearby deals feed.\n2. Click Claim Offer on the deal card.\n3. The platform generates a digital voucher containing a unique alphanumeric code and QR code stored in your account.\n4. Present this QR code or voucher ID at the merchant store to redeem your discount."],
    ["6. How do I contact a merchant?","In-App Chat: Click the \"Chat with Merchant\" button on any product or deal page.\nPhone / Calling: View the store's contact number listed on their public merchant page or initiate an in-app call.\nStore Visit: Use the integrated store map and turn-by-turn directions to visit the merchant's physical location."],
    ["7. How do I add items to my Wishlist?","Click the Heart / Wishlist icon on any product or deal card. You can view and manage all saved items anytime under Profile → Wishlist."],
    ["8. How do customer loyalty points / reward stars work?","When you claim and redeem eligible promotional offers, merchants can reward you with loyalty points or reward stars. These accumulated points can be viewed in your profile and redeemed for future discounts at participating stores."],
    ["9. How do I report a problem with a product or merchant?","1. Open the specific product, deal, or merchant profile page.\n2. Click the Report / Flag button.\n3. Select the reason (e.g., fraudulent pricing, expired voucher rejection, inappropriate content, counterfeit item).\n4. Add a description and optional proof or screenshots, then click Submit Report. GOLO moderators will review and take appropriate action."],
    ["10. How do I return a product purchased at a store?","For purchases made offline using GOLO discount vouchers, returns and exchanges are governed by the individual merchant's store return policy. Customers should present their original store receipt and voucher ID at the merchant counter. If an online order dispute arises, contact the merchant through in-app Chat or submit a support ticket under the Help Center."],
  ]},
  { id:"3-account-faq", title:"3. Account FAQ", qs:[
    ["1. What account types are supported on GOLO?","GOLO supports two distinct account types:\nCustomer Account: For shoppers exploring neighborhood deals, claiming vouchers, saving favorites, and chatting with merchants.\nMerchant Account: For business owners creating digital storefronts, listing products, launching offers, and scanning vouchers."],
    ["2. How do I create a GOLO customer account?","1. Navigate to the Register page.\n2. Select the Customer account type.\n3. Enter your full name, email address, mobile number, and create a secure password (with optional referral code).\n4. Enter the 6-digit Email OTP sent to your inbox to verify your email address.\n5. Once verified, your account is activated and you are automatically logged in."],
    ["3. How do I log in to my GOLO account?","1. Go to the Login page.\n2. Enter your registered email address and password.\n3. Alternatively, click Continue with Google to log in instantly via Google Social Authentication.\n4. Click Sign In to access your account."],
    ["4. How does Google Social Login work on GOLO?","Clicking Continue with Google authenticates your identity securely. If you are a new user, a customer account is automatically created using your verified Google email, name, and profile picture without requiring manual OTP verification."],
    ["5. How do I update my profile details and address?","1. Click on your profile avatar in the header and select Profile.\n2. Click Edit Profile.\n3. You can update your display name, profile avatar photo, phone number, bio, street address, city, state, postal code, gender, date of birth, and shopping interest categories.\n4. Click Save Changes to update your profile."],
    ["6. How do I change my password?","1. Log in and navigate to Profile → Security / Account Settings.\n2. Select Change Password.\n3. Enter your current password and your new password.\n4. Click Update Password to confirm the change."],
    ["7. What should I do if I forget my password?","1. On the login screen, click \"Forgot Password?\".\n2. Enter your registered email address and click Send OTP.\n3. Check your email for the 6-digit verification code.\n4. Enter the OTP and your new password on the reset screen.\n5. Click Submit to set your new password and log in."],
    ["8. Why do I need to verify my email with an OTP?","Email OTP verification ensures that all user accounts are tied to valid, reachable email addresses. This protects user accounts against unauthorized takeovers and ensures you receive important order confirmations, voucher details, and security alerts."],
    ["9. How can I delete my GOLO account?","1. Go to Profile → Account Settings → Delete Account.\n2. Provide your account password and select a reason for deletion.\n3. Confirm the deletion prompt. Your account will be permanently deactivated, active session tokens revoked, and personal data removed in accordance with privacy regulations."],
    ["10. What happens to my data and wallet balance when I delete my account?","Upon account deletion, your personal profile data is scrubbed, active vouchers are invalidated, and any unspent wallet balance is forfeited. It is strongly recommended to utilize your wallet balance before submitting an account deletion request."],
  ]},
  { id:"4-merchant-faq", title:"4. Merchant FAQ", qs:[
    ["1. How can I register as a merchant on GOLO?","1. Visit the Merchant Portal and click Register as Merchant.\n2. Fill in your store name, business email, contact number, store category, and create a password.\n3. Provide your physical store address and pin your location on the map.\n4. Verify your email with the OTP sent to complete the initial registration."],
    ["2. What information is required for merchant registration?","• Store / Business Name & Description\n• Official Business Email & Contact Number\n• Store Category & Sub-Category\n• Complete Physical Address with GPS Map Coordinates\n• Business Proof / KYC Documents (Shop photo, Aadhaar, PAN card)\n• GST Number (optional for micro-sellers, required for standard commercial tiers)"],
    ["3. Do I need a GST number to register as a merchant?","A GST number is not strictly mandatory for initial basic merchant onboarding; however, submitting a valid GST number is required to receive a Verified Merchant Badge, access higher product listing quotas, and participate in featured platform promotions."],
    ["4. How does merchant verification (KYC) work?","Once a merchant submits their business details and identity documents (PAN, Aadhaar, store photo), the GOLO Admin Compliance team reviews the application. Once verified, the merchant's status updates from \"Pending\" to \"Active\", unlocking all merchant privileges."],
    ["5. How long does merchant verification take?","Merchant verification is typically completed within 24 to 48 business hours. Merchants can monitor their verification status directly on the Merchant Dashboard banner."],
    ["6. How can I add a product to my store catalog?","1. Open the Merchant Dashboard and go to Products → Add Product.\n2. Enter the Product Name, Category, Description, Regular Price, Discount Price, and Initial Stock Quantity.\n3. Add SKU/Barcode, Weight, and Dimensions (optional).\n4. Upload high-quality product images and brand logos.\n5. Click Publish Product to make it visible to customers."],
    ["7. How can I update my product information?","1. Go to Products on the Merchant Dashboard.\n2. Click on the product you wish to modify.\n3. Edit pricing, stock count, description, or images.\n4. Click Save Updates. Changes reflect immediately in customer search results."],
    ["8. How can I remove or discontinue a product?","In the Products section, click the Delete icon next to the product or toggle its visibility status to \"Inactive\" / \"Discontinued\". Deactivating a product hides it from public search while preserving past analytics."],
    ["9. How can I create an offer or deal?","1. Navigate to Offers → Create Offer.\n2. Enter Offer Title, Promotion Tag (e.g., Flash Sale, Weekend Special), and Description.\n3. Upload promotional banner images or video.\n4. Select products from your catalog to include in the offer and specify discounted offer prices.\n5. Select campaign start and end dates.\n6. Configure optional loyalty points/reward stars for customers.\n7. Confirm platform fee/credits and submit for publishing."],
    ["10. How do I scan and validate customer vouchers?","Merchants can use the in-app Voucher Scanner on the Merchant Dashboard or Merchant Mobile App. Scan the customer's voucher QR code using your device camera or manually input the alphanumeric voucher code. The system checks voucher validity in real time, marks it as redeemed, and updates stock and analytics."],
    ["11. How can I manage my inventory?","In the Products tab, you can view live stock counts for every item. As customers purchase products or redeem vouchers, stock counts update automatically. You can quickly edit quantities, set low-stock thresholds, or mark items as out-of-stock."],
    ["12. How can I manage incoming orders?","Go to Orders on your dashboard to view pending, accepted, rejected, and completed orders. You can accept new orders, prepare items, and mark orders completed upon customer pickup or voucher scan."],
    ["13. How do merchant commissions and fees work?","GOLO operates transparently with tiered subscription plans and daily promotional campaign rates rather than charging heavy commissions on physical store sales. For digital transactions processed directly through the platform, standard minimal payment gateway processing fees apply as outlined in the Merchant Agreement."],
    ["14. What happens if a merchant violates GOLO policies?","Violations (such as false advertising, counterfeit goods, refusing valid vouchers, or high complaint rates) result in risk score penalties, temporary content upload restrictions, offer locking, or account suspension."],
    ["15. Why can a merchant account be suspended?","Accounts may be suspended for reasons including:\n• Submission of fake or invalid KYC documents.\n• Listing prohibited or illegal products.\n• Repeated failure to honor claimed vouchers.\n• Multiple verified customer fraud reports.\n• Non-compliance with community guidelines."],
    ["16. How can a suspended merchant account be reviewed or reinstated?","Merchants can submit an appeal through the Support Center or contact compliance support. The Compliance Team will re-audit the account, review submitted evidence, and reinstate the account if all compliance standards are satisfied."],
    ["17. What products are prohibited on GOLO?","Prohibited items include:\n• Weapons, firearms, explosives, and fireworks.\n• Illegal drugs, narcotics, prescription-only medicines, and drug paraphernalia.\n• Counterfeit or replica items, pirated software, and copyright-infringing media.\n• Adult, pornographic, or sexually explicit content.\n• Hazardous chemicals, stolen goods, and government-restricted wildlife products."],
  ]},
    { id:"6-product-faq", title:"6. Product FAQ", qs:[
    ["1. How do I search for a product?","Use the top global search bar on any page to search by product name, brand, or category. You can also filter by category pages, sort by nearest distance, price, or rating, or use the \"I Want\" search assistant."],
    ["2. How do I view product details?","Click on any product card in search results or merchant store pages. The Product Details page opens, displaying full specifications, images, pricing, merchant details, and customer reviews."],
    ["3. How can I see the price of a product?","Product pricing is prominently displayed on the product card and details page, showing both the Regular Price (M.R.P.) and the active Discounted / Offer Price where applicable."],
    ["4. Can I see product reviews and ratings?","Yes. Customer ratings and verified purchase reviews are shown on the product details page. Reviews include star ratings, written comments, and reviewer display names. You can post your own review after interacting with the product by clicking Write a Review."],
    ["5. How do I add a product to my Wishlist?","Click the Heart / Save icon visible on any product card or product details page to add it to your Wishlist. Access all saved items from Profile → Wishlist."],
    ["6. How do I know if a product is available in stock?","Product availability is indicated by a stock status badge on the product listing (In Stock / Out of Stock). If a product goes out of stock, you can contact the merchant via GOLO Chat to request restocking notification."],
    ["7. How do I know which merchant sells a product?","Every product listing displays the selling merchant's store name, distance from your location, store address, and a direct link to the merchant's store profile."],
    ["8. Can product information change?","Yes. Merchants have real-time control over their catalogs and can update product pricing, stock availability, descriptions, and images at any time."],
    ["9. What should I do if product information appears incorrect?","Click the \"Report Product\" button on the product page to alert GOLO moderators, or message the merchant directly via GOLO Chat for real-time clarification."],
    ["10. How can a merchant add a product?","From the Merchant Dashboard, go to Products → Add Product, fill in title, pricing, category, stock, description, upload product images, and click \"Save Product\"."],
    ["11. How can a merchant update a product?","In the Products tab, select the product, make changes to prices, photos, or stock quantities, and click \"Update\"."],
    ["12. What type of products can merchants list on GOLO?","All legal consumer goods and local services belonging to supported categories (Fashion, Food, Electronics, Groceries, Home Goods, Beauty, Hardware, etc.) that comply with GOLO listing policies."],
  ]},
  { id:"7-offers-deals-faq", title:"7. Offers & Deals FAQ", qs:[
    ["1. What are GOLO offers and deals?","GOLO offers and deals are exclusive, time-limited promotions published by local merchants, featuring percentage discounts, flat price cuts, combo specials, and bonus loyalty points redeemable at local stores."],
    ["2. How can I find available offers?","Browse the homepage hero banners, check the Trending Offers section, or visit the Nearby Deals tab to view all active promotions."],
    ["3. How can I find offers near my location?","Enable GPS location permissions or set your location manually via Select Location. GOLO dynamically filters deals within your radius and plots them on the map."],
    ["4. How do I use an offer?","1. Open the deal page and click \"Claim Offer\".\n2. A digital voucher is generated containing a unique QR Code and alphanumeric Verification Code (e.g., VOUCHER-XXXXX).\n3. Visit the merchant's store and present your voucher QR code or code at checkout.\n4. The merchant scans or enters the code on their dashboard to apply the discount."],
    ["5. How do I know when an offer expires?","The offer banner and claimed voucher card display an explicit expiration date and countdown timer (e.g., \"Valid until DD/MM/YYYY\"). Once expired, vouchers cannot be redeemed."],
    ["6. Can an offer have specific terms and conditions?","Yes. Merchants specify terms such as minimum purchase requirements, validity days (e.g., weekdays only), or product-specific applicability in the \"Terms & Conditions\" section of the deal."],
    ["7. Can an offer be combined with another offer?","Unless explicitly stated by the merchant, vouchers cannot be combined with other ongoing in-store promotions or third-party coupons."],
    ["8. Why is an offer no longer available?","An offer becomes unavailable when its validity date passes, the merchant's redemption quota is reached, or the merchant pauses/removes the campaign."],
    ["9. Can merchants create their own offers?","Yes. Merchants use the Create Offer tool to choose custom promotional titles, banner media, select specific products, configure discount pricing, and set campaign durations."],
    ["10. How can merchants manage their offers?","In the Offers tab of the Merchant Dashboard, merchants can view real-time impression and redemption counts, edit campaign details, pause/resume offers, and save reusable offer templates."],
    ["11. Can GOLO remove an offer?","Yes. GOLO moderators and automated moderation filters can reject or take down offers that contain false pricing, inappropriate imagery, or violate platform standards."],
    ["12. What happens if an offer is incorrectly displayed?","Merchants can edit and correct the offer details from their dashboard. If an error affected already claimed vouchers, merchant support can assist customers in resolving the discrepancy."],
  ]},
  { id:"8-order-faq", title:"8. Order FAQ", qs:[
    ["1. What is an Order on GOLO?","On GOLO, an order represents a formal transaction initiated when a customer claims a promotional deal or voucher, or places an order for products from a local merchant. Each order is assigned a unique Order ID linked to the customer, merchant, item count, total amount, and corresponding voucher details."],
    ["2. How are orders created on GOLO?","Orders are automatically generated when:\n1. A customer claims an offer voucher on the platform.\n2. A customer confirms an order through a merchant store catalog.\n3. The order is dispatched to the merchant's live dashboard with an initial status of Pending."],
    ["3. What are the different Order Statuses on GOLO?","GOLO's order lifecycle follows four standard statuses:\nPending: The order has been placed by the customer and is awaiting merchant acknowledgment.\nAccepted: The merchant has reviewed and accepted the order, reserving inventory or preparing items for pickup.\nRejected: The merchant could not fulfill the order and rejected the request with a stated reason.\nCompleted: The customer has visited the merchant store, the voucher QR code has been scanned and validated, and goods or services have been successfully delivered."],
    ["4. How do customers track their orders?","Customers can track active and past orders by navigating to Profile → My Orders. The order tracking interface displays the current status badge, merchant contact details, ordered items, and order timeline timestamps."],
    ["5. Where can merchants view and process orders?","Merchants manage incoming orders through the Merchant Orders Dashboard. From this view, merchants can filter orders by status (Pending, Accepted, Rejected, Completed), inspect customer details, accept incoming orders, or scan voucher QR codes to complete transactions."],
    ["6. What happens when a merchant accepts an order?","When a merchant clicks Accept Order, the status transitions to Accepted, the acceptance timestamp is recorded, and an instant push notification and in-app message are sent to the customer confirming that the order is ready for pickup or fulfillment."],
    ["7. How is an order completed at the store?","When the customer arrives at the store, they present their digital voucher QR code. The merchant scans the code using the GOLO Merchant App or enters the voucher verification code. Upon successful scan, the order status changes to Completed, completion timestamp is stored, and loyalty reward points are credited."],
    ["8. What should I do if my order is rejected by the merchant?","If a merchant rejects an order due to stock unavailability or store closure, the customer receives an immediate notification. No payment is captured, and the customer can explore other nearby merchants offering similar products or deals."],
    ["9. How can I resolve an order dispute?","If there is an issue with product quality, incorrect billing, or store refusal, customers can:\n1. Chat directly with the merchant using GOLO Chat.\n2. Raise a support ticket in the Help Center providing the Order ID and merchant details for mediation."],
  ]},
  { id:"9-delivery-faq", title:"9. Delivery FAQ", qs:[
    ["1. Does GOLO provide door-to-door delivery?","GOLO is primarily a hyper-local discovery and in-store voucher redemption platform. Rather than operating centralized courier fleets, GOLO connects neighborhood shoppers with nearby brick-and-mortar stores for direct in-store pickup, immediate savings, and personalized local shopping."],
    ["2. How does the in-store pickup model work?","1. Discover nearby stores and claim offer vouchers on GOLO.\n2. Receive a digital voucher QR code.\n3. Visit the merchant's physical store address shown on the integrated map.\n4. Present your voucher QR code at the checkout counter to collect your items at the discounted price."],
    ["3. Can merchants offer their own local delivery?","Yes. Independent local merchants who operate their own local home delivery staff can coordinate direct delivery with customers through GOLO Chat or direct phone contact upon accepting an order."],
    ["4. How do I set or update my address on GOLO?","1. Navigate to Profile → Edit Profile.\n2. Enter your Street Address, City, State, and Postal Code.\n3. You can also use Select Location to set your current GPS coordinates, allowing GOLO to calculate accurate driving and walking distances to nearby stores."],
    ["5. How do GPS coordinates and interactive maps assist my store visit?","Every merchant listing on GOLO includes precise GPS coordinates and interactive map navigation. Clicking \"Get Directions\" opens turn-by-turn navigation in your preferred map app (Google Maps / Apple Maps) guiding you directly to the storefront."],
    ["6. What should I do if a store is closed when I arrive for pickup?","Store operating hours are displayed on the merchant profile page. If a store is unexpectedly closed during listed business hours, check the merchant's GOLO chat for updates or report the issue via the Help Center. Your claimed voucher remains valid until its stated expiration date."],
    ["7. Are there delivery or shipping charges on GOLO?","Because standard GOLO vouchers are redeemed in-store by the customer, there are no GOLO platform delivery fees. If a merchant arranges custom local self-delivery, any nominal local delivery charges are communicated directly between the merchant and the customer."],
  ]},
  { id:"10-cancellation-faq", title:"10. Cancellation FAQ", qs:[
    ["1. Can a customer cancel an order or claimed offer?","Claimed Offers / Vouchers: If you have claimed a free discount voucher and decide not to use it, you do not need to take any action. Unredeemed vouchers will simply expire automatically upon reaching their validity end date with zero penalty or cost.\nPending Store Orders: Customers can cancel a pending store order directly from the order details screen before the merchant accepts it."],
    ["2. Can a merchant cancel or reject an order?","Yes. A merchant can reject an incoming order from the Merchant Orders Dashboard if an item is out of stock, store capacity is reached, or the store is closing. Selecting a cancellation reason automatically notifies the customer."],
    ["3. Can I cancel a paid advertisement campaign?","Yes. Advertisers and merchants can request cancellation of an active or scheduled advertising campaign through the Merchant Portal or Help Center. Cancellation eligibility and adjustments are governed by GOLO's Refund & Credit Note Policy."],
    ["4. How is the credit calculated when an advertising campaign is cancelled?","For eligible advertising and promotional services charged on a duration basis, GOLO calculates the Eligible Credit Amount using the Daily Ad Rate formula:\n\nEligible Credit Amount = Unutilized Days × Daily Ad Rate\n\nExample:\n• 30-day campaign purchased for ₹3,000 (Daily Ad Rate = ₹100/day).\n• Cancelled with 10 unutilized days remaining.\n• Eligible Credit Amount = 10 × ₹100 = ₹1,000, issued as a Credit Note or Wallet Credit by NexaPrime Pvt. Ltd."],
    ["5. What happens if I cancel an advertisement on the same day it was created?","If an advertisement is created and cancelled on the same calendar day, that day may be treated as unutilized provided the ad has not already been materially delivered, broadcast, or displayed. The determination considers activation time, publication status, and actual delivery records."],
    ["6. Can I cancel a banner promotion?","Yes. Merchants can cancel active or queued banner promotions from the Banner section of the Merchant Dashboard. Any remaining unutilized daily budget or queued impressions are automatically credited back to the merchant's GOLO Store Wallet for use on future campaigns."],
    ["7. How do I cancel a merchant subscription?","1. Navigate to Merchant Dashboard → Subscription Details.\n2. Select Cancel Subscription or disable auto-renewal.\n3. Your premium features will remain active until the end of the current paid billing cycle, after which your account reverts to the Free tier without additional charges."],
    ["8. Are cancellation penalties or fees charged?","GOLO does not charge punitive cancellation penalties. However, services that have already been utilized, published, displayed, or materially delivered are non-refundable and will be deducted from any credit adjustment."],
  ]},
  { id:"11-payment-faq", title:"11. Payment FAQ", qs:[
    ["1. What payment methods are supported on GOLO?","GOLO processes payments through Razorpay, a secure and authorized payment gateway. Supported payment methods include:\n• UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)\n• Debit Cards (Visa, Mastercard, RuPay)\n• Credit Cards (Visa, Mastercard, American Express)\n• Net Banking (all major Indian banks)\n• GOLO Wallet Balance (for eligible services, can be applied during checkout)"],
    ["2. What paid services require payment on GOLO?","Paid services on GOLO include:\n• Customer advertisement posting.\n• Merchant advertisement posting.\n• Banner advertisement placements (homepage and category banners).\n• Product and service promotional campaigns.\n• Featured or priority store placements.\n• Merchant subscription plans (Trial, Standard, Premium, Enterprise).\n• Other commercial promotional services introduced by NexaPrime Pvt. Ltd."],
    ["3. How is a payment processed on GOLO?","1. When you purchase a paid GOLO service, a secure payment order is generated.\n2. You complete authentication on Razorpay's secure checkout window.\n3. Secure transaction verification is processed by the platform.\n4. Upon successful verification, the payment status updates to Captured, and the purchased service is activated immediately.\n5. A formal transaction receipt is stored in your payment history."],
    ["4. How can I view my payment history?","Navigate to your Profile → Payments or access the Wallet page (Customer Wallet for shoppers, Store Wallet for merchants). Your complete transaction history, including payment amounts, transaction IDs, dates, descriptions, and statuses, is displayed chronologically."],
    ["5. What are the different payment statuses on GOLO?","Created: Payment order initiated but checkout not completed.\nAuthorized: Payment authorized by the issuing bank, pending capture.\nCaptured: Payment successfully processed and confirmed.\nFailed: Payment attempt was unsuccessful or declined by bank.\nPartially Refunded: A partial refund/adjustment was processed.\nRefunded: The full transaction amount was refunded."],
    ["6. What happens if my payment fails?","If a payment attempt fails, the associated GOLO service is not activated. Payment failures can occur due to bank declines, incorrect OTP/CVV, or network timeouts. If your bank account was debited despite a failure on GOLO, banking networks typically execute an automatic reversal within 5 to 7 business days."],
    ["7. What if I am charged twice for the same transaction (duplicate payment)?","GOLO uses duplicate-charge prevention mechanisms. If you believe a transaction was debited twice:\n1. Report the issue through GOLO's Help Center with the relevant bank reference and transaction IDs.\n2. GOLO will verify the duplicate charge with the payment gateway.\n3. Upon confirmation, a Credit Note or monetary reversal will be issued in accordance with policy."],
    ["8. Is my payment card information stored on GOLO servers?","No. GOLO does not store sensitive card numbers, CVVs, or banking passwords. All payment transactions are handled directly through Razorpay's RBI-regulated, PCI-DSS Level 1 certified gateway. GOLO retains only transaction IDs, receipts, and status logs for billing administration."],
    ["9. What is the minimum payment amount on GOLO?","The minimum payment amount on GOLO is ₹1.00 (one rupee). Transactions below this amount cannot be initiated."],
    ["10. How does GOLO handle payment status updates?","GOLO receives real-time payment status updates directly from the payment gateway via secure notifications. Each notification is validated using cryptographic signatures before updating internal transaction records, ensuring complete data synchronization."],
  ]},
  { id:"12-refund-credit-note-faq", title:"12. Refund & Credit Note FAQ", qs:[
    ["1. Does GOLO provide monetary cash refunds?","GOLO generally does not provide monetary cash refunds for purchased services. Once a Paid Service has been purchased, activated, scheduled, reserved, published, commenced, or otherwise processed, the payment is generally non-refundable. Where an eligible cancellation or refund-related adjustment is approved, GOLO's standard remedy is the issuance of a Credit Note by NexaPrime Pvt. Ltd., rather than a monetary refund.\n\nA monetary refund will only be provided where:\n1. It is required by applicable law.\n2. A transaction has been incorrectly or fraudulently processed and a monetary reversal is legally or operationally required.\n3. GOLO is unable to provide a paid service and a monetary refund is required by applicable law.\n4. NexaPrime is otherwise legally required to return the amount."],
    ["2. What is a Credit Note?","A Credit Note is a formal credit document issued by NexaPrime Pvt. Ltd. to an eligible User or Merchant following an approved cancellation, refund-related adjustment, service failure, or other qualifying circumstance. It represents an amount that may be adjusted against eligible future GOLO services. A Credit Note is not a bank balance, deposit, or GOLO Wallet balance."],
    ["3. How do I request a refund or Credit Note?","1. Contact GOLO through the Help Center or Merchant Support.\n2. Provide your GOLO account information, Transaction ID or payment reference, service details, date of purchase, amount paid, reason for cancellation, and any supporting information.\n3. GOLO will review your request based on the applicable circumstances.\n4. Submitting a request does not guarantee approval."],
    ["4. How is the Credit Note amount calculated for advertising cancellations?","For eligible advertising and promotional services charged based on a defined period, GOLO calculates the Eligible Amount using:\n\nEligible Credit Amount = Unutilized Days × Daily Ad Rate\n\nExample:\n• Advertising period = 30 days\n• Total service price = ₹3,000\n• Daily Ad Rate = ₹100\n• Unutilized period = 10 days\n• Eligible Credit Amount = 10 × ₹100 = ₹1,000\n\nSubject to the applicable terms, NexaPrime may issue a ₹1,000 Credit Note."],
    ["5. Can I get a Credit Note for a service that has already been utilized?","No. No automatic Credit Note will be issued for services that have already been fully consumed or materially delivered. This includes advertisements that have been published, displayed, delivered to users, completed their scheduled period, received promotional placement, or been substantially utilized."],
    ["6. How can I use a Credit Note?","A Credit Note can be applied toward eligible future GOLO services including:\n• Customer advertising\n• Merchant advertising\n• Banner advertising\n• Product promotion\n• Service promotion\n• Featured promotional services\n• Other eligible paid GOLO services approved by NexaPrime\n\nThe value of the Credit Note will be adjusted against the applicable purchase amount during checkout."],
    ["7. What if the future service costs more than my Credit Note balance?","If the value of a future GOLO service exceeds the available Credit Note value, you pay the remaining balance through any supported payment method (UPI, Debit/Credit Card, Net Banking)."],
    ["8. What if the future service costs less than my Credit Note balance?","If the service costs less than the available Credit Note value, only the applicable service amount will be adjusted. The remaining value continues to be available for future eligible GOLO services, subject to the Credit Note's terms and validity."],
    ["9. Can I convert a Credit Note to cash or withdraw it to my bank?","No. Unless required by applicable law, a Credit Note cannot be:\n• Redeemed for cash.\n• Withdrawn to a bank account.\n• Transferred to a UPI account.\n• Refunded to a credit or debit card.\n• Converted into cash through payment gateways.\n• Otherwise exchanged for monetary payment."],
    ["10. Can I transfer a Credit Note to another user?","No. Unless expressly permitted by NexaPrime, Credit Notes are strictly associated with the specific User or Merchant for whom they were issued and cannot be sold, transferred, or assigned to another account."],
    ["11. Are merchant subscription fees refundable?","Merchant subscription fees are generally non-refundable, including where a Merchant terminates or cancels their account during an active subscription period. No automatic prorated refund or Credit Note will be provided for unused subscription time."],
    ["12. How long does a refund or Credit Note review take?","GOLO reviews requests based on service usage, publication records, and transaction logs. In the rare event an approved monetary refund is authorized, it is processed through the payment gateway back to the original payment source within 5 to 7 business days."],
  ]},
  { id:"13-walletcoupon-faq", title:"13. Wallet/Coupon FAQ", qs:[
    ["1. What is the GOLO Wallet?","The GOLO Wallet is an internal digital balance system available to both customers (Customer Wallet) and merchants (Store Wallet). It stores credits that are automatically generated when paid services (such as banner promotions or advertisements) are cancelled and a portion of the funds remain unutilized. The wallet balance can be used seamlessly during checkout when purchasing future GOLO services."],
    ["2. How do I access my GOLO Wallet?","Customers: Navigate to Profile → Wallet. You will see your Available Balance and full Transaction History.\nMerchants: Navigate to the Store Wallet from the Merchant Dashboard. You will see your Available Balance, Total Transactions, and a detailed Transaction History table."],
    ["3. How does money get added to my wallet?","Wallet credits are automatically added when:\n• You cancel a banner promotion and leftover unutilized funds are credited.\n• You cancel an advertisement and the eligible unused portion is credited.\n• A refund-related adjustment is processed as a wallet credit.\n• Other Credit Note or refund-related resolutions result in a wallet credit.\n\nYou cannot manually top up your wallet with external funds. The wallet is funded exclusively through platform-generated credits."],
    ["4. What can I use my GOLO Wallet balance for?","Your wallet balance can be used to pay for eligible future GOLO services during checkout, including:\n• Banner advertisement uploads and promotions.\n• Customer and merchant ad posting fees.\n• Product and service promotion campaigns.\n• Subscription payments (for merchants).\n• Other paid GOLO services."],
    ["5. Can I withdraw my wallet balance as cash?","No. The GOLO Wallet balance is not redeemable for cash, cannot be withdrawn to a bank account, transferred to UPI, or refunded to a card. It is intended exclusively for use toward eligible GOLO services. The wallet balance is not a bank deposit, electronic money, or a transferable monetary instrument."],
    ["6. What types of wallet transactions exist?","Wallet transactions are categorized as:\nCredit: Funds added to your wallet (e.g., refund from a cancelled banner, ad cancellation credit).\nDebit: Funds used from your wallet toward a GOLO service purchase.\n\nEach transaction records the amount, description, reference category (banner, ad, subscription, or other), status (completed, pending, failed), and timestamp."],
    ["7. Can I view my wallet transaction history?","Yes. Both the Customer Wallet page and the Merchant Store Wallet page display a complete, chronologically ordered Transaction History showing each credit and debit transaction with amounts, descriptions, and dates."],
    ["8. Is the GOLO Wallet the same as a Credit Note?","No. As per GOLO's Refund & Credit Note Policy, a Credit Note is a formal credit document issued by NexaPrime and is separate from any wallet or digital credit system. The GOLO Wallet is an operational balance for quick service payments, while a Credit Note is a formal accounting instrument."],
    ["9. What are GOLO coupons?","GOLO coupons are promotional discount codes issued by the platform or specific merchants to provide discounts on paid GOLO services. Coupons may offer percentage discounts, flat price reductions, or category-specific promotional benefits."],
    ["10. How do I apply a coupon on GOLO?","During the checkout process for a paid GOLO service, enter the coupon code in the designated promo code field and click Apply. If valid, the discount is immediately deducted from your order total before payment."],
    ["11. Why is my coupon not working?","A coupon may not work due to:\n• The coupon code has expired.\n• The total order value is below the minimum spend requirement.\n• The coupon has already reached its usage limit.\n• The coupon is restricted to specific categories or first-time users.\n• The coupon code was entered with a typo (codes are case-sensitive)."],
    ["12. Can I combine a coupon with my wallet balance?","Yes. During checkout, you can apply a valid coupon code to reduce your order total, and then use your GOLO Wallet balance to pay part or all of the remaining amount."],
  ]},
  { id:"14-subscription-faq", title:"14. Subscription FAQ", qs:[
    ["1. Does GOLO offer merchant subscriptions?","Yes. GOLO provides structured subscription plans for merchants to scale their store visibility, unlock higher product catalog listing quotas, launch concurrent active deals, and access advanced demographic and revenue analytics."],
    ["2. What is included in a GOLO merchant subscription?","Key features across plan tiers include:\nProduct Inventory Quota: Increased maximum product listings (e.g., 20 products on basic tiers up to unlimited on enterprise tiers).\nActive Offers Quota: Higher number of concurrent active deals and longer campaign durations.\nBanner Promotion Credits: Monthly credits for homepage and category banner placements.\nAdvanced Analytics: In-depth customer demographic reports (age, gender, location heatmaps, device breakdown, revenue charts).\nSearch Priority: Boosted ranking in search results and nearby deal feeds.\nCustom Digital Storefront: Dedicated public merchant store webpage."],
    ["3. How can a merchant subscribe or upgrade?","1. In the Merchant Dashboard, go to Upgrade Plan.\n2. Compare available plans (Trial, Standard, Premium, Enterprise).\n3. Select your billing cycle (Monthly or Yearly) and proceed to Checkout.\n4. Complete the payment through Razorpay to activate your subscription instantly."],
    ["4. How much does a subscription cost?","GOLO offers competitive pricing starting with a Free / Trial Plan (₹0) for new merchants, up to cost-effective Standard and Premium tiers. Exact current pricing and billing options are displayed on the Upgrade Plan page."],
    ["5. How long is a subscription valid?","Monthly Plan: Valid for 30 calendar days from purchase.\nYearly Plan: Valid for 365 calendar days from purchase.\nTrial Plan: Valid for the duration of the promotional trial period (e.g., 14 or 30 days)."],
    ["6. How can I cancel my subscription?","Navigate to Merchant Settings → Subscription Details and select Cancel Subscription or turn off auto-renewal. Your subscription features will remain active until the end of your current billing cycle."],
    ["7. Will my subscription automatically renew?","Auto-renewal settings can be toggled On or Off in your merchant subscription preferences according to your selected payment method."],
    ["8. Are subscription fees refundable?","Subscription fees are non-refundable once the billing period has commenced. In the case of accidental duplicate charges or verified payment gateway errors, refund requests can be submitted via the Support Center for review."],
    ["9. What happens when my subscription expires?","If a subscription expires without renewal, your account automatically transitions to the Free/Basic tier. Your catalog and data are preserved, but premium features (extra active deals, banner credits, advanced analytics) are paused until renewed."],
    ["10. Can subscription benefits be transferred to another account?","No. Subscriptions are non-transferable and remain strictly associated with the specific registered merchant user account and store profile."],
  ]},
  { id:"15-troubleshooting-faq", title:"15. Troubleshooting FAQ", qs:[
    ["1. Why can't I log in to my GOLO account?","• Ensure your email and password are typed correctly (passwords are case-sensitive).\n• Verify that your account email was verified with OTP during registration.\n• If you forgot your password, use the \"Forgot Password\" link to reset it.\n• If your account was flagged for a policy violation, contact support for assistance."],
    ["2. What should I do if I forgot my password?","Click \"Forgot Password?\" on the login screen, enter your registered email address, retrieve the 6-digit OTP from your inbox, verify the code, and set a new password."],
    ["3. Why am I not receiving the email OTP?","• Check your Spam / Junk / Promotions folders.\n• Ensure your email address contains no typos or trailing spaces.\n• Wait 60 seconds before clicking \"Resend OTP\".\n• Ensure your mail server is not blocking automated emails from the GOLO domain."],
    ["4. Why is the GOLO website or app not loading?","• Check your internet connection.\n• Clear your browser cookies and cache or restart the mobile app.\n• Disable aggressive ad-blockers or VPN extensions that may block platform calls.\n• Try accessing the site in an Incognito / Private browsing window."],
    ["5. Why is a product not appearing in search results?","• The product may be marked as \"Inactive\" or \"Out of Stock\" by the merchant.\n• The product may be outside your current location filter radius.\n• The item may be newly added and undergoing brief search indexing or platform moderation."],
    ["6. Why can't I place an order or claim an offer?","• Ensure you are logged into an active customer account.\n• Check if your profile has an address and phone number configured.\n• Ensure the offer has not reached its maximum redemption quota or expiration date."],
    ["7. Why did my payment fail?","Payment failures are usually due to incorrect OTP/CVV entry, insufficient account balance, bank server downtime, or a connection timeout. Try again or select an alternate payment method (UPI, Debit/Credit Card, Net Banking)."],
    ["8. Why is my order status not updating?","Order statuses update when the merchant accepts or fulfills the order. Pull down to refresh your order page or contact the merchant directly via GOLO Chat for an update."],
    ["9. Why can't I cancel my claimed offer?","Once an offer voucher is scanned and redeemed at the merchant store, it is permanently marked as \"Redeemed\". Unredeemed vouchers can simply be left to expire automatically without any penalty."],
    ["10. Why haven't I received my refund?","Approved refunds are processed through the payment gateway back to the original payment source. Depending on your bank's processing cycles, refunds typically appear within 5 to 7 business days."],
    ["11. Why isn't my coupon working?","• The coupon code may have expired.\n• The total order value may be below the required minimum spend.\n• The coupon may have already been used (single-use limit).\n• The coupon may be restricted to specific categories or first-time users."],
    ["12. What should I do if the mobile app crashes?","• Force-close and restart the app.\n• Ensure your app is updated to the latest release.\n• Clear app cache storage in your device settings.\n• Restart your mobile device."],
    ["13. What should I do if I encounter an unexpected error?","Note down the error message, take a screenshot, refresh the page, and report the issue through the Help Center with steps to reproduce the error."],
    ["14. How can I contact GOLO support for a technical problem?","Submit a ticket under the Help Center, select the issue type \"Technical / Bug\", attach screenshots and error details, or email the technical team at support@golo.com."],
  ]},
];

function FAQItem({ q, a, isOpen, onToggle }) {
  const lines = String(a).split('\n');
  return (
    <div style={{ background:"var(--fq-s)", border:"1px solid var(--fq-b)", borderRadius:10, marginBottom:18, overflow:"hidden", boxShadow:isOpen?"0 4px 6px -1px rgba(0,0,0,.1)":"0 1px 2px 0 rgba(0,0,0,.05)", transition:"box-shadow .2s" }}>
      <button onClick={onToggle} style={{ width:"100%", padding:"16px 20px", fontWeight:600, fontSize:"1rem", color:"var(--fq-tp)", background:"var(--fq-s)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", userSelect:"none", textAlign:"left", gap:12 }}>
        <span style={{ flex:1 }}>{q}</span>
        <span style={{ flexShrink:0, width:22, height:22, borderRadius:"50%", background:isOpen?"#157A4F":"var(--fq-cb)", color:isOpen?"#fff":"var(--fq-tm)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, transform:isOpen?"rotate(180deg)":"none", transition:"transform .2s" }}>▾</span>
      </button>
      {isOpen && (
        <div style={{ padding:"16px 20px 18px", color:"var(--fq-ts)", fontSize:"0.95rem", lineHeight:1.65, borderTop:"1px solid var(--fq-b)", background:"var(--fq-bg)" }}>
          {lines.map((l,i) => <span key={i}>{l}{i<lines.length-1&&<br/>}</span>)}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState({});
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("1-general-golo-faq");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("golo_faq_theme") : null;
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => setIsDark(v => {
    const next = !v;
    if (typeof window !== "undefined") localStorage.setItem("golo_faq_theme", next ? "dark" : "light");
    return next;
  });

  const toggleItem = (sid, qi) => {
    const key = `${sid}-${qi}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const lq = searchQuery.toLowerCase().trim();
  const filtered = useMemo(() => {
    if (!lq) return SECTIONS;
    return SECTIONS.map(s => ({
      ...s,
      qs: s.qs.filter(([q,a]) => q.toLowerCase().includes(lq) || a.toLowerCase().includes(lq))
    })).filter(s => s.qs.length > 0);
  }, [lq]);

  useEffect(() => {
    const onScroll = () => {
      for (let i = SECTIONS.length-1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(SECTIONS[i].id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); };

  const vars = isDark
    ? { "--fq-bg":"#0b0f19","--fq-s":"#111827","--fq-tp":"#f9fafb","--fq-ts":"#9ca3af","--fq-tm":"#6b7280","--fq-b":"#374151","--fq-pl":"#1e293b","--fq-cb":"#1e293b" }
    : { "--fq-bg":"#f8fafc","--fq-s":"#ffffff","--fq-tp":"#0f172a","--fq-ts":"#475569","--fq-tm":"#64748b","--fq-b":"#e2e8f0","--fq-pl":"#eff6ff","--fq-cb":"#f1f5f9" };

  const SH2 = { fontSize:"1.4rem", fontWeight:700, color:"var(--fq-tp)", letterSpacing:"-0.4px", marginBottom:20, paddingBottom:8, borderBottom:"2px solid var(--fq-pl)" };
  const navBtn = (active) => ({ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", fontSize:"0.87rem", color:active?"#fff":"var(--fq-ts)", background:active?"#157A4F":"transparent", border:"none", borderRadius:6, cursor:"pointer", fontWeight:active?600:500, lineHeight:1.4, marginBottom:2 });
  const footerBtn = { flex:1, background:"var(--fq-bg)", border:"1px solid var(--fq-b)", padding:"8px 10px", fontSize:"0.82rem", fontWeight:600, color:"var(--fq-ts)", borderRadius:6, cursor:"pointer" };

  return (
    <div style={{ minHeight:"100vh", background:"transparent", fontFamily:"'Inter',system-ui,-apple-system,sans-serif", WebkitFontSmoothing:"antialiased", ...vars }}>
      <Navbar />
      <div style={{ display:"flex", position:"relative", zIndex:10 }}>
        {/* ── Sidebar ── */}
        <aside className="faq-sidebar" style={{ width:300, flexShrink:0, background:"transparent", borderRight:"1px solid var(--fq-b)", position:"sticky", top:0, height:"100vh", overflowY:"auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:20, zIndex:20 }}>
          {/* Brand */}
          <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:16, borderBottom:"1px solid var(--fq-b)" }}>
            <div style={{ width:38, height:38, background:"#157A4F", color:"#fff", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.2rem", flexShrink:0 }}>G</div>
            <div>
              <div style={{ fontSize:"1.1rem", fontWeight:700, color:"var(--fq-tp)" }}>GOLO Platform</div>
              <div style={{ fontSize:"0.72rem", color:"var(--fq-tm)", textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>FAQ Documentation</div>
            </div>
          </div>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--fq-tm)", pointerEvents:"none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search FAQs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width:"100%", padding:"10px 14px 10px 38px", fontSize:"0.9rem", border:"1px solid var(--fq-b)", borderRadius:10, background:"var(--fq-bg)", color:"var(--fq-tp)", outline:"none", boxSizing:"border-box" }} />
          </div>
          {/* Nav */}
          <nav style={{ display:"flex", flexDirection:"column", flex:1 }}>
            <div style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", color:"var(--fq-tm)", letterSpacing:"0.5px", marginBottom:8, paddingLeft:8 }}>FAQ Categories</div>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)} style={navBtn(activeSection===s.id)}>{s.title}</button>
            ))}
          </nav>
          {/* Footer */}
          <div style={{ paddingTop:16, borderTop:"1px solid var(--fq-b)", display:"flex", gap:8 }}>
            <button onClick={toggleTheme} style={footerBtn}>🌓 Theme</button>
            <button onClick={() => window.print()} style={footerBtn}>🖨️ Print / PDF</button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex:1, padding:"48px 56px", maxWidth:1020, minWidth:0 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--fq-pl)", color:"#157A4F", padding:"4px 12px", borderRadius:999, fontSize:"0.8rem", fontWeight:600, marginBottom:16 }}>Official Documentation v2.0</div>
          <h1 style={{ fontSize:"2.1rem", fontWeight:800, color:"var(--fq-tp)", letterSpacing:"-0.8px", marginBottom:12, lineHeight:1.25 }}>
            GOLO Platform — Comprehensive Frequently Asked Questions (FAQ) Documentation
          </h1>
          <p style={{ color:"var(--fq-tm)", fontSize:"0.95rem", marginBottom:32, paddingBottom:24, borderBottom:"1px solid var(--fq-b)", lineHeight:1.65 }}>
            This document provides complete, authoritative answers for all Frequently Asked Questions (FAQs) across{" "}
            <strong style={{ color:"var(--fq-tp)" }}>15 distinct categories</strong>. All answers reflect the official operating procedures and features of the GOLO web and mobile platforms, as well as GOLO&apos;s official{" "}
            <strong style={{ color:"var(--fq-tp)" }}>Refund &amp; Credit Note Policy</strong> operated by NexaPrime Pvt. Ltd.
          </p>

          {/* Table of Contents */}
          {!lq && (
            <div style={{ marginBottom:48 }}>
              <h2 style={{ ...SH2, marginTop:0 }}>Table of Contents</h2>
              <ol style={{ marginLeft:24, color:"var(--fq-ts)", lineHeight:1.9 }}>
                {SECTIONS.map(s => (
                  <li key={s.id} style={{ marginBottom:4 }}>
                    <button onClick={() => scrollTo(s.id)} style={{ background:"none", border:"none", color:"#157A4F", cursor:"pointer", fontSize:"0.95rem", padding:0, textDecoration:"underline" }}>{s.title}</button>
                  </li>
                ))}
              </ol>
              <hr style={{ margin:"32px 0", border:"none", borderTop:"1px solid var(--fq-b)" }} />
            </div>
          )}

          {lq && <p style={{ color:"var(--fq-tm)", fontSize:"0.88rem", marginBottom:24 }}>{filtered.reduce((a,s)=>a+s.qs.length,0)} result(s) for &quot;{searchQuery}&quot;</p>}

          {/* FAQ Sections */}
          {filtered.map(section => (
            <section key={section.id} id={section.id} style={{ scrollMarginTop:100 }}>
              <h2 style={{ ...SH2, marginTop:48 }}>{section.title}</h2>
              {section.qs.map(([q,a], qi) => {
                const key = `${section.id}-${qi}`;
                return <FAQItem key={key} q={q} a={a} isOpen={!!openItems[key]} onToggle={() => toggleItem(section.id, qi)} />;
              })}
              {!lq && <hr style={{ margin:"8px 0 0 0", border:"none", borderTop:"1px solid var(--fq-b)" }} />}
            </section>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding:"48px 0", textAlign:"center", color:"var(--fq-tm)" }}>No FAQs found for &quot;{searchQuery}&quot;. Try different keywords.</div>
          )}
        </main>
      </div>
      <Footer />
      <style>{`
        @media(max-width:900px){.faq-sidebar{display:none!important}main{padding:24px 20px!important}}
        @media print{.faq-sidebar{display:none!important}main{padding:0!important;max-width:100%!important}}
      `}</style>
    </div>
  );
}