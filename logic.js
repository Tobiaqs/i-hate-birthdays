(() => {
    function isRelevantDayCount (dayCount) {
        const dayCountChars = dayCount.toString().split("");

        // 5555 and such
        if (dayCountChars.every(char => char === dayCountChars[0])) {
            return true;
        }

        // 5678 and such
        if (dayCountChars.every((char, index) => index === 0 || (char * 1) - 1 === dayCountChars[index - 1] * 1)) {
            return true;
        }

        // 5000 and such
        if (dayCountChars.every((char, index) => index === 0 || char === "0")) {
            return true;
        }

        return false;
    }

    function getDayCountFromDates (laterDate, earlierDate) {
        return Math.floor((laterDate - earlierDate) / 1000 / 60 / 60 / 24);
    }

    function getYearCountFromDates (laterDate, earlierDate) {
        return Math.floor((laterDate - earlierDate) / 1000 / 60 / 60 / 24 / 365);
    }

    function getRelevantDates (birthDate) {
        const today = new Date();
        const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0);
        let days = getDayCountFromDates(targetDate, birthDate);

        const relevantDates = [];

        do {
            if (isRelevantDayCount(days)) {
                relevantDates.push({
                    date: new Date(targetDate),
                    dayCount: days,
                    yearCount: getYearCountFromDates(targetDate, birthDate)
                });
            }

            targetDate.setTime(targetDate.getTime() + 1000 * 3600 * 24);

            // nullify crap like dst, leaps
            targetDate.setHours(12);
            targetDate.setMinutes(0);
            targetDate.setSeconds(0);
            targetDate.setMilliseconds(0);
            days ++;

        } while (getYearCountFromDates(targetDate, birthDate) <= 150);

        return relevantDates;
    }

    window.addEventListener("load", () => {
        const input = document.getElementById("input");
        const birthDay = document.getElementById("birth-day");
        const birthMonth = document.getElementById("birth-month");
        const birthYear = document.getElementById("birth-year");
        const btnCalculate = document.getElementById("btn-calculate");

        const result = document.getElementById("result");
        const resultText = document.getElementById("result-text");
        const btnBack = document.getElementById("btn-back");

        for (let i = 1; i <= 31; i ++) {
            const node = document.createElement("option");
            node.innerHTML = i.toString();
            birthDay.appendChild(node);
        }

        for (let i = 1; i <= 12; i ++) {
            const node = document.createElement("option");
            node.innerHTML = i.toString();
            birthMonth.appendChild(node);
        }

        for (let i = 1900; i <= (new Date()).getFullYear(); i ++) {
            const node = document.createElement("option");
            node.innerHTML = i.toString();
            node.selected = i === 1990;
            birthYear.appendChild(node);
        }

        btnCalculate.addEventListener("click", () => {
            const birthDate = new Date(birthYear.selectedOptions.item(0).innerHTML * 1,
                birthMonth.selectedOptions.item(0).innerHTML * 1 - 1,
                birthDay.selectedOptions.item(0).innerHTML * 1,
                12);

            const relevantDates = getRelevantDates(birthDate);

            input.style.display = "none";
            let html = "Interesting upcoming celebratory dates for you are:<br /><br />"
                + relevantDates.map(obj =>
                    "<b>" + obj.date.toLocaleString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                }) + "</b><br /><i class=\"age-indication\">" + obj.dayCount + " days / " + obj.yearCount + " years</i><br />").join("");
            resultText.innerHTML = html;
            result.style.display = "block";
        });

        btnBack.addEventListener("click", () => {
            result.style.display = "none";
            input.style.display = "block";
        });
    });
})();