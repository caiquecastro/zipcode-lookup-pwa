if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

const zipcodeForm = document.querySelector("#zipcode-form");
const zipcodeStreet = document.querySelector("#zipcode-street");
const zipcodeNeighborhood = document.querySelector("#zipcode-neighborhood");
const zipcodeCity = document.querySelector("#zipcode-city");
const zipcodeState = document.querySelector("#zipcode-state");

zipcodeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(zipcodeForm);

    const zipcode = formData.get("zipcode");
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);

    const addressData = await response.json();

    zipcodeStreet.textContent = addressData.street;
    zipcodeNeighborhood.textContent = addressData.neighborhood;
    zipcodeCity.textContent = addressData.city;
    zipcodeState.textContent = addressData.state;
});
