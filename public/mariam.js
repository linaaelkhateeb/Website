document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultCard = document.getElementById('result');
    
    calculateBtn.addEventListener('click', function() {
      // Get input values
      const days = parseInt(document.getElementById('days').value) || 0;
      const travelers = parseInt(document.getElementById('travelers').value) || 0;
      const maxBudget = parseInt(document.getElementById('budget').value) || 0;
      
      // Calculate activity costs
      const activities = document.querySelectorAll('input[name="activities"]:checked');
      let dailyActivityCost = 0;
      activities.forEach(activity => {
        dailyActivityCost += parseInt(activity.value);
      });
      
      // Calculate totals
      const baseDailyCost = 50; // Base cost per person per day
      const totalDailyCost = baseDailyCost + dailyActivityCost;
      const totalCost = days * travelers * totalDailyCost;  
      const dailyRate = totalDailyCost * travelers;
      const budgetDifference = maxBudget - totalCost;
      
      // Update results
      document.getElementById('total-cost').textContent = `$${totalCost.toLocaleString()}`;
      document.getElementById('daily-rate').textContent = `$${dailyRate.toLocaleString()}`;
      
      // Set budget status
      const statusElement = document.getElementById('budget-status');
      if (budgetDifference >= (maxBudget * 0.3)) {
        statusElement.textContent = "Under Budget";
        statusElement.className = "status-badge status-good";
      } else if (budgetDifference >= 0) {
        statusElement.textContent = "On Track";
        statusElement.className = "status-badge status-warning";
      } else {
        statusElement.textContent = "Over Budget";
        statusElement.className = "status-badge status-danger";
      }
      
      // Show results with animation
      resultCard.style.display = 'block';
      setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  });
