document.addEventListener("DOMContentLoaded", function () {
    const reservationForm = document.getElementById("reservation-form");
  
    reservationForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual form submission
  
      const name = document.getElementById("name").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const people = document.getElementById("people").value;
  
      // Fun confirmation alert
      alert(`🎉 Reservation Confirmed! 🎉`);
  
      reservationForm.reset(); // Optional: clear the form after submission
    });
  });
  