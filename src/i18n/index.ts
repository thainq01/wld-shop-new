import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
      selectSize: "Select Size",
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
      total: "Total",
      checkout: "Checkout",
      emptyBag: "Your bag is empty",
      continueShopping: "Continue Shopping",
      
      // History
      orderHistory: "Order History",
      noOrdersYet: "No Orders Yet",
      noOrdersMessage: "You haven't placed any orders yet. Start shopping to see your order history here.",
      startShopping: "Start Shopping",
      orderId: "Order #",
      totalAmount: "Total Amount",
      loadingOrderHistory: "Loading order history...",
      
      // Common
      back: "Back",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      tryAgain: "Try Again",
    }
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
      selectSize: "เลือกขนาด",
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
      total: "รวม",
      checkout: "ชำระเงิน",
      emptyBag: "กระเป๋าของคุณว่างเปล่า",
      continueShopping: "ช้อปปิ้งต่อ",
      
      // History
      orderHistory: "ประวัติการสั่งซื้อ",
      noOrdersYet: "ยังไม่มีคำสั่งซื้อ",
      noOrdersMessage: "คุณยังไม่ได้สั่งซื้ออะไรเลย เริ่มช้อปปิ้งเพื่อดูประวัติการสั่งซื้อของคุณที่นี่",
      startShopping: "เริ่มช้อปปิ้ง",
      orderId: "คำสั่งซื้อ #",
      totalAmount: "จำนวนเงินรวม",
      loadingOrderHistory: "กำลังโหลดประวัติการสั่งซื้อ...",
      
      // Common
      back: "กลับ",
      cancel: "ยกเลิก",
      confirm: "ยืนยัน",
      save: "บันทึก",
      loading: "กำลังโหลด...",
      error: "เกิดข้อผิดพลาด",
      tryAgain: "ลองอีกครั้ง",
    }
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
      selectSize: "Pilih Saiz",
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
      total: "Jumlah",
      checkout: "Bayar",
      emptyBag: "Beg anda kosong",
      continueShopping: "Teruskan Membeli-belah",
      
      // History
      orderHistory: "Sejarah Pesanan",
      noOrdersYet: "Belum Ada Pesanan",
      noOrdersMessage: "Anda belum membuat pesanan. Mulakan membeli-belah untuk melihat sejarah pesanan anda di sini.",
      startShopping: "Mulakan Membeli-belah",
      orderId: "Pesanan #",
      totalAmount: "Jumlah Keseluruhan",
      loadingOrderHistory: "Memuat sejarah pesanan...",
      
      // Common
      back: "Kembali",
      cancel: "Batal",
      confirm: "Sahkan",
      save: "Simpan",
      loading: "Memuat...",
      error: "Ralat",
      tryAgain: "Cuba Lagi",
    }
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
      selectSize: "Piliin ang Laki",
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
      total: "Kabuuan",
      checkout: "Checkout",
      emptyBag: "Walang laman ang inyong bag",
      continueShopping: "Magpatuloy sa Pamimili",
      
      // History
      orderHistory: "Kasaysayan ng Order",
      noOrdersYet: "Walang Order Pa",
      noOrdersMessage: "Hindi ka pa nag-order ng kahit ano. Magsimula sa pamimili para makita ang kasaysayan ng iyong order dito.",
      startShopping: "Magsimula sa Pamimili",
      orderId: "Order #",
      totalAmount: "Kabuuang Halaga",
      loadingOrderHistory: "Naglo-load ng kasaysayan ng order...",
      
      // Common
      back: "Balik",
      cancel: "Kanselahin",
      confirm: "Kumpirmahin",
      save: "I-save",
      loading: "Naglo-load...",
      error: "May mali",
      tryAgain: "Subukan Ulit",
    }
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
      selectSize: "Pilih Ukuran",
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
      total: "Total",
      checkout: "Checkout",
      emptyBag: "Tas anda kosong",
      continueShopping: "Lanjut Berbelanja",
      
      // History
      orderHistory: "Riwayat Pesanan",
      noOrdersYet: "Belum Ada Pesanan",
      noOrdersMessage: "Anda belum membuat pesanan. Mulai berbelanja untuk melihat riwayat pesanan anda di sini.",
      startShopping: "Mulai Berbelanja",
      orderId: "Pesanan #",
      totalAmount: "Total Jumlah",
      loadingOrderHistory: "Memuat riwayat pesanan...",
      
      // Common
      back: "Kembali",
      cancel: "Batal",
      confirm: "Konfirmasi",
      save: "Simpan",
      loading: "Memuat...",
      error: "Error",
      tryAgain: "Coba Lagi",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // default language
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
