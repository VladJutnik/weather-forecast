const  wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector('.info-txt'),
    inputField = inputPart.querySelector('#field'),
    btnSearch = inputPart.querySelector('#search'),
    wIcon = wrapper.querySelector(".weather-part img"),
    weather = wrapper.querySelector(".weather"),
    arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    //проверяем нажал ли человек интер и не пустое значение инпута
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
})
btnSearch.addEventListener("click", ()=>{
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else{
        alert("Ваш браузер не поддерживает поиск по локации! Попробуйте поискать по Вашему городу, в текстовом поле")
    }
})
function onSuccess(position){
    const {latitude, longitude} = position.coords
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchData(api);
}
function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}
const apiKey = '';//Сюда добавте ваш ключ api
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData(api);
}
function fetchData(api){
    infoTxt.innerText = "Идет обработка Вашего запроса"
    infoTxt.classList.add("pending");
    fetch(api).then(respons => respons.json()).then(result => weatherDetails(result));
}
function weatherDetails(info){
    infoTxt.classList.replace("pending","error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} - Вы ввели не коректные данные`;
    }else{
        const city = info.name,
            country = info.sys.country,
            {description, id} = info.weather[0],
            {feels_like, humidity, temp} = info.main;

        //смотрим id на сайте в документации что отправили какая погода 800 все чисто там много можно посмотреть
        //https://openweathermap.org/weather-conditions значение отсюда!!!!
        if (id == 800){
            wIcon.src = "icons/clear.svg"
            weather.innerText = 'Погода ясная! Идите смело гулять'
        }else if (id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg"
            weather.innerText = 'На улице сильная буря, будьте осторожны!'
        }else if (id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg"
            weather.innerText = 'На улице снег, будьте осторожны!'
        }else if (id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg"
            weather.innerText = 'На улице легкий туман'
        }else if (id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg"
            weather.innerText = 'На улице облачно'
        }else if ((id >= 300 && id <= 321)||(id >= 500 && id <= 531)){
            wIcon.src = "icons/rain.svg"
            weather.innerText = 'На улице идет дождь, не забудьте зонтик'
        }
        //Вставляем элементы в форму
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".detalis .numb").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
}
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    inputField.value = "";
});

