const defaultURL = "https://api.openweathermap.org/data/2.5/forecast?lat=59.334591&lon=18.063240&appid=15a1790288c26c9ab80c3b6f2209e071" // Stockholm

const nycURL = "https://api.openweathermap.org/data/2.5/forecast?lat=40.71427&lon=-74.00597&appid=15a1790288c26c9ab80c3b6f2209e071" // NYC

const hkURL = "https://api.openweathermap.org/data/2.5/forecast?lat=22.28552&lon=114.15769&appid=15a1790288c26c9ab80c3b6f2209e071" // Hong Kong

let fetchedData = []
let cityName = document.getElementById("cityName")
let weatherMain = document.getElementById("weatherMain")
let weatherDesc = document.getElementById("weatherDesc")
let sunrise = document.getElementById("sunrise")
let mainTemp = document.getElementById("mainTemp")
let weatherIcon = document.getElementById("weatherIcon")
let searchButton = document.getElementById("inputBtn")
let nextCity = document.getElementById("nextCity")

const fetchData = async (url) => {
  try {
    const response = await fetch(url)
    console.log(url)

    if (!response.ok) {
      throw new Error(`Status ${response.status}`)
    }

    const data = await response.json()

    fetchedData = data
    console.log(fetchedData)

    updateCity()
  } catch (error) {
    alert("There was an error, please try again later: " + error)
    console.error("Error fetching data:", error)
  }
}

const timeConversion = () => {
  const timestamps = {
    sunrise: fetchedData.city.sunrise,
    sunset: fetchedData.city.sunset
  }

  Object.entries(timestamps).forEach(([key, value]) => {
    const date = new Date(value * 1000)

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    console.log(`${key}: ${hours}:${minutes}:${seconds}`)

    // Update the respective HTML elements
    document.getElementById(key).innerHTML = `${hours}:${minutes}`
  })
}

const updateCity = () => {
  if (fetchedData.city && fetchedData.city.name) {
    cityName.innerHTML = fetchedData.city.name

    weatherDesc.innerHTML = fetchedData.list[0].weather[0].description

    updateWeather()
    timeConversion()
    updateMainTemp()

  } else {
    console.error("City data is missing in fetchedData", fetchedData)
  }
}

const updateWeather = () => {
  document.body.className = ''
  if (fetchedData.list[0].weather[0].main === "Clear") {
    document.body.classList.add("clear")
    weatherMain.innerHTML = `Get your sunnies on. ${fetchedData.city.name} is looking rather great today.`
    weatherIcon.innerHTML = `<img
          src="./img/clear.svg"
          alt="Sunglasses for clear weather"
          class="weatherIcon weatherIconClear"
        >`
  } else if (fetchedData.list[0].weather[0].main === "Clouds") {
    document.body.classList.add("cloud")
    weatherMain.innerHTML = `Light a fire and get cosy. ${fetchedData.city.name} is looking grey today.`
    weatherIcon.innerHTML = `<i class="fa-solid fa-cloud weatherIcon weatherIconCloud"></i>`
  } else if (fetchedData.list[0].weather[0].main === "Rain") {
    document.body.classList.add("rain")
    weatherMain.innerHTML = `Don't forget your umbrella. It's wet in ${fetchedData.city.name} today.`
    weatherIcon.innerHTML = `<img
          src="./img/rain.svg"
          alt="An umbrella for rainy weather"
          class="weatherIcon weatherIconRain"
        >`
  } else {
    document.body.classList.add("default")
  }
}

const updateMainTemp = () => {
  if (fetchedData.list[0].main.temp) {
    const tempInCelsius = fetchedData.list[0].main.temp - 273.15
    mainTemp.innerHTML = tempInCelsius.toFixed(0) + "°C"
  } else {
    console.error("Main temperature is missing in fetchedData", fetchedData)
  }
}

const searchCity = () => {
  let input = document.getElementById("searchInput").value
  if (input.trim() === "") {
    alert("Please enter a city name")
    return
  }
  let searchURL = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=15a1790288c26c9ab80c3b6f2209e071`
  fetchData(searchURL)
}

searchButton.addEventListener("click", searchCity)

const nextCityClick = () => {
  if (fetchedData.city.name === "Stockholm") {
    fetchData(nycURL)
  } else if (fetchedData.city.name === "New York") {
    fetchData(hkURL)
  } else {
    fetchData(defaultURL)
  }
}

nextCity.addEventListener("click", nextCityClick)

fetchData(defaultURL)