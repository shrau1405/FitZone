document.addEventListener('DOMContentLoaded', function () {
  const dietSelector = document.getElementById('dietSelector');
  const dietTableContainer = document.getElementById('dietTableContainer');

  const dietPlans = {
    weight: [
      ["Day", "Breakfast", "Lunch", "Dinner"],
      ["Monday", "Oats with banana", "Grilled chicken salad", "Vegetable soup"],
      ["Tuesday", "Smoothie + eggs", "Brown rice + veggies", "Tofu stir-fry"],
      ["Wednesday", "Fruit + almonds", "Quinoa bowl", "Lentil soup"],
      ["Thursday", "Greek yogurt", "Grilled fish + greens", "Chickpea curry"],
      ["Friday", "Scrambled eggs", "Salad + sweet potato", "Moong dal + roti"],
      ["Saturday", "Protein shake", "Egg wrap", "Veg curry + rice"],
      ["Sunday", "Avocado toast", "Paneer salad", "Veg soup + toast"]
    ],
    shred: [
      ["Day", "Breakfast", "Lunch", "Dinner"],
      ["Monday", "Oats with whey", "Chicken + broccoli", "Egg white omelette"],
      ["Tuesday", "Boiled eggs + apple", "Tuna salad", "Grilled tofu"],
      ["Wednesday", "Green smoothie", "Egg wrap", "Chicken stew"],
      ["Thursday", "Almonds + banana", "Grilled paneer + greens", "Fish curry"],
      ["Friday", "Whey + toast", "Brown rice + salad", "Veg stir fry"],
      ["Saturday", "Low carb wrap", "Eggs + veggies", "Lentil soup"],
      ["Sunday", "Smoothie bowl", "Soya chunks", "Chicken salad"]
    ],
    maintain: [
      ["Day", "Breakfast", "Lunch", "Dinner"],
      ["Monday", "Oats + fruits", "Chapati + veg", "Paneer curry + rice"],
      ["Tuesday", "Idli + chutney", "Veg biryani", "Chicken soup"],
      ["Wednesday", "Cornflakes + milk", "Egg curry + rice", "Tofu bhurji"],
      ["Thursday", "Poha + tea", "Khichdi + curd", "Mixed veg curry"],
      ["Friday", "Paratha + curd", "Pasta + salad", "Daal + chapati"],
      ["Saturday", "Dosa + sambhar", "Rice + rajma", "Fish curry"],
      ["Sunday", "Upma + chutney", "Veg wrap", "Paneer butter masala"]
    ],
    bulk: [
      ["Day", "Breakfast", "Lunch", "Dinner"],
      ["Monday", "Oats + peanut butter", "Chicken curry + rice", "Paneer + chapati"],
      ["Tuesday", "Milkshake + eggs", "Rajma chawal", "Chicken biryani"],
      ["Wednesday", "Smoothie + toast", "Paneer bhurji + paratha", "Tofu + rice"],
      ["Thursday", "Paratha + butter", "Fish curry + rice", "Chicken stew"],
      ["Friday", "Poha + nuts", "Chole + bhature", "Egg curry + rice"],
      ["Saturday", "Dosa + whey", "Mutton curry + rice", "Kadhi + paratha"],
      ["Sunday", "Bread + jam + eggs", "Biryani + curd", "Paneer tikka + roti"]
    ]
  };

  function loadTable(plan) {
    const data = dietPlans[plan];
    if (!data) return;

    let html = "<table><thead><tr>";
    data[0].forEach(header => {
      html += `<th>${header}</th>`;
    });
    html += "</tr></thead><tbody>";

    for (let i = 1; i < data.length; i++) {
      html += "<tr>";
      data[i].forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += "</tr>";
    }

    html += "</tbody></table>";
    dietTableContainer.innerHTML = html;
  }

  dietSelector.addEventListener("change", function () {
    loadTable(this.value);
  });

  loadTable("weight"); // default
});
