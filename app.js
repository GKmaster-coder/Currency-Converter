const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns from countryList
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update the currency flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; // Fetch country code from countryList
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Function to update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const fromCode = fromCurr.value.toUpperCase();
  const toCode = toCurr.value.toUpperCase();
  const URL = `${BASE_URL}/${fromCode}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }
    let data = await response.json();

    if (!data.rates[toCode]) {
      throw new Error("Invalid response from API");
    }

    let rate = data.rates[toCode];
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate!";
    console.error("Exchange Rate Fetch Error:", error);
  }
};

// Load exchange rate on page load
window.addEventListener("load", updateExchangeRate);

// Button click event
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

