// all the html element

let current_weather_block = document.querySelector('#current-weather')
let city_input = document.getElementById('city-input')
const auto_detect_btn = document.getElementById('auto-detect')
const clock = document.querySelector('#clock')
const preferences_btn = document.querySelector('#preferences-btn')
const pref_modal = document.querySelector('#pref-modal')
const forecast_wrapper = document.querySelector('#forecast-wrapper')
const forecast_frame = document.querySelector('.h-forecast-frame')
const suggestion_list = document.querySelector('#suggestion-list')

var meters = ['temp_c', 'precip_mm', 'clock_24h']



const key = 'c46b36b568af466badb103220242201'
const base_api_url = 'http://api.weatherapi.com/v1'

let intervalId = null

var call_api = (api, query, days, k=key, base_url=base_api_url)=> {
    let api_url = `${base_url}/${api}.json?key=${k}&q=${query}`
    if (days) {
        api_url = `${base_url}/${api}.json?key=${k}&q=${query}&days=${days}`    
    }
    try {
        return fetch(api_url)
    } catch (error) {
        console.log(error)
    }
}
var updateClock = (offset, clock_mode)=> {
    
    const utc = [(new Date()).getUTCHours(), (new Date()).getUTCMinutes()]
    let h = (utc[0]+offset+24)%24
    let m = String(utc[1]).padStart(2, '0')
    let period = 'am'
    if (h>11) period = 'pm'; else period = 'am';
    if (clock_mode=='clock_12h') {
        if(h>12) h=h%12
    }
    
    clock.textContent = `${String(h).padStart(2, '0')} : ${m}${period}`
    
}
// set the elements of "current weather" div
var setCurrentWeather = (temp, w_descrp, humidity, precip, wind, feelslike, city_name, w_icon, will_it_rain, will_it_snow)=> {
    current_weather_block.querySelector('#city-name').textContent = city_name
    current_weather_block.querySelector('#w_descrp').textContent = w_descrp
    current_weather_block.querySelector('#humidity-val').textContent = humidity
    current_weather_block.querySelector('#wind-speed-val').textContent = wind
    current_weather_block.querySelector('#precipitation-val').textContent = precip
    current_weather_block.querySelector('#temp-val').textContent = temp
    current_weather_block.querySelector('#feels-like-val').textContent = feelslike
    current_weather_block.querySelector('#day-temp').style.backgroundImage= `url(${w_icon})`
    
    if (will_it_rain===1) {
        current_weather_block.querySelector('#will-it-rain').classList.add('will-true')
        current_weather_block.querySelector('#will-it-rain i').classList.remove('bi-umbrella')
        current_weather_block.querySelector('#will-it-rain i').classList.add('bi-umbrella-fill')
        
    } else if (current_weather_block.querySelector('#will-it-rain').classList.contains('will-true')) {
        current_weather_block.querySelector('#will-it-rain').classList.remove('will-true')
        current_weather_block.querySelector('#will-it-rain i').classList.add('bi-umbrella')
        current_weather_block.querySelector('#will-it-rain i').classList.remove('bi-umbrella-fill')
        
    }
    if (will_it_snow===1) {
        current_weather_block.querySelector('#will-it-snow').classList.add('will-true')
        current_weather_block.querySelector('#will-it-snow i').style = 'font-weight: bolder;'
        
    } else if (current_weather_block.querySelector('#will-it-snow').classList.contains('will-true')) {
        current_weather_block.querySelector('#will-it-snow').classList.remove('will-true')
        
    }
    
}
async function getFiles(directoryHandle) {
    const files = [];
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'file') {
        files.push(name);
      } else if (handle.kind === 'directory') {
        const nestedFiles = await getFiles(handle);
        files.push(...nestedFiles.map(nestedName => `${name}/${nestedName}`));
      }
    }
    return files;
}
var findKeyInDict = (dict, val)=> {
    for(var key in dict) {
        for (const k of dict[key]) {
            if ( k== val) {
                return key
            }
        }
    }
}
var changeBg = (w_code, is_day)=> {
    const bg_w_codes = {
        clear: [1000],
        clouds: [1003, 1006],
        mist: [1030, 1135, 1147],
        overcast: [1009],
        rain: [1150,1153,1168,1171,1180,1183,1186,1189,1192,1195,1198,1201,1240,1243,1246,1063,1072],
        snow: [1114,1117,1204,1207,1210,1213,1216,1219,1222,1225,1249,1252,1255,1258,1282,1279,1066,1069],
        thunder: [1273, 1276, 1087],
        ice_pelletes: [1237, 1261, 1264]
    }
    // find folder from weather code
    const folder_name = findKeyInDict(bg_w_codes, w_code)
    fetch('script/img_list.json')
    .then(response => response.json())
    .then(data => {
        const bg_folder = data[`${is_day?"day":"night"}`][`${folder_name}`]
        var file_name = bg_folder[Math.floor(Math.random()*bg_folder.length)];
        document.querySelector('body').style.background = `url(style/assets/img/${is_day?"day":"night"}/${folder_name}/${file_name}) no-repeat`
        document.querySelector('body').style.backgroundSize = 'cover'
        document.querySelector('body').style.backgroundPosition = 'center center'

    })
    

}

var createHForcastFrame = (hour,w_icon,h_temp)=> {
    
    
    let h_forecast_frame = document.createElement('div')
    h_forecast_frame.classList.add('col', 'h-forecast-frame')
    h_forecast_frame.classList.add('flex-nowrap')

    let div1 = document.createElement('div')
    div1.classList.add('row')
    let helem = document.createElement('div')
    helem.classList.add('col', 'glass-text')
    helem.id = 'hour'
    helem.textContent = hour
    div1.appendChild(helem)
    h_forecast_frame.appendChild(div1)

    let div2 = document.createElement('div')
    div2.classList.add('row', 'gap-0')
    let icon = document.createElement('div')
    icon.classList.add('col')
    icon.id = 'w-icon'
    icon.style.backgroundImage = `url(${w_icon})`
    div2.appendChild(icon)
    h_forecast_frame.appendChild(div2)
    
    let div3 = document.createElement('div')
    div3.classList.add('row')
    let temp = document.createElement('div')
    temp.classList.add('col', 'glass-text')
    temp.id = 'h-temp-val'
    temp.textContent = h_temp
    div3.appendChild(temp)
    h_forecast_frame.appendChild(div3)
    
    forecast_wrapper.append(h_forecast_frame)
    
}

var getWeather = (data, meters)=> {
    // variables
    let city_time = (new Date(data.location.localtime))
    let current_time = [city_time.getHours(), city_time.getMinutes()]
    console.log(data);
    let temp = (meters[0]=='temp_c') ? [data.current.temp_c, data.current.feelslike_c] : [data.current.temp_f, data.current.feelslike_f]
    
    let precip = (meters[1]=='precip_mm') ? data.current.precip_mm : data.current.precip_in
    let clock_mode = meters[2]
    // change bg
    changeBg(data.current.condition.code, data.current.is_day)
    
    //theme mode
    if (!data.current.is_day) {
        document.querySelector('nav').classList.add('night-mode')
        document.querySelector('#pref-modal').classList.add('night-mode')
        document.querySelector('main').classList.add('night-mode')
        document.querySelector('footer').classList.add('night-mode')
    } else if(document.querySelector('nav').classList.contains('night-mode')){
        document.querySelector('nav').classList.remove('night-mode')
        document.querySelector('#pref-modal').classList.remove('night-mode')
        document.querySelector('main').classList.remove('night-mode')
        document.querySelector('footer').classList.remove('night-mode')
    }

    // switching logo
    let logo = document.querySelector('nav .navbar-brand img')
    if (document.querySelector('nav').classList.contains('night-mode')) {
        logo.src = 'style/assets/img/night/icons8-moon-and-stars-48.png'
    } else {
        logo.src = 'style/assets/img/day/icons8-sun-48.png'
    }

    // clock 
    if (intervalId!=null) {
        clearInterval(intervalId)
    }
    const offset = current_time[0]-(new Date()).getUTCHours()
    const updateClockWithOffset = () => updateClock(offset, clock_mode);

    updateClock(offset, clock_mode)
    
    intervalId = setInterval(updateClockWithOffset,  1000)
    
    // current weather
    
    
    setCurrentWeather(temp[0], data.current.condition.text, data.current.humidity, precip, data.current.wind_kph, temp[1], `${data.location.name}, ${data.location.country}`, data.current.condition.icon, data.forecast.forecastday[0].day.daily_will_it_rain, data.forecast.forecastday[0].day.daily_will_it_snow)
    
    // hourly forecast 
    forecast_wrapper.innerHTML= ''
    let next_hour = current_time[0] +1
    
    for (let i = 0; i < 24; i++) {
        let w_info = data.forecast.forecastday[0].hour[next_hour]
        
        if (next_hour>=24) {
            next_hour = 0
            w_info = data.forecast.forecastday[1].hour[next_hour]
        }
        let temp = (meters[0]=='temp_c') ? w_info.temp_c : w_info.temp_f    
        let period = 'am'
        if (next_hour>11) period = 'pm'; else period = 'am';
        if (meters[2]=='clock_12h') {
            if(next_hour>12) next_hour=next_hour%12
        }
        (i==0) ? createHForcastFrame('Next', w_info.condition.icon, temp) : createHForcastFrame(`${next_hour}${period}`, w_info.condition.icon , temp)
        
        next_hour+=1
        
        
    }
    
}
var detectLocation = ()=> {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=> {
            call_api(api= 'forecast', query= `${position.coords.latitude}, ${position.coords.longitude}`, days= 2)
            .then(response=>response.json())
            .then(data=> {
                // handle apply preference
                document.querySelector('#apply-pref').onclick = ()=>{
                    for (let i = 0; i < pref_modal.querySelectorAll('.selected').length; i++) {
                        meters[i] = pref_modal.querySelectorAll('.selected')[i].getAttribute('value');    
                    }
                    getWeather(data, meters)
                }
                
                getWeather(data, meters)
                //setCurrentWeather(data.current.temp_c,data.current.condition.text, data.current.humidity, data.current.precip_mm, data.current.wind_kph, data.current.feelslike_c, `${data.location.name}, ${data.location.country}`)
                city_input.value = ''
            })
        })
    } else {
        alert('Error occurs when we try to get your location !')
    }
    
}


// handle events

city_input.oninput = (e)=>  {
    call_api(api= 'search', query= city_input.value)
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        suggestion_list.innerHTML = ''
        data.forEach(elem => {
            
            let option = document.createElement('option')
            option.value = `${elem.name}, ${elem.region},${elem.country}`
            if (!suggestion_list.contains(option)) {
                suggestion_list.append(option)
            }
        });
    })
}

city_input.onchange = ()=> {
    var query_city = city_input.value
    
    console.log(query_city)
    
    call_api(api= 'forecast', query= query_city, days= 2)
    .then(response=>response.json())
    .then(data=> {
        console.log(data)
        // handle apply preference
        document.querySelector('#apply-pref').onclick = ()=>{
            for (let i = 0; i < pref_modal.querySelectorAll('.selected').length; i++) {
                meters[i] = pref_modal.querySelectorAll('.selected')[i].getAttribute('value');    
            }
            getWeather(data, meters)
        }
        console.log() 
        getWeather(data, meters)
        city_input.value = ''
        suggestion_list.innerHTML = ''
    })
}

auto_detect_btn.addEventListener('click', detectLocation)



// initialization
detectLocation()
