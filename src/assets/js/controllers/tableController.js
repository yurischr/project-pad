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
        day.style.background = "#0063c3";
        day.style.color = "#FFFFFF";
        period.innerHTML = "Dag";
        tableBody.appendChild(clone);
    });

    week.addEventListener("click", function () {
        week.style.background = "#0063c3";
        week.style.color = "#FFFFFF";
        period.innerHTML = "Week";
        tableBody.appendChild(clone);
    })

    month.addEventListener("click", function () {
        month.style.background = "#0063c3";
        month.style.color = "#FFFFFF";
        period.innerHTML = "Month";
        tableBody.appendChild(clone);
    })

    year.addEventListener("click", function () {
        year.style.background = "#0063c3";
        year.style.color = "#FFFFFF";
        period.innerHTML = "Jaar";
        tableBody.appendChild(clone);
    })
})