const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
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
  step1.classList.remove("completed");
  step2.classList.remove("active", "completed");
  step3.classList.remove("active", "completed");
  
  // Update based on selection
  if (selectedDate) {
    step1.classList.add("completed");
    if (selectedStart) {
      step2.classList.add("completed");
      step3.classList.add("active");
    } else {
      step2.classList.add("active");
    }
  } else {
    step1.classList.add("active");
  }
}

function showCalendar() {
  const calendarWrapper = document.querySelector(".calendar-wrapper");
  calendarWrapper.style.display = "block";
  timeSlotsSection.style.display = "none";
}

function showTimeSlots() {
  const calendarWrapper = document.querySelector(".calendar-wrapper");
  calendarWrapper.style.display = "none";
  timeSlotsSection.style.display = "block";
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
  calendarGrid.innerHTML = "";
  calendarTitle.textContent = formatMonthYear(currentMonth);
  todayIndicator.textContent = `اليوم: ${formatTodayIndicator()}`;

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
    dayElement.classList.add("calendar-day", "other-month");
    dayElement.textContent = prevDate.getDate();
    calendarGrid.appendChild(dayElement);
  }

  // Fill in the days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = dateToString(date);
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day");
    dayElement.textContent = day;

    // Check if date is in the past
    if (dateString < minDate) {
      dayElement.classList.add("disabled");
    } else {
      // Check if it's today
      if (dateString === today) {
        dayElement.classList.add("today");
      }

      // Check availability
      if (isDateAvailable(dateString)) {
        dayElement.classList.add("available");
        dayElement.addEventListener("click", () => selectDate(dateString));
      } else {
        dayElement.classList.add("booked");
      }
    }

    // Mark as selected
    if (dateString === selectedDate) {
      dayElement.classList.add("selected");
    }

    calendarGrid.appendChild(dayElement);
  }

  // Fill in the days from next month
  const totalCells = calendarGrid.children.length;
  const cellsNeeded = 42 - totalCells;
  for (let day = 1; day <= cellsNeeded; day++) {
    const nextDate = new Date(year, month + 1, day);
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day", "other-month");
    dayElement.textContent = day;
    calendarGrid.appendChild(dayElement);
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
  scheduleGrid.innerHTML = "";

  if (!selectedDate) {
    timeSlotsSection.style.display = "none";
    return;
  }

  timeSlotsSection.style.display = "block";
  selectedDateDisplay.textContent = `الأوقات المتاحة: ${formatDateDisplay(selectedDate)}`;

  const bookedSlots = getBookedSlots(selectedDate);
  const selectedSlots = getSelectedSlots();

  getSlots().forEach(slot => {
    const slotElement = document.createElement("button");
    slotElement.type = "button";
    slotElement.classList.add("slot-card");
    slotElement.textContent = formatTime(parseTimeKey(slot));

    if (bookedSlots.includes(slot)) {
      slotElement.classList.add("slot-booked");
      slotElement.disabled = true;
      slotElement.title = "محجوز بالفعل";
    } else {
      slotElement.classList.add("slot-available");
      slotElement.addEventListener("click", () => handleSlotClick(slot));
    }

    if (selectedSlots.includes(slot)) {
      slotElement.classList.add("slot-selected");
    }

    scheduleGrid.appendChild(slotElement);
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
    summaryText.textContent = "حدد اليوم ثم اختر توقيتًا لبدء الحجز.";
    bookNowBtn.disabled = true;
    return;
  }

  const displayDate = formatDateDisplay(selectedDate);
  const durationText = selectedDuration === 1 ? "ساعة" : selectedDuration === 2 ? "ساعتان" : "ثلاث ساعات";
  summaryText.textContent = `التاريخ: ${displayDate} | يبدأ عند: ${formatTime(parseTimeKey(selectedStart))} | المدة: ${durationText}`;
  bookNowBtn.disabled = false;
}

function saveBookings() {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

function bookNow() {
  if (!selectedDate || !selectedStart) {
    alert("يجب اختيار تاريخ ووقت ومدة الحجز أولاً.");
    return;
  }

  const message = `السلام عليكم، ممكن أحجز الساعة ${formatTime(parseTimeKey(selectedStart))} ولمدة ${selectedDuration}`;
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

  prevMonthBtn.addEventListener("click", previousMonth);
  nextMonthBtn.addEventListener("click", nextMonth);
  
  changeDateBtn.addEventListener("click", () => {
    selectedDate = "";
    selectedStart = "";
    renderCalendar();
    updateSelectionSummary();
    updateWorkflow();
    showCalendar();
  });

  durationRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      selectedDuration = parseInt(radio.value, 10);
      selectedStart = "";
      renderTimeSlots();
      updateSelectionSummary();
      updateWorkflow();
    });
  });

  bookNowBtn.addEventListener("click", bookNow);
}

initialize();
