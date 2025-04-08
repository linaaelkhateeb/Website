document.getElementById("hotel-reservation-form").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("🎉 Your hotel reservation has been confirmed! ");
    this.reset(); 
});
