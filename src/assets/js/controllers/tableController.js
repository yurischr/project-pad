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
    const buttons = [day, week, month, year];

    function appendTable(timePeriod){
        period.innerHTML = timePeriod;
        tableBody.appendChild(clone);
    }

    function setSelected(toBeSelected){
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.background = "#FFFFFF"
            buttons[i].style.color = "#849AA9"
        }
        toBeSelected.style.background = "#0063c3";
        toBeSelected.style.color = "#FFFFFF"
    }


    day.addEventListener("click", function () {
        appendTable("Dag")
        setSelected(this);
    });

    week.addEventListener("click", function () {
        appendTable("Week");
        setSelected(this);
    })

    month.addEventListener("click", function () {
        appendTable("Maand");
        setSelected(this);
    })

    year.addEventListener("click", function () {
        appendTable("Jaar");
        setSelected(this);
    })
});