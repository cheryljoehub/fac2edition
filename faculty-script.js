// ==============================
// Meet Your Professors
// ==============================

function goBack() {
    window.history.back();
}

let facultyData = [];

const departmentsSection = document.getElementById("departments");
const facultySection = document.getElementById("facultySection");
const facultyGrid = document.getElementById("facultyGrid");
const facultyTitle = document.getElementById("facultyTitle");
const searchInput = document.getElementById("search");
const keyboardWindow = document.getElementById("keyboardWindow");
const keyboardKeys = document.getElementById("keyboardKeys");

const profileWindow = document.getElementById("profileWindow");

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profilePosition = document.getElementById("profilePosition");
const profileDepartment = document.getElementById("profileDepartment");

const office = document.getElementById("office");
//const hours = document.getElementById("hours");
const education = document.getElementById("education");
const hometown = document.getElementById("hometown");
const courses = document.getElementById("courses");
const funfact = document.getElementById("funfact");


// ======================================
// Load Faculty JSON
// ======================================

fetch("data/faculty.json")
.then(response => response.json())
.then(data => {

    facultyData = data;

    console.log("Faculty Loaded");

})
.catch(error=>{

    console.error(error);

});

// ======================================
// Department Buttons
// ======================================

document.querySelectorAll(".department").forEach(button=>{

    button.addEventListener("click",()=>{

        const department = button.dataset.department;

        showDepartment(department);

    });

});

// ======================================

function showDepartment(department){

    departmentsSection.style.display = "none";

    facultySection.style.display = "block";

    facultyTitle.innerHTML = department + " Faculty";

    facultyGrid.innerHTML = "";

    const professors = facultyData.filter(p=>p.department===department);

    if(professors.length===0){

        facultyGrid.innerHTML="<h2>No Faculty Available</h2>";

        return;

    }

    professors.forEach(person=>{

        const card=document.createElement("div");

        card.className="facultyCard";

        card.innerHTML=`

            <img src="${person.image}">

            <div class="facultyInfo">

                <h3>${person.name}</h3>

                <p>${person.title}</p>

            </div>

        `;

        card.onclick=()=>{

            openProfile(person);

        }

        facultyGrid.appendChild(card);

    });

}

// ======================================
// Home Button
// ======================================

document.getElementById("homeButton").onclick=()=>{

    searchInput.value="";

    searchInput.dispatchEvent(new Event("input", { bubbles: true }));

    facultySection.style.display="none";

    departmentsSection.style.display="block";

};

// ======================================
// Profile Window
// ======================================

function openProfile(person){

    profileWindow.style.display="flex";

    profileImage.src=person.image;

    profileName.innerHTML=person.name;

    profilePosition.innerHTML=person.title;

    profileDepartment.innerHTML=person.department;

   // office.innerHTML=person.office;

    //hours.innerHTML=person.hours;

   // education.innerHTML=person.education;

    hometown.innerHTML=person.hometown || "Not provided";

  //  funfact.innerHTML=person.funFact;

    courses.innerHTML="";

    person.courses.forEach(course=>{

        courses.innerHTML+=`<li>${course}</li>`;

    });

}

// ======================================
// Close Window
// ======================================

document.getElementById("closeProfile").onclick=()=>{

    profileWindow.style.display="none";

}

// ======================================
// Live Search
// ======================================

searchInput.addEventListener("input",function(){

    const search=this.value.toLowerCase();

    facultyGrid.innerHTML="";

    facultySection.style.display="block";

    departmentsSection.style.display="none";

    facultyTitle.innerHTML="Search Results";

    const results=facultyData.filter(person=>{

        return person.name.toLowerCase().includes(search)

        ||

        person.department.toLowerCase().includes(search)

        ||

        person.title.toLowerCase().includes(search);

    });

    if(results.length===0){

        facultyGrid.innerHTML="<h2>No Results Found</h2>";

        return;

    }

    results.forEach(person=>{

        const card=document.createElement("div");

        card.className="facultyCard";

        card.innerHTML=`

        <img src="${person.image}">

        <div class="facultyInfo">

            <h3>${person.name}</h3>

            <p>${person.department}</p>

        </div>

        `;

        card.onclick=()=>{

            openProfile(person);

        }

        facultyGrid.appendChild(card);

    });

    if(search===""){

        facultySection.style.display="none";

        departmentsSection.style.display="block";

    }

});

// ======================================
// On-screen Search Keyboard
// ======================================

const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
    ["Backspace", "Space", "Enter"]
];

keyboardRows.forEach(row => {
    const rowElement = document.createElement("div");
    rowElement.className = "keyboardRow";

    row.forEach(key => {
        const keyButton = document.createElement("button");
        keyButton.type = "button";
        keyButton.className = "keyboardKey";
        keyButton.dataset.key = key.toLowerCase();
        keyButton.textContent = key === "Backspace" ? "⌫" : key;
        keyButton.setAttribute("aria-label", key);

        keyButton.addEventListener("click", () => {
            searchInput.focus();

            if (key === "Backspace") {
                searchInput.value = searchInput.value.slice(0, -1);
            } else if (key === "Space") {
                searchInput.value += " ";
            } else if (key === "Enter") {
                closeKeyboard();
                return;
            } else {
                searchInput.value += key.toLowerCase();
            }

            searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        });

        rowElement.appendChild(keyButton);
    });

    keyboardKeys.appendChild(rowElement);
});

function openKeyboard() {
    keyboardWindow.hidden = false;
    document.body.classList.add("keyboardOpen");
}

function closeKeyboard() {
    keyboardWindow.hidden = true;
    document.body.classList.remove("keyboardOpen");
}

searchInput.addEventListener("focus", openKeyboard);
document.getElementById("closeKeyboard").addEventListener("click", closeKeyboard);
keyboardWindow.addEventListener("click", event => {
    if (event.target === keyboardWindow) closeKeyboard();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeKeyboard();
});

// ======================================
// Close profile by clicking outside
// ======================================

profileWindow.addEventListener("click",(e)=>{

    if(e.target===profileWindow){

        profileWindow.style.display="none";

    }

});