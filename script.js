const slots = ["10:00 صباحًا", "11:00 صباحًا", "12:00 ظهرًا", "1:00 مساءً", "2:00 مساءً"];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

const tableBody = document.querySelector("#booking-table tbody");

function renderTable() {
  tableBody.innerHTML = "";
  slots.forEach(time => {
    const booking = bookings.find(b => b.time === time);
    const status = booking ? booking.status : "متاح";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${time}</td>
      <td class="${status === "محجوز" ? "booked" : "available"}">${status}</td>
      <td>
        ${status === "متاح" 
          ? `<button onclick="bookSlot('${time}')">احجز الآن</button>` 
          : "غير متاح"}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function bookSlot(time) {
  bookings.push({ time, status: "محجوز" });
  localStorage.setItem("bookings", JSON.stringify(bookings));
  renderTable();
  alert("تم حجز الساعة: " + time);
}

renderTable();
