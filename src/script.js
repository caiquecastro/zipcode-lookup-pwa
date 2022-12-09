if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceworker.js")
        .then((reg) => {
            console.log({ reg });
        })
        .catch((error) => {
            console.error(error);
        });
}

const ZIPCODE_REGEX = /[0-9]{5}\-?[0-9]{3}/;

const zipcodeForm = document.querySelector("#zipcode-form");
const zipcodeInput = document.querySelector("#zipcode");
const zipcodeStreet = document.querySelector("#zipcode-street");
const zipcodeNeighborhood = document.querySelector("#zipcode-neighborhood");
const zipcodeCity = document.querySelector("#zipcode-city");
const zipcodeState = document.querySelector("#zipcode-state");
const searchMessage = document.querySelector("#search-message");
const searchResult = document.querySelector("#search-result");

const validateZipcode = (zipcode) => {
    const cleanZipcode = zipcode.trim();
    zipcodeInput.value = cleanZipcode;

    if (!cleanZipcode.length) {
        throw new Error("Fill zipcode input");
    }

    if (!ZIPCODE_REGEX.test(cleanZipcode)) {
        throw new Error("Fill valid zipcode");
    }

    return cleanZipcode.replace("-", "");
};

const fillAddress = (data) => {
    zipcodeStreet.textContent = data.street;
    zipcodeNeighborhood.textContent = data.neighborhood;
    zipcodeCity.textContent = data.city;
    zipcodeState.textContent = data.state;
}

zipcodeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(zipcodeForm);

    const zipcode = formData.get("zipcode");
    searchResult.style.display = "none";

    try {
        const validZipcode = validateZipcode(zipcode);

        searchMessage.textContent = "Loading...";
        fillAddress({});

        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${validZipcode}`);

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message);
        }

        fillAddress(responseData);
        searchResult.style.display = "block";
        searchMessage.textContent = "";
    } catch (error) {
        searchMessage.textContent = error.message;
    }
});
