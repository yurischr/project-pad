/**
 * Controller responsible for table on dashboard
 * @author Ares Kok
 */
window.addEventListener('load', () => {
    const tableBody = document.body;
    const tableTemplate = document.querySelector("#useTable");
    const clone = tableTemplate.content.cloneNode(true);
    const period = clone.querySelector("#timePeriod");

    const day = document.querySelector("#selectDay");
    const week = document.querySelector("#selectWeek");
    const month = document.querySelector("#selectMonth");
    const year = document.querySelector("#selectYear");

    day.addEventListener("click", function () {
        day.style.backgroundColor = "#00509E";
        day.style.color = "white";
        period.innerHTML = "Dag";
        tableBody.appendChild(clone);
    });

    week.addEventListener("click", function () {
        period.innerHTML = "Week";
        tableBody.appendChild(clone);
    })

    month.addEventListener("click", function () {
        period.innerHTML = "Month";
        tableBody.appendChild(clone);
    })

    year.addEventListener("click", function () {
        period.innerHTML = "Jaar";
        tableBody.appendChild(clone);
    })
})