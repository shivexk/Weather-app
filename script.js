const API_KEY = "PUT YOUR API KEY";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const city = document.getElementById("city");
const date = document.getElementById("date");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const weatherIcon = document.getElementById("weatherIcon");

const loader = document.getElementById("loader");
const error = document.getElementById("error");

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

function showError(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");

    setTimeout(() => {
        error.classList.add("hidden");
    }, 3000);
}

function formatTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function updateDate() {

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    date.textContent =
        new Date().toLocaleDateString(undefined, options);

}

function changeBackground(weather) {

    weather = weather.toLowerCase();

    if (weather.includes("clear")) {

        document.body.style.background =
            "linear-gradient(135deg,#56CCF2,#2F80ED)";

    }

    else if (weather.includes("cloud")) {

        document.body.style.background =
            "linear-gradient(135deg,#757F9A,#D7DDE8)";

    }

    else if (weather.includes("rain")) {

        document.body.style.background =
            "linear-gradient(135deg,#314755,#26a0da)";

    }

    else if (weather.includes("snow")) {

        document.body.style.background =
            "linear-gradient(135deg,#E6DADA,#274046)";

    }

    else {

        document.body.style.background =
            "linear-gradient(-45deg,#4facfe,#00f2fe,#667eea,#764ba2)";
    }

}

// -----------------------------

async function getWeather(cityName) {

    showLoader();

    try {

        const response = await fetch(

            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
            
        );

        if (!response.ok) {

            throw new Error("City not found");

        }

        const data = await response.json();

        displayWeather(data);

    }

    catch (err) {

        showError(err.message);

    }

    hideLoader();

}

// -----------------------------

async function getWeatherByCoords(lat, lon) {

    showLoader();

    try {

        const response = await fetch(

            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

        );

        const data = await response.json();

        displayWeather(data);

    }

    catch {

        showError("Unable to fetch weather.");

    }

    hideLoader();

}

// -----------------------------

function displayWeather(data) {

    city.textContent = `${data.name}, ${data.sys.country}`;

    temperature.textContent = Math.round(data.main.temp);

    description.textContent = data.weather[0].description;

    humidity.textContent = data.main.humidity + "%";

    wind.textContent =
        (data.wind.speed * 3.6).toFixed(1) + " km/h";

    feelsLike.textContent =
        Math.round(data.main.feels_like) + "°";

    sunrise.textContent =
        formatTime(data.sys.sunrise);

    sunset.textContent =
        formatTime(data.sys.sunset);

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    updateDate();

    changeBackground(data.weather[0].main);

}

// -----------------------------

searchBtn.addEventListener("click", () => {

    const cityName = cityInput.value.trim();

    if (cityName === "") {

        showError("Enter a city name.");

        return;
    }

    getWeather(cityName);

});

// -----------------------------

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});

// -----------------------------

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        showError("Geolocation not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        position => {

            getWeatherByCoords(

                position.coords.latitude,

                position.coords.longitude

            );

        },

        () => {

            showError("Location permission denied.");

        }

    );

});


// -----------------------------

// Default city on startup
getWeather("New Delhi");