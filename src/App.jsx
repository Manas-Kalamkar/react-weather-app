import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';

import Header from './component/Header';
import Home from './component/Home';
import Cards from './component/Cards';
import About from './component/About';
import Contact from './component/Contact';

import Aqi from "./component/Aqi";
import Temp from "./component/Temp";
import Rain from "./component/Rain";
import Wind from "./component/Wind";
import './App.css'

const API_KEY= import.meta.env.VITE_CITY_API_KEY;

function App() {
  const [learnMoreOption,setLearnMoreOption]= useState(false);
  console.log("learnMoreOptions after creating learnMore: ",learnMoreOption);
  const [weatherData,setWeatherData] = useState(()=>{
    try {
    const saved = localStorage.getItem('weatherData');
    return saved ? JSON.parse(saved) : {};
    
  } catch (error) {
    console.error("Failed to parse weatherData from localStorage:", error);
    localStorage.removeItem('weatherData'); 
    setLearnMoreOption(false)
    return {};
  }})
  const [searchTerm,setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  const cardsRef = useRef(null);



  const main = async (city)=>{
    setErrorMessage('');
    setIsLoading(true);
    
    const cityName = city.trim();
    console.log(cityName)
    if(!cityName){
      console.log("Please enter the city");
      setIsLoading(false)
      return
    }
    const coord = await fetchCoordinates(cityName);
    const data = await fetchWeatherAndApi(coord);

    if(data){
      setWeatherData({coord,data});
      setIsLoading(false)

    }
  }

  const fetchCoordinates = async (city)=>{

    if(city.length== 0){
      return;
    }

    try{
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    const data = await response.json();
    
    if (data.length === 0) {
  setIsLoading(false);
  setErrorMessage('City not found.');
  return;
}
    return({
      lat:data[0].lat,
      lon:data[0].lon,
      name:data[0].name,
      state:data[0].state,
      country:data[0].country,
    })

    }catch(error){
      console.log("Error while fetching city coordinates ",error)
    }
  }

  const fetchWeatherAndApi = async (coord) => {
    
    const url1 = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&hourly=temperature_2m,rain,apparent_temperature,precipitation,precipitation_probability,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max&current_weather=true&timezone=auto`;
    const url2 = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coord.lat}&longitude=${coord.lon}&hourly=pm10,pm2_5`;
    
    try {

      const [res1,res2] = await Promise.all([fetch(url1),fetch(url2)])

      if(!res1.ok || !res2.ok){
        throw new Error(`HTTP error! Status: ${res1.status || res2.status}`)
      }
      
      const forCast = await res1.json();
      const aqi =  await res2.json();

      console.log(forCast,aqi)

      return ({
        forCast,aqi}
      )
      
    } catch (error) {
      console.log("Error while fetching the weather: ",error)
    }
  }

  useEffect(()=>{
    main(searchTerm);},
    [searchTerm])
  
    useEffect(()=>{
      if(Object.keys(weatherData).length>0){
        localStorage.setItem('weatherData',JSON.stringify(weatherData));
        cardsRef.current?.scrollIntoView({behavior:'smooth'});
        setLearnMoreOption(true)
      }
    },[weatherData])


  const router=createBrowserRouter([
    {path:"/",element:<>
    <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} isLoading={isLoading} errorMessage={errorMessage} setIsLoading={setIsLoading} setErrorMessage ={setErrorMessage} />
    <Home />
    <Cards weatherData={weatherData} learnMoreOption={learnMoreOption} ref={cardsRef} />
    <About />
    <Contact />

    </>},
    {path:"/temp",element:<><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><Temp weatherData={weatherData} /></>},
    {path:"/wind",element:<><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><Wind weatherData={weatherData} /></>},
    {path:"/rain",element:<><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><Rain weatherData={weatherData} /></>},
    {path:"/aqi",element:<><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><Aqi weatherData={weatherData} /></>},
    {path:"/cards",element:<><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><Cards weatherData={weatherData} learnMoreOption={learnMoreOption}/></>},
    {path:"/about",element:<><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><About /></>},
    {path:"/contact",element:<><Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><Contact /></>},
  ],{
    basename: "/project_5_weather_react_app",
  })

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
