const userInput = document.getElementById('location')
const submitUserInputButton = document.getElementById('button-submit-location')
const weatherDataContainer = document.querySelector('.weather-data-container')
const locationContainer = document.getElementById('location-container')
const dateContainer = document.getElementById('date-container')
const temperatureContainer = document.getElementById('temperature')
const tempCelsius = temperatureContainer.querySelector('.temp-c')
const tempFahrenheit = temperatureContainer.querySelector('.temp-f')
const weatherCondition = document.getElementById('weather-condition')
const weatherConditionIcon = document.getElementById('weather-condition-icon')
const feelslikeContainer = document.getElementById('feelslike-container')
const feelsLikeC = document.getElementById('weather-feelslike-c')
const feelsLikeF = document.getElementById('weather-feelslike-f')

submitUserInputButton.addEventListener('click', submitUserInput)
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        submitUserInputButton.click()
        setTimeout(() => {
            weatherDataContainer.focus()
        }, 200);
    }
} )

temperatureContainer.addEventListener('click', toggleTemperatureUnit)



async function loadJson(url) {
   try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`)
        }
        const data = await response.json()
        return data
   } catch (error) {
        throw new Error(`Failed to load JSON from ${url}: ${error.message}`)
   }
}

async function getWeatherDatafromLocation(location) {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=4fddb7ae68d449ab9d2120517241302&q=${encodeURIComponent(location)}`
        const data = await loadJson(url)
        return data
    } catch (error) {
        console.error('Failed to fetch weather data:', error)
    }
}

async function submitUserInput() {
    const inputValue = await sanitizeUserInput(userInput.value)
    const locationData = await getWeatherDatafromLocation(inputValue)
    console.log(locationData)
    populateWeatherContainer(locationData)
    weatherDataContainer.classList.remove('visibility-hidden')
    weatherDataContainer.classList.add('fadeInSlideDown')
    userInput.value = ''
}

function sanitizeUserInput(userInput) {
    return escapeHTML(userInput.trim())
}

function escapeHTML(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

function populateWeatherContainer(locationData) {
    const city = locationData.location.name
    const country = locationData.location.country
    const localTime = locationData.location.localtime
    const tempC = locationData.current.temp_c
    const tempF = locationData.current.temp_f
    const condition = locationData.current.condition.text
    const conditionIcon = locationData.current.condition.icon

    locationContainer.textContent = `${city}, ${country}`
    dateContainer.textContent = `${formatDate(localTime).month} ${formatDate(localTime).day}, ${formatDate(localTime).time}`
    tempCelsius.textContent = tempC
    tempFahrenheit.textContent = tempF
    weatherCondition.textContent = condition
    weatherConditionIcon.src = conditionIcon
    feelsLikeC.textContent = 'feels like ' + locationData.current.feelslike_c
    feelsLikeF.textContent = 'feels like ' + locationData.current.feelslike_f
}

function formatDate(dateData) {
    const dateAndTime = dateData.split(' ')
    const yearMonthDay = dateAndTime[0].split('-')
    const monthsAsStrings = [
        'January',
        'February',
        'March',
        'April', 
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    console.log(monthsAsStrings, yearMonthDay)

    return {
        year: yearMonthDay[0],
        month: monthsAsStrings[Number(yearMonthDay[1])],
        day: yearMonthDay[2],
        time: dateAndTime[1]
    }
}

function toggleTemperatureUnit() {
    temperatureContainer.classList.toggle('celsius')
    temperatureContainer.classList.toggle('fahrenheit')
    feelslikeContainer.classList.toggle('celsius')
    feelslikeContainer.classList.toggle('fahrenheit')
}