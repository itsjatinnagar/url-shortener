const urlInput = document.getElementById("url"),
    shortenForm = document.getElementById("url-form");

// Submitting Long URL
shortenForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const request = { long_url: urlInput.value };

    fetch("/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })
        .then((response) => response.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.error("Error: " + error));
});

const setCookie = (cName, cValue, expires) => {
    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires;
};

const getCookie = (cName) => {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
};

// Set Current Year in Copyright Footer
const setFooter = () => {
    const element = document.getElementById("currentYear");
    const date = new Date();
    element.innerText = date.getFullYear();
};

window.addEventListener("DOMContentLoaded", () => {
    setFooter();
});
