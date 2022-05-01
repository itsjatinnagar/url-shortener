const linkWrappers = document.getElementsByClassName("link-wrapper"),
    popup = document.getElementById("popup"),
    popupIcon = document.querySelector("#popup #icon i"),
    popupMessage = document.querySelector("#popup #message"),
    urlFieldWrapper = document.getElementById("field-url"),
    urlInput = document.getElementById("url"),
    shortenBtn = document.getElementById("submit-btn"),
    shortenForm = document.getElementById("url-form");

const checkResponse = (response) => {
    if (response.status === 200) {
        let result = getCookie("identifiers");
        if (result === undefined) {
            result = response.id;
        } else {
            result += "-" + response.id;
        }
        setCookie("identifiers", result, 7);

        popupToggle("success", "fa-circle-check", response.message);

        setTimeout(() => window.location.reload(), 4000);
    } else if (response.status === 400) {
        urlFieldWrapper.classList.add("error");
        urlFieldWrapper.children[1].textContent = response.message;
        setTimeout(() => {
            urlFieldWrapper.classList.remove("error");
            urlFieldWrapper.children[1].textContent = "";
        }, 4000);
        shortenBtn.removeAttribute("disabled");
    } else {
        popupToggle("error", "fa-circle-exclamation", response.message);
        shortenBtn.removeAttribute("disabled");
    }
};

// Submitting Long URL
shortenForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const request = { long_url: urlInput.value };
    shortenBtn.setAttribute("disabled", "true");

    fetch("/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })
        .then((response) => response.json())
        .then(checkResponse)
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

const popupToggle = (className, iconClass, message) => {
    popup.classList.add(className);
    popupIcon.classList.add(iconClass);
    popupMessage.textContent = message;

    setTimeout(() => {
        popup.classList.remove(className);
        popup.addEventListener("transitionend", () => {
            popupIcon.classList.remove(iconClass);
            popupMessage.textContent = "";
        });
    }, 4000);
};

for (const wrapper of linkWrappers) {
    // Copy: Short url to Clipboard
    const copyBtn = wrapper.children[2];
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(wrapper.children[1].innerText);

        copyBtn.innerText = "Copied!";
        copyBtn.classList.add("active");

        setTimeout(() => {
            copyBtn.innerText = "Copy";
            copyBtn.classList.remove("active");
        }, 3000);
    });
}

// Set Current Year in Copyright Footer
const setFooter = () => {
    const element = document.getElementById("currentYear");
    const date = new Date();
    element.innerText = date.getFullYear();
};

window.addEventListener("DOMContentLoaded", () => {
    setFooter();
});
