let ip,
    country_code,
    city,
    time_zone,
    time,
    day_of_week,
    day_of_year,
    week_number,
    abbreviation,
    currentDate,
    quotes;


document.addEventListener("DOMContentLoaded", () => {
    //gets all information from servers
    loadData();

    //sets current time
    setInterval(setTime, 1000);

    //displays and hides additional information
    let showMoreBtn = document.getElementById('showMore');
    showMoreBtn.addEventListener('click', showMore);

    //gets quotes from server
    getQuotes();

    //on click user will get another random quote
    let refreshBtn = document.getElementById("refresh-quote");
    refreshBtn.addEventListener('click', displayRandomQuote);
});

//Gets users data (IP, address, time zone, date, time...) from two different APIs
//one for date and time and second one for other information
function loadData() {
      let promise = new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "https://freegeoip.app/json/");
      xhr.onload = () => {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        } else {
          reject("rejected");
        }
      };
      xhr.onerror = (err) => reject("Failed!");
      xhr.send();
    });

    promise.then((data) => {
      let userData = JSON.parse(data);
      ip = userData.ip;
      city = userData.city;
      country_code = userData.country_code;
      time_zone = userData.time_zone;
      
    })
    .then(() => {
        let displayCity = document.getElementById("city");
        displayCity.innerHTML = `In ${city}, ${country_code}`;
    })
    .then(() => {
        let getTime = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `http://worldtimeapi.org/api/ip/${ip}`);
        xhr.onload = () => {
        if (xhr.status == 200) {
            resolve(xhr.responseText);
        } else {
            reject("Error in fetching data!");
        }
        };
        xhr.onerror = "Error!";
        xhr.send();
    });

    getTime.then(data => {
        let response = JSON.parse(data);
        day_of_week = response.day_of_week;
        day_of_year = response.day_of_year;
        week_number = response.week_number;
        abbreviation = response.abbreviation;
    }).then(setDetails)     
    })
    .catch(err => alert('Error in getting data! Try reloading.'));
}



function setTime(){
    let displayTime = document.querySelector(".time");
    let icon = document.getElementById("icon");
    let greeting = document.querySelector(".greeting");
    
    let container = document.querySelector(".container");

    currentDate = new Date();
    time = currentDate.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false})
    .replace('AM', '').replace('PM', '');

    //sets greeting and background based on time of the day
    let hour = currentDate.getHours();
    
    if(hour >= 5 && hour < 12){
        greeting.innerText = `GOOD MORNING`;
        icon.setAttribute('src', 'assets/desktop/icon-sun.svg');
        container.classList.add('dayTime');
        container.classList.remove('nightTime');
    } else if (hour >= 12 && hour < 18){
        greeting.innerText = `GOOD AFTERNOON`;
        icon.setAttribute("src", "assets/desktop/icon-sun.svg");
        container.classList.add("dayTime");
        container.classList.remove("nightTime");
        
    } else if((hour >= 18 && hour <= 24) || (hour >= 0 && hour < 5)){
        greeting.innerText = `GOOD EVENING`;
        icon.setAttribute("src", "assets/desktop/icon-moon.svg");
        container.classList.add("nightTime");
        container.classList.remove("dayTime");
    }

    displayTime.innerHTML = time;
}

//fills in divs in additional infomation section with info fetched from server
function setDetails(){
    let timezone = document.getElementById('timezone');
    let dayOfYear = document.getElementById('dayOfYear');
    let dayOfWeek = document.getElementById('dayOfWeek');
    let weekNumber = document.getElementById('weekNumber');

    timezone.innerHTML = time_zone;
    dayOfYear.innerHTML = day_of_year;
    weekNumber.innerHTML = week_number;

    if(day_of_week == 0){
        dayOfWeek.innerHTML = 7;
    } else{
        dayOfWeek.innerHTML = day_of_week + 1;
    }

}

//toggles between displaying and hiding additional information about date and time
function showMore(){
    let moreInfo = document.querySelector('.more-info');
    let showMoreBtn = document.getElementById('showMore');
    let showMoreSpan = document.querySelector('#showMore span');
    let basicDisplay = document.querySelector('.basic-display');
    let quoteContainer = document.querySelector(".quote-container");

    moreInfo.classList.toggle('hide');
    showMoreBtn.classList.toggle('top');
    basicDisplay.classList.toggle('top');
    quoteContainer.classList.toggle('hide');

    if(showMoreBtn.classList.contains('top')){
        showMoreSpan.innerText = "LESS";
    } else{
        showMoreSpan.innerText = "MORE";
    }
}



//gets quotes from server
function getQuotes(){
   fetch("https://type.fit/api/quotes")
     .then(function (response) {
       return response.json();
     })
     .then(function (data) {
       quotes = data;
     })
     .then(displayRandomQuote);
}

//displays random quote from a list of quotes
function displayRandomQuote(){
    let quote = document.querySelector('#quote');
    let author = document.querySelector("#author");

    let randomNumber = Math.floor(Math.random() * 1643);
    let randomQuote = quotes[randomNumber];

    quote.innerHTML = "<q>" + randomQuote.text + "</q>";
    author.innerText = randomQuote.author;
}





