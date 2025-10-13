import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Language resources
const resources = {
  en: {
    translation: {
      // Navigation
      explore: "Explore",
      bag: "Bag",
      history: "History",
      settings: "Settings",

      // Settings screen
      settingsTitle: "Settings",
      appearance: "Appearance",
      language: "Language",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      systemMode: "System",

      // Languages
      english: "English",
      thai: "ไทย",
      malay: "Bahasa Melayu",
      filipino: "Filipino",
      indonesian: "Bahasa Indonesia",

      // Product detail
      selectSize: "Select Color",
      addToBag: "Add to bag",
      adding: "Adding...",
      outOfStock: "Out of stock",
      about: "About",
      material: "Material",
      otherDetails: "Other Details",
      madeBy: "Made by",
      inStock: "In stock",
      collection: "Collection",
      onlyLeft: "Only {{count}} left",

      // Cart
      yourBag: "Your Bag",
      item: "item",
      items: "items",
      size: "Color",
      total: "Total",
      checkout: "Checkout",
      emptyBag: "Your bag is empty",
      continueShopping: "Continue Shopping",

      // History
      orderHistory: "Order History",
      noOrdersYet: "No Orders Yet",
      noOrdersMessage:
        "You haven't placed any orders yet. Start shopping to see your order history here.",
      startShopping: "Start Shopping",
      orderId: "Order #",
      totalAmount: "Total Amount",
      loadingOrderHistory: "Loading order history...",

      // Explore screen
      featuredProducts: "Featured Products",
      featured: "FEATURED",
      viewProduct: "View Product",
      noFeaturedProducts: "No Featured Products",
      checkBackLater: "Check back later for featured items",
      seeAll: "See all",
      noProductsAvailable: "No products available in this collection",

      // Product detail screen
      additionalDetailsNotAvailable: "Additional details not available",
      connectWalletToAddItems:
        "Please connect your wallet to add items to cart",
      productNotFound: "Product not found",

      // Bag screen
      loginRequired: "Login Required",
      signInWithWorldId: "Please sign in with your World ID to view your cart",
      signInWithWorldIdHistory:
        "Please sign in with your World ID to view your order history",
      noItemsYet: "No items yet",
      itemsDisplayedHere: "Your items will be displayed here",
      orderHistoryDisplayedHere: "Your order history will be displayed here",
      loadingCart: "Loading cart...",
      retrying: "Retrying...",

      // Order details
      productsOrdered: "Products Ordered",
      productNameNotAvailable: "Product Name Not Available",
      quantity: "Qty",

      // Order success screen
      noOrderDataFound: "No Order Data Found",
      unableToDisplayOrder: "Unable to display order information.",
      backToShop: "Back to Shop",
      orderConfirmed: "Order Confirmed!",
      thankYouPurchase:
        "Thank you for your purchase. Your order has been successfully placed.",
      orderDetails: "Order Details",
      orderIdLabel: "Order ID",
      totalAmountLabel: "Total Amount",
      statusLabel: "Status",
      noProductsFound: "No products found",
      shippingInformation: "Shipping Information",
      viewOrderHistory: "View Order History",

      // Checkout screen
      contact: "Contact",
      delivery: "Delivery",
      country: "Country",
      firstName: "First name",
      lastName: "Last name",
      address: "Address",
      apartment: "Apartment, suite, etc. (optional)",
      city: "City",
      postalCode: "Postal code (optional)",
      phone: "Phone",
      email: "Email",
      selectCity: "Select City",
      shippingMethod: "Shipping method",
      worldwideFlatRate: "Worldwide Flat Rate",
      orderSummary: "Order summary",
      pricesUpdatedFor: "✓ Prices updated for {{country}}",
      subtotal: "Subtotal",
      shipping: "Shipping",
      freeship: "Freeship",

      // Payment button
      processingPayment: "Processing Payment...",
      paymentSuccessfulButton: "Payment Successful!",
      paymentFailedRetry: "Payment Failed - Retry",
      insufficientBalance: "Insufficient Balance (Need {{amount}} more WLD)",
      processing: "Processing...",
      payWLD: "Pay {{amount}} WLD",
      insufficientWLDBalance:
        "Insufficient WLD balance. You need {{amount}} more WLD to complete this payment.",
      paymentCompletedSuccessfully: "✅ Payment completed successfully!",

      // Toast messages
      pleaseSelectSize: "Please select a color",
      sizeOutOfStock: "This color is currently out of stock",
      addedToBag: "added to bag!",
      failedToAddToCart: "Failed to add to cart",
      paymentSuccessful:
        "Payment successful but failed to create order. Please contact support.",
      paymentFailed: "Payment failed:",

      // Common
      back: "Back",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      tryAgain: "Try Again",
      signIn: "Sign in",
      paid: "Paid",
    },
  },
  th: {
    translation: {
      // Navigation
      explore: "สำรวจ",
      bag: "กระเป๋า",
      history: "ประวัติ",
      settings: "การตั้งค่า",

      // Settings screen
      settingsTitle: "การตั้งค่า",
      appearance: "การแสดงผล",
      language: "ภาษา",
      darkMode: "โหมดมืด",
      lightMode: "โหมดสว่าง",
      systemMode: "ตามระบบ",

      // Languages
      english: "English",
      thai: "ไทย",
      malay: "Bahasa Melayu",
      filipino: "Filipino",
      indonesian: "Bahasa Indonesia",

      // Product detail
      selectSize: "เลือกสี",
      addToBag: "เพิ่มในกระเป๋า",
      adding: "กำลังเพิ่ม...",
      outOfStock: "สินค้าหมด",
      about: "เกี่ยวกับ",
      material: "วัสดุ",
      otherDetails: "รายละเอียดอื่นๆ",
      madeBy: "ผลิตโดย",
      inStock: "มีสินค้า",
      collection: "คอลเลคชั่น",
      onlyLeft: "เหลือเพียง {{count}} ชิ้น",

      // Cart
      yourBag: "กระเป๋าของคุณ",
      item: "รายการ",
      items: "รายการ",
      size: "สี",
      total: "รวม",
      checkout: "ชำระเงิน",
      emptyBag: "กระเป๋าของคุณว่างเปล่า",
      continueShopping: "ช้อปปิ้งต่อ",

      // History
      orderHistory: "ประวัติการสั่งซื้อ",
      noOrdersYet: "ยังไม่มีคำสั่งซื้อ",
      noOrdersMessage:
        "คุณยังไม่ได้สั่งซื้ออะไรเลย เริ่มช้อปปิ้งเพื่อดูประวัติการสั่งซื้อของคุณที่นี่",
      startShopping: "เริ่มช้อปปิ้ง",
      orderId: "คำสั่งซื้อ #",
      totalAmount: "จำนวนเงินรวม",
      loadingOrderHistory: "กำลังโหลดประวัติการสั่งซื้อ...",

      // Explore screen
      featuredProducts: "สินค้าแนะนำ",
      featured: "แนะนำ",
      viewProduct: "ดูสินค้า",
      noFeaturedProducts: "ไม่มีสินค้าแนะนำ",
      checkBackLater: "กลับมาดูใหม่ภายหลังสำหรับสินค้าแนะนำ",
      seeAll: "ดูทั้งหมด",
      noProductsAvailable: "ไม่มีสินค้าในคอลเลคชั่นนี้",

      // Product detail screen
      additionalDetailsNotAvailable: "ไม่มีรายละเอียดเพิ่มเติม",
      connectWalletToAddItems:
        "กรุณาเชื่อมต่อกระเป๋าเงินเพื่อเพิ่มสินค้าในตะกร้า",
      productNotFound: "ไม่พบสินค้า",

      // Bag screen
      loginRequired: "ต้องเข้าสู่ระบบ",
      signInWithWorldId: "กรุณาเข้าสู่ระบบด้วย World ID เพื่อดูตะกร้าสินค้า",
      signInWithWorldIdHistory:
        "กรุณาเข้าสู่ระบบด้วย World ID เพื่อดูประวัติการสั่งซื้อ",
      noItemsYet: "ยังไม่มีสินค้า",
      itemsDisplayedHere: "สินค้าของคุณจะแสดงที่นี่",
      orderHistoryDisplayedHere: "ประวัติการสั่งซื้อของคุณจะแสดงที่นี่",
      loadingCart: "กำลังโหลดตะกร้าสินค้า...",
      retrying: "กำลังลองใหม่...",

      // Order details
      productsOrdered: "สินค้าที่สั่งซื้อ",
      productNameNotAvailable: "ไม่มีชื่อสินค้า",
      quantity: "จำนวน",

      // Order success screen
      noOrderDataFound: "ไม่พบข้อมูลคำสั่งซื้อ",
      unableToDisplayOrder: "ไม่สามารถแสดงข้อมูลคำสั่งซื้อได้",
      backToShop: "กลับไปช้อปปิ้ง",
      orderConfirmed: "ยืนยันคำสั่งซื้อแล้ว!",
      thankYouPurchase:
        "ขอบคุณสำหรับการซื้อ คำสั่งซื้อของคุณได้รับการยืนยันเรียบร้อยแล้ว",
      orderDetails: "รายละเอียดคำสั่งซื้อ",
      orderIdLabel: "รหัสคำสั่งซื้อ",
      totalAmountLabel: "จำนวนเงินรวม",
      statusLabel: "สถานะ",
      noProductsFound: "ไม่พบสินค้า",
      shippingInformation: "ข้อมูลการจัดส่ง",
      viewOrderHistory: "ดูประวัติการสั่งซื้อ",

      // Checkout screen
      contact: "ติดต่อ",
      delivery: "การจัดส่ง",
      country: "ประเทศ",
      firstName: "ชื่อ",
      lastName: "นามสกุล",
      address: "ที่อยู่",
      apartment: "อพาร์ตเมนต์, ห้องชุด, ฯลฯ (ไม่บังคับ)",
      city: "เมือง",
      postalCode: "รหัสไปรษณีย์ (ไม่บังคับ)",
      phone: "โทรศัพท์",
      email: "อีเมล",
      selectCity: "เลือกเมือง",
      shippingMethod: "วิธีการจัดส่ง",
      worldwideFlatRate: "อัตราคงที่ทั่วโลก",
      orderSummary: "สรุปคำสั่งซื้อ",
      pricesUpdatedFor: "✓ ราคาอัปเดตสำหรับ{{country}}",
      subtotal: "ยอดรวมย่อย",
      shipping: "การจัดส่ง",
      freeship: "ส่งฟรี",

      // Payment button
      processingPayment: "กำลังดำเนินการชำระเงิน...",
      paymentSuccessfulButton: "ชำระเงินสำเร็จ!",
      paymentFailedRetry: "การชำระเงินล้มเหลว - ลองใหม่",
      insufficientBalance: "ยอดเงินไม่เพียงพอ (ต้องการ {{amount}} WLD เพิ่ม)",
      processing: "กำลังดำเนินการ...",
      payWLD: "ชำระ {{amount}} WLD",
      insufficientWLDBalance:
        "ยอด WLD ไม่เพียงพอ คุณต้องการ {{amount}} WLD เพิ่มเติมเพื่อชำระเงิน",
      paymentCompletedSuccessfully: "✅ ชำระเงินสำเร็จแล้ว!",

      // Toast messages
      pleaseSelectSize: "กรุณาเลือกสี",
      sizeOutOfStock: "สีนี้หมดแล้ว",
      addedToBag: "เพิ่มในกระเป๋าแล้ว!",
      failedToAddToCart: "ไม่สามารถเพิ่มในตะกร้าได้",
      paymentSuccessful:
        "ชำระเงินสำเร็จแต่ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาติดต่อฝ่ายสนับสนุน",
      paymentFailed: "การชำระเงินล้มเหลว:",

      // Common
      back: "กลับ",
      cancel: "ยกเลิก",
      confirm: "ยืนยัน",
      save: "บันทึก",
      loading: "กำลังโหลด...",
      error: "เกิดข้อผิดพลาด",
      tryAgain: "ลองอีกครั้ง",
      signIn: "เข้าสู่ระบบ",
      paid: "ชำระแล้ว",
    },
  },
  ms: {
    translation: {
      // Navigation
      explore: "Terokai",
      bag: "Beg",
      history: "Sejarah",
      settings: "Tetapan",

      // Settings screen
      settingsTitle: "Tetapan",
      appearance: "Penampilan",
      language: "Bahasa",
      darkMode: "Mod Gelap",
      lightMode: "Mod Terang",
      systemMode: "Sistem",

      // Languages
      english: "English",
      thai: "ไทย",
      malay: "Bahasa Melayu",
      filipino: "Filipino",
      indonesian: "Bahasa Indonesia",

      // Product detail
      selectSize: "Pilih Warna",
      addToBag: "Tambah ke beg",
      adding: "Menambah...",
      outOfStock: "Kehabisan stok",
      about: "Mengenai",
      material: "Bahan",
      otherDetails: "Butiran Lain",
      madeBy: "Dibuat oleh",
      inStock: "Ada stok",
      collection: "Koleksi",
      onlyLeft: "Hanya {{count}} yang tinggal",

      // Cart
      yourBag: "Beg Anda",
      item: "item",
      items: "item",
      size: "Warna",
      total: "Jumlah",
      checkout: "Bayar",
      emptyBag: "Beg anda kosong",
      continueShopping: "Teruskan Membeli-belah",

      // History
      orderHistory: "Sejarah Pesanan",
      noOrdersYet: "Belum Ada Pesanan",
      noOrdersMessage:
        "Anda belum membuat pesanan. Mulakan membeli-belah untuk melihat sejarah pesanan anda di sini.",
      startShopping: "Mulakan Membeli-belah",
      orderId: "Pesanan #",
      totalAmount: "Jumlah Keseluruhan",
      loadingOrderHistory: "Memuat sejarah pesanan...",

      // Explore screen
      featuredProducts: "Produk Pilihan",
      featured: "PILIHAN",
      viewProduct: "Lihat Produk",
      noFeaturedProducts: "Tiada Produk Pilihan",
      checkBackLater: "Kembali semula nanti untuk item pilihan",
      seeAll: "Lihat semua",
      noProductsAvailable: "Tiada produk tersedia dalam koleksi ini",

      // Product detail screen
      additionalDetailsNotAvailable: "Butiran tambahan tidak tersedia",
      connectWalletToAddItems:
        "Sila sambungkan dompet anda untuk menambah item ke beg",
      productNotFound: "Produk tidak dijumpai",

      // Bag screen
      loginRequired: "Log Masuk Diperlukan",
      signInWithWorldId:
        "Sila log masuk dengan World ID anda untuk melihat beg",
      signInWithWorldIdHistory:
        "Sila log masuk dengan World ID anda untuk melihat sejarah pesanan",
      noItemsYet: "Belum ada item",
      itemsDisplayedHere: "Item anda akan dipaparkan di sini",
      orderHistoryDisplayedHere: "Sejarah pesanan anda akan dipaparkan di sini",
      loadingCart: "Memuat beg...",
      retrying: "Cuba semula...",

      // Order details
      productsOrdered: "Produk yang Dipesan",
      productNameNotAvailable: "Nama Produk Tidak Tersedia",
      quantity: "Kuantiti",

      // Order success screen
      noOrderDataFound: "Tiada Data Pesanan Dijumpai",
      unableToDisplayOrder: "Tidak dapat memaparkan maklumat pesanan.",
      backToShop: "Kembali ke Kedai",
      orderConfirmed: "Pesanan Disahkan!",
      thankYouPurchase:
        "Terima kasih atas pembelian anda. Pesanan anda telah berjaya dibuat.",
      orderDetails: "Butiran Pesanan",
      orderIdLabel: "ID Pesanan",
      totalAmountLabel: "Jumlah Keseluruhan",
      statusLabel: "Status",
      noProductsFound: "Tiada produk dijumpai",
      shippingInformation: "Maklumat Penghantaran",
      viewOrderHistory: "Lihat Sejarah Pesanan",

      // Checkout screen
      contact: "Hubungi",
      delivery: "Penghantaran",
      country: "Negara",
      firstName: "Nama pertama",
      lastName: "Nama keluarga",
      address: "Alamat",
      apartment: "Apartmen, suite, dll. (pilihan)",
      city: "Bandar",
      postalCode: "Kod pos (pilihan)",
      phone: "Telefon",
      email: "E-mel",
      selectCity: "Pilih Bandar",
      shippingMethod: "Kaedah penghantaran",
      worldwideFlatRate: "Kadar Rata Sedunia",
      orderSummary: "Ringkasan pesanan",
      pricesUpdatedFor: "✓ Harga dikemas kini untuk {{country}}",
      subtotal: "Subjumlah",
      shipping: "Penghantaran",
      freeship: "Penghantaran percuma",

      // Payment button
      processingPayment: "Memproses Pembayaran...",
      paymentSuccessfulButton: "Pembayaran Berjaya!",
      paymentFailedRetry: "Pembayaran Gagal - Cuba Lagi",
      insufficientBalance: "Baki Tidak Mencukupi (Perlu {{amount}} WLD lagi)",
      processing: "Memproses...",
      payWLD: "Bayar {{amount}} WLD",
      insufficientWLDBalance:
        "Baki WLD tidak mencukupi. Anda perlu {{amount}} WLD lagi untuk melengkapkan pembayaran.",
      paymentCompletedSuccessfully: "✅ Pembayaran selesai dengan jayanya!",

      // Toast messages
      pleaseSelectSize: "Sila pilih warna",
      sizeOutOfStock: "Warna ini kehabisan stok",
      addedToBag: "ditambah ke beg!",
      failedToAddToCart: "Gagal menambah ke beg",
      paymentSuccessful:
        "Pembayaran berjaya tetapi gagal membuat pesanan. Sila hubungi sokongan.",
      paymentFailed: "Pembayaran gagal:",

      // Common
      back: "Kembali",
      cancel: "Batal",
      confirm: "Sahkan",
      save: "Simpan",
      loading: "Memuat...",
      error: "Ralat",
      tryAgain: "Cuba Lagi",
      signIn: "Log masuk",
      paid: "Dibayar",
    },
  },
  ph: {
    translation: {
      // Navigation
      explore: "Tuklasin",
      bag: "Bag",
      history: "Kasaysayan",
      settings: "Mga Setting",

      // Settings screen
      settingsTitle: "Mga Setting",
      appearance: "Hitsura",
      language: "Wika",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      systemMode: "Sistema",

      // Languages
      english: "English",
      thai: "ไทย",
      malay: "Bahasa Melayu",
      filipino: "Filipino",
      indonesian: "Bahasa Indonesia",

      // Product detail
      selectSize: "Piliin ang Kulay",
      addToBag: "Idagdag sa bag",
      adding: "Nagdadagdag...",
      outOfStock: "Walang stock",
      about: "Tungkol",
      material: "Materyales",
      otherDetails: "Iba pang Detalye",
      madeBy: "Ginawa ng",
      inStock: "May stock",
      collection: "Koleksyon",
      onlyLeft: "{{count}} nalang ang natitira",

      // Cart
      yourBag: "Inyong Bag",
      item: "item",
      items: "mga item",
      size: "Kulay",
      total: "Kabuuan",
      checkout: "Checkout",
      emptyBag: "Walang laman ang inyong bag",
      continueShopping: "Magpatuloy sa Pamimili",

      // History
      orderHistory: "Kasaysayan ng Order",
      noOrdersYet: "Walang Order Pa",
      noOrdersMessage:
        "Hindi ka pa nag-order ng kahit ano. Magsimula sa pamimili para makita ang kasaysayan ng iyong order dito.",
      startShopping: "Magsimula sa Pamimili",
      orderId: "Order #",
      totalAmount: "Kabuuang Halaga",
      loadingOrderHistory: "Naglo-load ng kasaysayan ng order...",

      // Explore screen
      featuredProducts: "Mga Piling Produkto",
      featured: "PILING",
      viewProduct: "Tingnan ang Produkto",
      noFeaturedProducts: "Walang Piling Produkto",
      checkBackLater: "Bumalik mamaya para sa mga piling item",
      seeAll: "Tingnan lahat",
      noProductsAvailable: "Walang available na produkto sa koleksyon na ito",

      // Product detail screen
      additionalDetailsNotAvailable: "Walang karagdagang detalye",
      connectWalletToAddItems:
        "Pakikonekta ang inyong wallet para magdagdag ng items sa bag",
      productNotFound: "Hindi nahanap ang produkto",

      // Bag screen
      loginRequired: "Kailangan ng Login",
      signInWithWorldId:
        "Pakimag-sign in gamit ang inyong World ID para makita ang bag",
      signInWithWorldIdHistory:
        "Pakimag-sign in gamit ang inyong World ID para makita ang kasaysayan ng order",
      noItemsYet: "Walang items pa",
      itemsDisplayedHere: "Ang inyong mga items ay ipapakita dito",
      orderHistoryDisplayedHere:
        "Ang kasaysayan ng inyong order ay ipapakita dito",
      loadingCart: "Naglo-load ng bag...",
      retrying: "Sinusubukan ulit...",

      // Order details
      productsOrdered: "Mga Produktong Na-order",
      productNameNotAvailable: "Hindi Available ang Pangalan ng Produkto",
      quantity: "Dami",

      // Order success screen
      noOrderDataFound: "Walang Nahanap na Data ng Order",
      unableToDisplayOrder: "Hindi maipakita ang impormasyon ng order.",
      backToShop: "Balik sa Shop",
      orderConfirmed: "Nakumpirma ang Order!",
      thankYouPurchase:
        "Salamat sa inyong pagbili. Matagumpay na nailagay ang inyong order.",
      orderDetails: "Mga Detalye ng Order",
      orderIdLabel: "Order ID",
      totalAmountLabel: "Kabuuang Halaga",
      statusLabel: "Status",
      noProductsFound: "Walang nahanap na produkto",
      shippingInformation: "Impormasyon ng Shipping",
      viewOrderHistory: "Tingnan ang Kasaysayan ng Order",

      // Checkout screen
      contact: "Kontak",
      delivery: "Paghahatid",
      country: "Bansa",
      firstName: "Unang pangalan",
      lastName: "Apelyido",
      address: "Address",
      apartment: "Apartment, suite, atbp. (opsyonal)",
      city: "Lungsod",
      postalCode: "Postal code (opsyonal)",
      phone: "Telepono",
      email: "Email",
      selectCity: "Piliin ang Lungsod",
      shippingMethod: "Paraan ng paghahatid",
      worldwideFlatRate: "Pantay na Rate sa Buong Mundo",
      orderSummary: "Buod ng order",
      pricesUpdatedFor: "✓ Na-update ang presyo para sa {{country}}",
      subtotal: "Subtotal",
      shipping: "Paghahatid",
      freeship: "Libreng hatid",

      // Payment button
      processingPayment: "Ginagawa ang Bayad...",
      paymentSuccessfulButton: "Matagumpay ang Bayad!",
      paymentFailedRetry: "Hindi Natagumpay ang Bayad - Subukan Ulit",
      insufficientBalance: "Kulang ang Pera (Kailangan {{amount}} WLD pa)",
      processing: "Ginagawa...",
      payWLD: "Magbayad {{amount}} WLD",
      insufficientWLDBalance:
        "Kulang ang WLD balance. Kailangan mo ng {{amount}} WLD pa para sa bayad.",
      paymentCompletedSuccessfully: "✅ Tapos na ang bayad!",

      // Toast messages
      pleaseSelectSize: "Pakipili ng kulay",
      sizeOutOfStock: "Walang stock ang kulay na ito",
      addedToBag: "naidagdag sa bag!",
      failedToAddToCart: "Hindi naidagdag sa bag",
      paymentSuccessful:
        "Matagumpay ang bayad pero hindi nagawa ang order. Makipag-ugnayan sa support.",
      paymentFailed: "Hindi natagumpay ang bayad:",

      // Common
      back: "Balik",
      cancel: "Kanselahin",
      confirm: "Kumpirmahin",
      save: "I-save",
      loading: "Naglo-load...",
      error: "May mali",
      tryAgain: "Subukan Ulit",
      signIn: "Mag-sign in",
      paid: "Bayad",
    },
  },
  id: {
    translation: {
      // Navigation
      explore: "Jelajahi",
      bag: "Tas",
      history: "Riwayat",
      settings: "Pengaturan",

      // Settings screen
      settingsTitle: "Pengaturan",
      appearance: "Tampilan",
      language: "Bahasa",
      darkMode: "Mode Gelap",
      lightMode: "Mode Terang",
      systemMode: "Sistem",

      // Languages
      english: "English",
      thai: "ไทย",
      malay: "Bahasa Melayu",
      filipino: "Filipino",
      indonesian: "Bahasa Indonesia",

      // Product detail
      selectSize: "Pilih Warna",
      addToBag: "Tambah ke tas",
      adding: "Menambahkan...",
      outOfStock: "Stok habis",
      about: "Tentang",
      material: "Bahan",
      otherDetails: "Detail Lainnya",
      madeBy: "Dibuat oleh",
      inStock: "Tersedia",
      collection: "Koleksi",
      onlyLeft: "Hanya tersisa {{count}}",

      // Cart
      yourBag: "Tas Anda",
      item: "item",
      items: "item",
      size: "Warna",
      total: "Total",
      checkout: "Checkout",
      emptyBag: "Tas anda kosong",
      continueShopping: "Lanjut Berbelanja",

      // History
      orderHistory: "Riwayat Pesanan",
      noOrdersYet: "Belum Ada Pesanan",
      noOrdersMessage:
        "Anda belum membuat pesanan. Mulai berbelanja untuk melihat riwayat pesanan anda di sini.",
      startShopping: "Mulai Berbelanja",
      orderId: "Pesanan #",
      totalAmount: "Total Jumlah",
      loadingOrderHistory: "Memuat riwayat pesanan...",

      // Explore screen
      featuredProducts: "Produk Unggulan",
      featured: "UNGGULAN",
      viewProduct: "Lihat Produk",
      noFeaturedProducts: "Tidak Ada Produk Unggulan",
      checkBackLater: "Kembali lagi nanti untuk item unggulan",
      seeAll: "Lihat semua",
      noProductsAvailable: "Tidak ada produk tersedia dalam koleksi ini",

      // Product detail screen
      additionalDetailsNotAvailable: "Detail tambahan tidak tersedia",
      connectWalletToAddItems:
        "Silakan hubungkan dompet Anda untuk menambahkan item ke tas",
      productNotFound: "Produk tidak ditemukan",

      // Bag screen
      loginRequired: "Login Diperlukan",
      signInWithWorldId: "Silakan masuk dengan World ID Anda untuk melihat tas",
      signInWithWorldIdHistory:
        "Silakan masuk dengan World ID Anda untuk melihat riwayat pesanan",
      noItemsYet: "Belum ada item",
      itemsDisplayedHere: "Item Anda akan ditampilkan di sini",
      orderHistoryDisplayedHere:
        "Riwayat pesanan Anda akan ditampilkan di sini",
      loadingCart: "Memuat tas...",
      retrying: "Mencoba lagi...",

      // Order details
      productsOrdered: "Produk yang Dipesan",
      productNameNotAvailable: "Nama Produk Tidak Tersedia",
      quantity: "Jumlah",

      // Order success screen
      noOrderDataFound: "Data Pesanan Tidak Ditemukan",
      unableToDisplayOrder: "Tidak dapat menampilkan informasi pesanan.",
      backToShop: "Kembali ke Toko",
      orderConfirmed: "Pesanan Dikonfirmasi!",
      thankYouPurchase:
        "Terima kasih atas pembelian Anda. Pesanan Anda telah berhasil dibuat.",
      orderDetails: "Detail Pesanan",
      orderIdLabel: "ID Pesanan",
      totalAmountLabel: "Total Jumlah",
      statusLabel: "Status",
      noProductsFound: "Tidak ada produk ditemukan",
      shippingInformation: "Informasi Pengiriman",
      viewOrderHistory: "Lihat Riwayat Pesanan",

      // Checkout screen
      contact: "Kontak",
      delivery: "Pengiriman",
      country: "Negara",
      firstName: "Nama depan",
      lastName: "Nama belakang",
      address: "Alamat",
      apartment: "Apartemen, suite, dll. (opsional)",
      city: "Kota",
      postalCode: "Kode pos (opsional)",
      phone: "Telepon",
      email: "Email",
      selectCity: "Pilih Kota",
      shippingMethod: "Metode pengiriman",
      worldwideFlatRate: "Tarif Tetap Seluruh Dunia",
      orderSummary: "Ringkasan pesanan",
      pricesUpdatedFor: "✓ Harga diperbarui untuk {{country}}",
      subtotal: "Subtotal",
      shipping: "Pengiriman",
      freeship: "Gratis ongkir",

      // Payment button
      processingPayment: "Memproses Pembayaran...",
      paymentSuccessfulButton: "Pembayaran Berhasil!",
      paymentFailedRetry: "Pembayaran Gagal - Coba Lagi",
      insufficientBalance: "Saldo Tidak Cukup (Butuh {{amount}} WLD lagi)",
      processing: "Memproses...",
      payWLD: "Bayar {{amount}} WLD",
      insufficientWLDBalance:
        "Saldo WLD tidak cukup. Anda membutuhkan {{amount}} WLD lagi untuk menyelesaikan pembayaran.",
      paymentCompletedSuccessfully: "✅ Pembayaran berhasil diselesaikan!",

      // Toast messages
      pleaseSelectSize: "Silakan pilih warna",
      sizeOutOfStock: "Warna ini sedang habis",
      addedToBag: "ditambahkan ke tas!",
      failedToAddToCart: "Gagal menambahkan ke tas",
      paymentSuccessful:
        "Pembayaran berhasil tetapi gagal membuat pesanan. Silakan hubungi dukungan.",
      paymentFailed: "Pembayaran gagal:",

      // Common
      back: "Kembali",
      cancel: "Batal",
      confirm: "Konfirmasi",
      save: "Simpan",
      loading: "Memuat...",
      error: "Error",
      tryAgain: "Coba Lagi",
      signIn: "Masuk",
      paid: "Dibayar",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: "en", // default language

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
