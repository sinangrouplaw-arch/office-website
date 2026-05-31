const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
// Global resource load error handler: warns developer when images/scripts/styles fail to load
window.addEventListener("error", (event) => {
  const target = event.target || event.srcElement;
  try {
    if (target && target.tagName) {
      const tag = target.tagName.toUpperCase();
      if (tag === "IMG" || tag === "SCRIPT" || tag === "LINK") {
        const url = target.src || target.href || "unknown resource";
        console.warn(`Resource failed to load: ${url}`);
      }
    }
  } catch (e) {
    // swallow secondary errors from the handler itself
  }
}, true);
let selectedDate = "";
let selectedStart = "";
let selectedDuration = 1;
let currentMonth = new Date();

const calendarGrid = document.getElementById("calendar-grid");
const calendarTitle = document.getElementById("calendar-title");
const todayIndicator = document.getElementById("today-indicator");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const scheduleGrid = document.getElementById("schedule-grid");
const timeSlotsSection = document.getElementById("time-slots-section");
const selectedDateDisplay = document.getElementById("selected-date-display");
const changeDateBtn = document.getElementById("change-date-btn");
const summaryText = document.getElementById("selected-summary");
const bookNowBtn = document.getElementById("book-now-btn");
const durationRadios = document.querySelectorAll('input[name="duration"]');
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const step3 = document.getElementById("step-3");

const BOOKING_START_MIN = 8 * 60;
const BOOKING_END_MIN = 20 * 60;
const SLOT_INTERVAL = 30;

function formatTime(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const minuteText = minute === 0 ? "00" : "30";
  let label = "صباحًا";

  if (hour === 12) {
    label = "ظهرًا";
  } else if (hour > 12) {
    label = "مساءً";
  }

  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteText} ${label}`;
}

function getTimeKey(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function parseTimeKey(timeKey) {
  const [hour, minute] = timeKey.split(":").map(Number);
  return hour * 60 + minute;
}

function getSlots() {
  const slots = [];
  for (let minutes = BOOKING_START_MIN; minutes < BOOKING_END_MIN; minutes += SLOT_INTERVAL) {
    slots.push(getTimeKey(minutes));
  }
  return slots;
}

function getBookedSlots(date) {
  return bookings[date] || [];
}

function isSlotBooked(date, slot) {
  return getBookedSlots(date).includes(slot);
}

function getSelectedSlots() {
  if (!selectedStart) return [];
  const startMinutes = parseTimeKey(selectedStart);
  const count = selectedDuration * 2;
  const selected = [];

  for (let i = 0; i < count; i++) {
    const minutes = startMinutes + i * SLOT_INTERVAL;
    if (minutes >= BOOKING_END_MIN) return [];
    selected.push(getTimeKey(minutes));
  }

  return selected;
}

function formatMonthYear(date) {
  return date.toLocaleDateString("ar-KW", {
    month: "long",
    year: "numeric",
  });
}

function formatTodayIndicator() {
  const today = new Date();
  return today.toLocaleDateString("ar-KW", {
    weekday: "long",
    day: "numeric",
  });
}

function updateWorkflow() {
  // Reset all steps
  if (step1) step1.classList.remove("completed");
  if (step2) step2.classList.remove("active", "completed");
  if (step3) step3.classList.remove("active", "completed");
  
  // Update based on selection
  if (selectedDate) {
    if (step1) step1.classList.add("completed");
    if (selectedStart) {
      if (step2) step2.classList.add("completed");
      if (step3) step3.classList.add("active");
    } else {
      if (step2) step2.classList.add("active");
    }
  } else {
    if (step1) step1.classList.add("active");
  }
}

function showCalendar() {
  const calendarWrapper = document.querySelector(".calendar-wrapper");
  if (calendarWrapper) calendarWrapper.style.display = "block";
  if (timeSlotsSection) timeSlotsSection.style.display = "none";
}

function showTimeSlots() {
  const calendarWrapper = document.querySelector(".calendar-wrapper");
  if (calendarWrapper) calendarWrapper.style.display = "none";
  if (timeSlotsSection) timeSlotsSection.style.display = "block";
}

function formatDateDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-KW", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function dateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateAvailable(dateString) {
  const bookedSlots = getBookedSlots(dateString);
  const totalSlots = getSlots().length;
  return bookedSlots.length < totalSlots;
}

function renderCalendar() {
  if (calendarGrid) calendarGrid.innerHTML = "";
  if (calendarTitle) calendarTitle.textContent = formatMonthYear(currentMonth);
  if (todayIndicator) todayIndicator.textContent = `اليوم: ${formatTodayIndicator()}`;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const today = dateToString(new Date());
  const minDate = dateToString(new Date());

  // Fill in the days from previous month
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    const dayElement = document.createElement("div");
    if (dayElement) dayElement.classList.add("calendar-day", "other-month");
    if (dayElement) dayElement.textContent = prevDate.getDate();
    if (calendarGrid) calendarGrid.appendChild(dayElement);
  }

  // Fill in the days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = dateToString(date);
    const dayElement = document.createElement("div");
    if (dayElement) dayElement.classList.add("calendar-day");
    if (dayElement) dayElement.textContent = day;

    // Check if date is in the past
    if (dateString < minDate) {
      if (dayElement) dayElement.classList.add("disabled");
    } else {
      // Check if it's today
      if (dateString === today) {
        if (dayElement) dayElement.classList.add("today");
      }

      // Check availability
      if (isDateAvailable(dateString)) {
        if (dayElement) dayElement.classList.add("available");
        if (dayElement) dayElement.addEventListener("click", () => selectDate(dateString));
      } else {
        if (dayElement) dayElement.classList.add("booked");
      }
    }

    // Mark as selected
    if (dateString === selectedDate) {
      if (dayElement) dayElement.classList.add("selected");
    }

    if (calendarGrid) calendarGrid.appendChild(dayElement);
  }

  // Fill in the days from next month
  const totalCells = calendarGrid ? calendarGrid.children.length : 0;
  const cellsNeeded = 42 - totalCells;
  for (let day = 1; day <= cellsNeeded; day++) {
    const nextDate = new Date(year, month + 1, day);
    const dayElement = document.createElement("div");
    if (dayElement) dayElement.classList.add("calendar-day", "other-month");
    if (dayElement) dayElement.textContent = day;
    if (calendarGrid) calendarGrid.appendChild(dayElement);
  }
}

function selectDate(dateString) {
  selectedDate = dateString;
  selectedStart = "";
  renderCalendar();
  renderTimeSlots();
  updateSelectionSummary();
  updateWorkflow();
  showTimeSlots();
}

function renderTimeSlots() {
  if (scheduleGrid) scheduleGrid.innerHTML = "";

  if (!selectedDate) {
    if (timeSlotsSection) timeSlotsSection.style.display = "none";
    return;
  }

  if (timeSlotsSection) timeSlotsSection.style.display = "block";
  if (selectedDateDisplay) selectedDateDisplay.textContent = `الأوقات المتاحة: ${formatDateDisplay(selectedDate)}`;

  const bookedSlots = getBookedSlots(selectedDate);
  const selectedSlots = getSelectedSlots();

  getSlots().forEach(slot => {
    const slotElement = document.createElement("button");
    if (slotElement) slotElement.type = "button";
    if (slotElement) slotElement.classList.add("slot-card");
    if (slotElement) slotElement.textContent = formatTime(parseTimeKey(slot));

    if (bookedSlots.includes(slot)) {
      if (slotElement) slotElement.classList.add("slot-booked");
      if (slotElement) slotElement.disabled = true;
      if (slotElement) slotElement.title = "محجوز بالفعل";
    } else {
      if (slotElement) slotElement.classList.add("slot-available");
      if (slotElement) slotElement.addEventListener("click", () => handleSlotClick(slot));
    }

    if (selectedSlots.includes(slot)) {
      if (slotElement) slotElement.classList.add("slot-selected");
    }

    if (scheduleGrid) scheduleGrid.appendChild(slotElement);
  });
}

function handleSlotClick(slot) {
  const consecutiveSlots = getSelectedSlotsForStart(slot, selectedDuration);
  if (!consecutiveSlots.length) {
    alert("المدة المختارة غير متاحة لهذا التوقيت. اختر وقتاً أبكر أو مدة أقصر.");
    return;
  }

  const bookedSlots = getBookedSlots(selectedDate);
  const blocked = consecutiveSlots.some(s => bookedSlots.includes(s));

  if (blocked) {
    alert("بعض الأوقات المتتالية محجوزة بالفعل. اختر وقتًا أو مدة أخرى.");
    return;
  }

  selectedStart = slot;
  renderTimeSlots();
  updateSelectionSummary();
  updateWorkflow();
}

function getSelectedSlotsForStart(startSlot, duration) {
  const startMinutes = parseTimeKey(startSlot);
  const count = duration * 2;
  const selected = [];

  for (let i = 0; i < count; i++) {
    const minutes = startMinutes + i * SLOT_INTERVAL;
    if (minutes >= BOOKING_END_MIN) return [];
    selected.push(getTimeKey(minutes));
  }

  return selected;
}

function updateSelectionSummary() {
  if (!selectedStart) {
    if (summaryText) summaryText.textContent = "حدد اليوم ثم اختر توقيتًا لبدء الحجز.";
    if (bookNowBtn) bookNowBtn.disabled = true;
    return;
  }

  const displayDate = formatDateDisplay(selectedDate);
  const durationText = selectedDuration === 1 ? "ساعة" : selectedDuration === 2 ? "ساعتان" : "ثلاث ساعات";
  if (summaryText) summaryText.textContent = `التاريخ: ${displayDate} | يبدأ عند: ${formatTime(parseTimeKey(selectedStart))} | المدة: ${durationText}`;
  if (bookNowBtn) bookNowBtn.disabled = false;
}

function saveBookings() {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

function bookNow() {
  if (!selectedDate || !selectedStart) {
    alert("يجب اختيار تاريخ ووقت ومدة الحجز أولاً.");
    return;
  }
  const durationText = selectedDuration === 1 ? "ساعة" : `${selectedDuration} ساعات`;
  const message = `السلام عليكم، ممكن أحجز الساعة ${formatTime(parseTimeKey(selectedStart))} ولمدة ${durationText}`;
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/96550933933?text=${encodedText}`;

  window.open(whatsappUrl, "_blank");
}

function previousMonth() {
  currentMonth.setMonth(currentMonth.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentMonth.setMonth(currentMonth.getMonth() + 1);
  renderCalendar();
}

function initialize() {
  const today = new Date().toISOString().slice(0, 10);
  selectedDate = today;
  currentMonth = new Date();

  renderCalendar();
  renderTimeSlots();
  updateSelectionSummary();
  updateWorkflow();

  if (prevMonthBtn) prevMonthBtn.addEventListener("click", previousMonth);
  if (nextMonthBtn) nextMonthBtn.addEventListener("click", nextMonth);
  
  if (changeDateBtn) changeDateBtn.addEventListener("click", () => {
    selectedDate = "";
    selectedStart = "";
    renderCalendar();
    updateSelectionSummary();
    updateWorkflow();
    showCalendar();
  });

  durationRadios.forEach(radio => {
    if (radio) radio.addEventListener("change", () => {
      selectedDuration = parseInt(radio.value, 10);
      selectedStart = "";
      renderTimeSlots();
      updateSelectionSummary();
      updateWorkflow();
    });
  });

  if (bookNowBtn) bookNowBtn.addEventListener("click", bookNow);
}

initialize();
