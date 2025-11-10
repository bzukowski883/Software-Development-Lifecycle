const { ipcRenderer } = require('electron');

function formSubmit(event) {
    event.preventDefault();    //prevents default behaviour of submit button
   
    let eventName = document.getElementById("Event").value;
    let startDate = document.getElementById("Start-Date").value;
    let startTime = document.getElementById("Start-Time").value;
    let endTime = document.getElementById("End-Time").value;
    let endDate = document.getElementById("End-Date").value;
    let privacy = document.querySelector("input[name=Privacy]:checked").id;
    let repeat = document.getElementById("Repeat").value;
    let friends = Array.from(document.querySelectorAll('input[name=Friend]:checked'))
                   .map(friend => friend.id);    //maps our selected friends IDs to an array to be stored in js
    
    if (friends == null){
        friends = false;    //if no friends are selected return false
    }
    if (endDate == ""){
        endDate = startDate;    //if no endDate is selected return startDate
    }

    let NewEvent = {eventName: eventName, startDate: startDate, startTime: startTime, endTime: endTime, endDate: endDate, privacy: privacy, repeat: repeat, friends: friends};

    let StringEvent = JSON.stringify(NewEvent)
    //send all this data to main with the code of 'create-event'
    ipcRenderer.invoke('create-event', StringEvent).then((result)=>{
    });
}

addEventListener("DOMContentLoaded", function(){
    /*ipcRenderer.invoke('retrive-schedule').then((result)=>{
    })*/
    ipcRenderer.invoke('retrive-categories').then((result)=>{
        const categories = JSON.parse(result);
        for(let category in categories){
            console.log(categories[category]);
        }
        ApplyCategories(categories);
        SetFilter(categories);
    })

    document.getElementById('get-calendar-data').addEventListener('submit',formSubmit);
})

function SetFilter(categories){
    let FilterContent = document.getElementById("filterMenuStuff");
    for(let i = 0; i < categories.length; i++){
        let label = document.createElement("label");
        let check = document.createElement("input");

        check.checked = true;
        check.setAttribute("type", "checkbox");
        check.setAttribute("value", categories[i].name);

        label.textContent = categories[i].name;
        
        console.log(label);
        
        FilterContent.appendChild(label);
        label.insertBefore(check, label.firstChild);
        check.addEventListener("change", (box) => {
            let schedules = document.getElementsByClassName(box.target.value)

            if(!box.target.checked){
                for(let i = 0; i < schedules.length ; i++){
                    schedules[i].style.display = "none"
                    console.log(`Displaying none of: ${schedules[i]}`)
                }
            }
            if(box.target.checked){
                for(let i = 0; i < schedules.length; i++){
                    schedules[i].style.display = "block"
                    console.log(`Displaying: ${schedules[i]}`)
                }
            }
        })
        console.log(`Current box: ${check.value}`)
    }
}

function ApplyCategories(categories){
    for(let i = 0; i < categories.length; i++){
        let category = categories[i]
        const items = document.getElementsByClassName(category.name)

        console.log(`outer loop: ${categories[i]}`)

        for(let j = 0; j < items.length; j++){
            let item = items[j]
            console.log(`inner loop: ${item}`)
            item.style.backgroundColor = category.color
            
            item.innerHTML = category.name;
            
            if(categories[i].privacy == 'private'){
                item.style.border = "2px solid black"
            }
        }
    }
}
