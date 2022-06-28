const linksWrapper = document.getElementById("links-wrapper"),
    popup = document.getElementById("popup"),
    popupIcon = document.querySelector("#popup #icon i"),
    popupMessage = document.querySelector("#popup #message"),
    urlFieldWrapper = document.getElementById("field-url"),
    emailFieldWrapper = document.getElementById("field-email"),
    codeFieldWrapper = document.getElementById("field-code"),
    submitBtn = document.getElementById("submit-btn"),
    urlInput = document.getElementById("url"),
    emailInput = document.getElementById("email"),
    codeInput = document.getElementById("code"),
    form = document.getElementById("form");

const fetchRequest = (route, data) =>
    fetch(route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then(data)
        .catch((error) => console.log("Error: " + error));

const checkResponse = (response, fieldWrapper) => {
    if (response.status === 200) {
        popupToggle("success", "fa-circle-check", response.message);
        return true;
    } else if (response.status === 400) {
        fieldWrapper.classList.add("error");
        fieldWrapper.children[1].textContent = response.message;
        setTimeout(() => {
            fieldWrapper.classList.remove("error");
            fieldWrapper.children[1].textContent = "";
        }, 4000);
        return false;
    } else {
        popupToggle("error", "fa-circle-exclamation", response.message);
        return false;
    }
};

const popupToggle = (className, iconClass, message) => {
    popup.classList.add(className);
    popupIcon.classList.add(iconClass);
    popupMessage.textContent = message;

    setTimeout(() => {
        popup.classList.remove(className);
    }, 4000);

    setTimeout(() => {
        popupIcon.classList.remove(iconClass);
        popupMessage.textContent = "";
    }, 4400);
};

const accordion = (accordionBtn) => {
    const accordionButtons = document.querySelectorAll(
        "#links-wrapper #accordion-btn"
    );
    accordionBtn.addEventListener("click", (e) => {
        accordionButtons.forEach((accordionBtn) => {
            if (e.currentTarget === accordionBtn)
                accordionBtn.parentElement.classList.toggle("active");
            else accordionBtn.parentElement.classList.remove("active");
        });
    });
};

const createCardElement = (long_url, short_url) => {
    const linkWrapperDiv = document.createElement("div");
    linkWrapperDiv.classList.add("link-wrapper");
    const paraLongUrl = document.createElement("p");
    paraLongUrl.classList.add("long-link");
    paraLongUrl.innerText = long_url;
    const paraShortUrl = document.createElement("p");
    paraShortUrl.classList.add("short-link");
    paraShortUrl.innerText = window.location.origin + "/" + short_url;
    const btn = document.createElement("button");
    btn.classList.add(...["btn", "copy-btn"]);
    btn.innerText = "Copy";

    linkWrapperDiv.append(...[paraLongUrl, paraShortUrl, btn]);

    linksWrapper.insertBefore(linkWrapperDiv, linksWrapper.children[0]);

    copyToClipboard();
};

const copyToClipboard = (cardElement) => {
    const copyBtn = cardElement.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(
            cardElement.querySelector(".mini-url").innerText
        );

        copyBtn.innerText = "Copied!";
        copyBtn.classList.add("active");

        setTimeout(() => {
            copyBtn.innerText = "Copy MiniUrl";
            copyBtn.classList.remove("active");
        }, 3000);
    });
};

const traverseLinkWrappers = () => {
    const linkWrappers = document.getElementsByClassName("link-wrapper");
    for (const wrapper of linkWrappers) {
        accordion(wrapper.querySelector("#accordion-btn"));
        copyToClipboard(wrapper);
    }
};

let isCodeSent = false,
    isAuthenticated = false,
    isShortened = false,
    urlObject;
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.setAttribute("disabled", "true");

    const submitBtnClasses = submitBtn.classList;
    if (submitBtnClasses.contains("send-code-btn")) {
        let response = await fetchRequest("/mail-code", {
            email: emailInput.value,
        });
        isCodeSent = checkResponse(response, emailFieldWrapper);
    } else if (submitBtnClasses.contains("sign-in-btn") && isCodeSent) {
        let response = await fetchRequest("/login", {
            code: codeInput.value,
        });
        isAuthenticated = checkResponse(response, codeFieldWrapper);
    } else if (submitBtnClasses.contains("shorten-btn")) {
        let response = await fetchRequest("/shorten", {
            long_url: urlInput.value,
        });
        urlObject = {
            long_url: response.long_url,
            short_url: response.short_url,
        };
        isShortened = checkResponse(response, urlFieldWrapper);
    } else {
        console.error(`Submit Btn Classes: ${submitBtnClasses}`);
    }

    if (isCodeSent) {
        emailInput.setAttribute("readonly", "true");
        codeFieldWrapper.style.display = "block";
        submitBtn.classList.replace("send-code-btn", "sign-in-btn");
        submitBtn.setAttribute("value", "Sign In");
    }

    if (isAuthenticated) {
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    }

    if (isShortened) {
        setTimeout(() => {
            urlInput.value = "";
            createCardElement(urlObject["long_url"], urlObject["short_url"]);
        }, 1000);
    }
    submitBtn.removeAttribute("disabled");
});

// Set Current Year in Copyright Footer
const setFooter = () => {
    const element = document.getElementById("currentYear");
    const date = new Date();
    element.innerText = date.getFullYear();
};

window.addEventListener("DOMContentLoaded", () => {
    setFooter();
    traverseLinkWrappers();
});
