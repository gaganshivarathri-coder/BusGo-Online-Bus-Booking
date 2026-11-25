
/* =====================================
   BUSGO - ADVANCED BOOKING SYSTEM
===================================== */

// 1. SAMPLE BUS DATABASE

const buses = [
    {
        id: 1,
        name: "Express Travels",
        from: "Hyderabad",
        to: "Bangalore",
        time: "08:00 AM",
        price: 650,
        type: "AC Sleeper",
        seats: 20,
        bookedSeats: [3, 7, 12]
    },
    {
        id: 2,
        name: "Royal Bus Services",
        from: "Hyderabad",
        to: "Bangalore",
        time: "10:30 PM",
        price: 850,
        type: "AC Seater",
        seats: 20,
        bookedSeats: [2, 5, 9]
    },
    {
        id: 3,
        name: "City Travels",
        from: "Hyderabad",
        to: "Chennai",
        time: "09:00 PM",
        price: 750,
        type: "Non-AC Sleeper",
        seats: 20,
        bookedSeats: [1, 4, 8]
    },
    {
        id: 4,
        name: "National Travels",
        from: "Bangalore",
        to: "Chennai",
        time: "07:00 PM",
        price: 600,
        type: "AC Seater",
        seats: 20,
        bookedSeats: [3, 6, 10]
    },
    {
        id: 5,
        name: "Comfort Express",
        from: "Mumbai",
        to: "Hyderabad",
        time: "06:00 PM",
        price: 900,
        type: "AC Sleeper",
        seats: 20,
        bookedSeats: [2, 7, 11]
    },
    {
        id: 6,
        name: "Green Line Travels",
        from: "Hyderabad",
        to: "Mumbai",
        time: "08:30 PM",
        price: 950,
        type: "AC Sleeper",
        seats: 20,
        bookedSeats: [4, 8, 13]
    },
    {
        id: 7,
        name: "Goa Express",
        from: "Mumbai",
        to: "Goa",
        time: "09:00 PM",
        price: 800,
        type: "Non-AC Seater",
        seats: 20,
        bookedSeats: [5, 9, 14]
    },
    {
        id: 8,
        name: "Southern Travels",
        from: "Chennai",
        to: "Hyderabad",
        time: "07:30 PM",
        price: 700,
        type: "AC Seater",
        seats: 20,
        bookedSeats: [2, 6, 12]
    }
];


// 2. BOOKING VARIABLES

let currentBus = null;
let selectedSeats = [];
let journeyDate = "";


// 3. SET MINIMUM JOURNEY DATE

const dateInput = document.getElementById("date");

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dateInput.min = getTodayDate();


// 4. SEARCH BUSES

function searchBuses() {

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = dateInput.value;

    const message = document.getElementById("message");
    const busList = document.getElementById("bus-list");

    // Validate empty fields

    if (!from || !to || !date) {
        message.textContent =
            "Please select departure, destination and date.";

        busList.innerHTML = "";
        return;
    }

    // Validate same cities

    if (from === to) {
        message.textContent =
            "Departure and destination cannot be the same.";

        busList.innerHTML = "";
        return;
    }

    // Validate past date

    if (date < getTodayDate()) {
        message.textContent =
            "Please select today or a future date.";

        busList.innerHTML = "";
        return;
    }

    journeyDate = date;
    message.textContent = "";

    const availableBuses = buses.filter(bus =>
        bus.from === from && bus.to === to
    );

    if (availableBuses.length === 0) {

        busList.innerHTML =
            "<p>No buses found for this route.</p>";

        return;
    }

    displayBuses(availableBuses);

    document.getElementById("results").scrollIntoView({
        behavior: "smooth"
    });
}


// 5. DISPLAY BUS RESULTS

function displayBuses(busData) {

    const busList = document.getElementById("bus-list");

    busList.innerHTML = `
        <div class="sort-box">
            <label for="sort-buses">Sort by price:</label>

            <select id="sort-buses">
                <option value="default">Recommended</option>
                <option value="low">Low to High</option>
                <option value="high">High to Low</option>
            </select>
        </div>

        <div id="bus-results"></div>
    `;

    const results = document.getElementById("bus-results");

    function renderCards(data) {

        results.innerHTML = "";

        data.forEach(bus => {

            const availableSeats =
                bus.seats - bus.bookedSeats.length;

            const card = document.createElement("div");

            card.className = "bus-card";

            card.innerHTML = `
                <h3>${bus.name}</h3>

                <p>🚌 ${bus.type}</p>
                <p>📍 ${bus.from} → ${bus.to}</p>
                <p>🕒 Departure: ${bus.time}</p>
                <p>💺 Available Seats: ${availableSeats}</p>

                <h3>₹${bus.price}</h3>

                <button class="select-bus-btn">
                    Select Bus
                </button>
            `;

            card.querySelector("button").addEventListener(
                "click",
                () => selectBus(bus.id)
            );

            results.appendChild(card);
        });
    }

    renderCards(busData);

    document.getElementById("sort-buses").addEventListener(
        "change",
        function () {

            let sorted = [...busData];

            if (this.value === "low") {
                sorted.sort((a, b) => a.price - b.price);
            }

            if (this.value === "high") {
                sorted.sort((a, b) => b.price - a.price);
            }

            renderCards(sorted);
        }
    );
}


// 6. SELECT BUS

function selectBus(busId) {

    currentBus = buses.find(bus => bus.id === busId);

    selectedSeats = [];

    const seatSection = document.getElementById("seat-section");
    const seatContainer = document.getElementById("seat-container");

    seatSection.style.display = "block";

    seatContainer.innerHTML = "";

    // Create seats dynamically

    for (let i = 1; i <= currentBus.seats; i++) {

        const seat = document.createElement("div");

        seat.className = "seat";
        seat.textContent = "S" + i;

        if (currentBus.bookedSeats.includes(i)) {

            seat.classList.add("booked");

        } else {

            seat.addEventListener("click", function () {
                toggleSeat(i, seat);
            });
        }

        seatContainer.appendChild(seat);
    }

    // Remove old passenger form and ticket

    const oldPassenger = document.getElementById("passenger-section");

    if (oldPassenger) {
        oldPassenger.remove();
    }

    updatePrice();

    seatSection.scrollIntoView({
        behavior: "smooth"
    });
}


// 7. SELECT OR UNSELECT SEATS

function toggleSeat(number, seatElement) {

    if (selectedSeats.includes(number)) {

        selectedSeats = selectedSeats.filter(
            seat => seat !== number
        );

        seatElement.classList.remove("selected");

    } else {

        // Maximum 6 seats

        if (selectedSeats.length >= 6) {
            alert("You can select maximum 6 seats.");
            return;
        }

        selectedSeats.push(number);

        seatElement.classList.add("selected");
    }

    updatePrice();
}


// 8. CALCULATE TOTAL PRICE

function updatePrice() {

    const total = currentBus
        ? selectedSeats.length * currentBus.price
        : 0;

    document.getElementById("selected-seats").textContent =
        "Selected Seats: " +
        (selectedSeats.length
            ? selectedSeats.join(", ")
            : "None");

    document.getElementById("total-price").textContent =
        "Total Price: ₹" + total;
}


// 9. PASSENGER DETAILS

function confirmBooking() {

    if (!currentBus || selectedSeats.length === 0) {

        alert("Please select a bus and at least one seat.");

        return;
    }

    let passengerSection =
        document.getElementById("passenger-section");

    if (passengerSection) {
        passengerSection.remove();
    }

    passengerSection = document.createElement("div");

    passengerSection.id = "passenger-section";
    passengerSection.className = "passenger-section";

    passengerSection.innerHTML = `
        <h2>Passenger Details</h2>

        <p>Enter test details for this demo booking.</p>

        <form id="passenger-form">

            <label>Passenger Name</label>
            <input type="text" id="passenger-name"
                placeholder="Enter test name" required
                maxlength="50">

            <label>Age</label>
            <input type="number" id="passenger-age"
                placeholder="Enter age"
                min="1" max="120" required>

            <label>Contact Number (test only)</label>
            <input type="tel" id="passenger-phone"
                placeholder="Enter dummy 10-digit number"
                pattern="[0-9]{10}" required>

            <button type="submit">Generate Demo Ticket</button>

        </form>
    `;

    document.getElementById("seat-section").appendChild(
        passengerSection
    );

    passengerSection.scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("passenger-form").addEventListener(
        "submit",
        generateTicket
    );
}


// 10. GENERATE DEMO TICKET

function generateTicket(event) {

    event.preventDefault();

    const name = document.getElementById("passenger-name").value.trim();
    const age = Number(document.getElementById("passenger-age").value);
    const phone = document.getElementById("passenger-phone").value;

    if (!name || age < 1 || age > 120 || !/^[0-9]{10}$/.test(phone)) {

        alert("Please enter valid test details.");
        return;
    }

    const total = selectedSeats.length * currentBus.price;

    const bookingId =
        "BG" + Date.now().toString().slice(-8);

    const ticket = document.createElement("div");

    ticket.id = "ticket-details";
    ticket.className = "ticket-details";

    const details = [
        ["Booking ID", bookingId],
        ["Passenger", name],
        ["Age", age],
        ["Route", currentBus.from + " → " + currentBus.to],
        ["Journey Date", journeyDate],
        ["Bus", currentBus.name],
        ["Departure", currentBus.time],
        ["Seats", selectedSeats.join(", ")],
        ["Total Amount", "₹" + total],
        ["Status", "Demo booking confirmed"]
    ];

    const heading = document.createElement("h2");
    heading.textContent = "BusGo E-Ticket";

    const notice = document.createElement("p");
    notice.textContent =
        "Demo ticket only. No actual reservation or payment.";

    ticket.append(heading, notice);

    details.forEach(([label, value]) => {

        const row = document.createElement("p");
        row.textContent = `${label}: ${value}`;

        ticket.appendChild(row);
    });

    const printButton = document.createElement("button");

    printButton.textContent = "Print Ticket";

    printButton.addEventListener("click", () => {
        window.print();
    });

    ticket.appendChild(printButton);

    const passengerSection =
        document.getElementById("passenger-section");

    passengerSection.replaceChildren(ticket);

    // Do not store passenger personal details.

    selectedSeats.forEach(seat => {
        if (!currentBus.bookedSeats.includes(seat)) {
            currentBus.bookedSeats.push(seat);
        }
    });

    selectedSeats = [];

    updatePrice();

    document.getElementById("seat-container")
        .querySelectorAll(".seat.selected")
        .forEach(seat => {
            seat.classList.remove("selected");
            seat.classList.add("booked");
            seat.replaceWith(seat.cloneNode(true));
        });

    alert("Demo ticket generated successfully!");
}
