import React from "react";
import "./App.css";
import MainWeatherWindow from "./components/MainWeatherWindow";
import CityInput from "./components/CityInput";
import WeatherBox from "./components/WeatherBox";
import { cityNameToCode } from "./cityCodeMap";

class App extends React.Component {
  state = {
    city: undefined,

    // days contains objects with the following properties:
    // date, weather_desc, icon, temp
    days: new Array(5),
  };

  // creates the day objects and updates the state
  updateState = (data) => {
    const city = data.city.name;
    const days = [];
    const dayIndices = this.getDayIndices(data);

    for (let i = 0; i < 5; i++) {
      days.push({
        date: data.list[dayIndices[i]].dt_txt,
        weather_desc: data.list[dayIndices[i]].weather[0].description,
        icon: data.list[dayIndices[i]].weather[0].icon,
        temp: data.list[dayIndices[i]].main.temp,
      });
    }

    this.setState({
      city: city,
      days: days,
    });
  };

  // tries to make an API call with the given city name and triggers state update
  makeApiCall = async (city) => {
    if (!city) return false;
    // 转小写去空格
    const cityKey = city.toLowerCase().replace(/\s+/g, "");
    const cityCode = cityNameToCode[cityKey];
    if (!cityCode) return false;
    try {
      const resp = await fetch(
        `http://localhost:5000/weather?city=${cityCode}`
      );
      const data = await resp.json();
      if (
        data &&
        data.weather &&
        Array.isArray(data.weather) &&
        data.weather.length > 0
      ) {
        // 适配原有 updateState 结构
        const days = data.weather.slice(0, 5).map((day) => ({
          date: day.day,
          weather_desc: day.weather,
          icon: "01d", // 可根据weather映射图标
          temp: parseInt(day.temp), // 假设temp为"高温 10℃/低温 2℃"，可进一步解析
        }));
        this.setState({
          city: city.charAt(0).toUpperCase() + city.slice(1),
          days: days,
        });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // returns array with Indices of the next five days in the list
  // from the API data (every day at 12:00 pm)
  getDayIndices = (data) => {
    let dayIndices = [];
    dayIndices.push(0);

    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);

    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== "15"
      ) {
        index++;
      }
      dayIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    return dayIndices;
  };

  render() {
    const WeatherBoxes = () => {
      const weatherBoxes = this.state.days.slice(1).map((day) => (
        <li>
          <WeatherBox {...day} />
        </li>
      ));

      return <ul className="weather-box-list">{weatherBoxes}</ul>;
    };

    return (
      <div className="App">
        <header className="App-header">
          <MainWeatherWindow data={this.state.days[0]} city={this.state.city}>
            <CityInput
              city={this.state.city}
              makeApiCall={this.makeApiCall.bind(this)}
            />
            <WeatherBoxes />
          </MainWeatherWindow>
        </header>
      </div>
    );
  }
}

export default App;
