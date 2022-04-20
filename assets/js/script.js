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

// Set Current Year in Copyright Footer
const setFooter = () => {
    const element = document.getElementById("currentYear");
    const date = new Date();
    element.innerText = date.getFullYear();
};

window.addEventListener("DOMContentLoaded", () => {
    setFooter();
});
