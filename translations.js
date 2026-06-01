// Translations for Arabic and English
const translations = {
  ar: {
    // Header & Navigation
    headerTitle: "جدول أوقات الحجوزات",
    headerSubtitle: "اختر الوقت المناسب لك من الجدول أدناه",
    galleryTitle: "مميزات المكتب",
    
    // Booking Duration
    bookingDuration: "مدة الحجز",
    oneHour: "ساعة",
    twoHours: "ساعتان",
    threeHours: "ثلاث ساعات",
    
    // Price Banner
    priceText: "حجز الساعة الواحدة:",
    priceAmount: "6 د.ك",
    priceIncluding: "شاملة القهوة وقوارير الماء.",
    
    // Available Times
    availableTimes: "الأوقات المتاحة",
    
    // Selection Summary
    selectDateAndTime: "حدد اليوم ثم اختر توقيتًا لبدء الحجز.",
    bookAndPay: "احجز وادفع",
    selectedInfo: "التاريخ: {date} | يبدأ عند: {time} | المدة: {duration}",
    
    // Duration Text
    durationOneHour: "ساعة",
    durationHours: "{count} ساعات",
    
    // Gallery Captions
    photostudio: "استيديو تصوير",
    consultingSession: "جلسة استشارية",
    trainingWorkshop: "ورشة تعلمية",
    
    // Payment Page
    electronicPayment: "الدفع الإلكتروني",
    bookingTime: "وقت الحجز:",
    bookingDate: "تاريخ الحجز:",
    duration: "المدة:",
    pricePerHour: "السعر لكل ساعة:",
    totalPrice: "السعر النهائي:",
    payViaWhatsApp: "الدفع عبر واتساب",
    backToBooking: "العودة للحجز",
    
    // Day Names
    sunday: "الأحد",
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
    
    // Months
    monthLabel: "الشهر",
    january: "يناير",
    february: "فبراير",
    march: "مارس",
    april: "أبريل",
    may: "مايو",
    june: "يونيو",
    july: "يوليو",
    august: "أغسطس",
    september: "سبتمبر",
    october: "أكتوبر",
    november: "نوفمبر",
    december: "ديسمبر",
    
    // Admin Panel
    adminTitle: "لوحة إدارة الحجوزات",
    addNewBooking: "إضافة حجز جديد",
    enterTime: "اكتب الساعة مثلاً 9:30 صباحًا",
    booked: "محجوز",
    available: "متاح",
    add: "إضافة",
    hour: "الساعة",
    status: "الحالة",
    actions: "إجراءات",
    delete: "حذف",
    
    // Today Indicator
    today: "اليوم:",
    
    // WhatsApp Message
    whatsappMessage: "السلام عليكم، أود حجز الساعة {time} في تاريخ {date} ولمدة {duration}. السعر النهائي: {price} دينار كويتي.",
  },
  en: {
    // Header & Navigation
    headerTitle: "Booking Schedule",
    headerSubtitle: "Choose the suitable time from the schedule below",
    galleryTitle: "Office Features",
    
    // Booking Duration
    bookingDuration: "Booking Duration",
    oneHour: "One Hour",
    twoHours: "Two Hours",
    threeHours: "Three Hours",
    
    // Price Banner
    priceText: "One hour booking:",
    priceAmount: "6 KWD",
    priceIncluding: "including coffee and water bottles.",
    
    // Available Times
    availableTimes: "Available Times",
    
    // Selection Summary
    selectDateAndTime: "Select a day, then choose a time to start your booking.",
    bookAndPay: "Book and Pay",
    selectedInfo: "Date: {date} | Starts at: {time} | Duration: {duration}",
    
    // Duration Text
    durationOneHour: "1 Hour",
    durationHours: "{count} Hours",
    
    // Gallery Captions
    photostudio: "Photography Studio",
    consultingSession: "Consulting Session",
    trainingWorkshop: "Training Workshop",
    
    // Payment Page
    electronicPayment: "Electronic Payment",
    bookingTime: "Booking Time:",
    bookingDate: "Booking Date:",
    duration: "Duration:",
    pricePerHour: "Price per Hour:",
    totalPrice: "Total Price:",
    payViaWhatsApp: "Pay via WhatsApp",
    backToBooking: "Back to Booking",
    
    // Day Names
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    
    // Months
    monthLabel: "Month",
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
    
    // Admin Panel
    adminTitle: "Booking Management Panel",
    addNewBooking: "Add New Booking",
    enterTime: "Enter time, e.g., 3:00 PM",
    booked: "Booked",
    available: "Available",
    add: "Add",
    hour: "Time",
    status: "Status",
    actions: "Actions",
    delete: "Delete",
    
    // Today Indicator
    today: "Today:",
    
    // WhatsApp Message
    whatsappMessage: "Hello, I would like to book at {time} on {date} for {duration}. Final price: {price} KWD.",
  }
};

// Get current language from localStorage or default to Arabic
function getCurrentLanguage() {
  return localStorage.getItem("language") || "ar";
}

// Set language in localStorage
function setLanguage(lang) {
  localStorage.setItem("language", lang);
}

// Get translation text
function t(key, replacements = {}) {
  const lang = getCurrentLanguage();
  let text = translations[lang][key] || translations["ar"][key] || key;
  
  // Replace placeholders
  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(`{${placeholder}}`, value);
  }
  
  return text;
}

// Change page language
function changeLanguage(lang) {
  setLanguage(lang);
  window.location.reload();
}

// Update page direction based on language
function updatePageDirection() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
}

// Initialize page direction on load
document.addEventListener("DOMContentLoaded", updatePageDirection);
