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

const createCardElement = (long_url, short_url, datetime, clicks) => {
    const linkWrapperDiv = document.createElement("div");
    linkWrapperDiv.className = "link-wrapper";

    const accordionBtn = document.createElement("button");
    accordionBtn.id = "accordion-btn";
    accordionBtn.className = "accordion-btn";
    const faIcon = document.createElement("i");
    faIcon.className = "fa-solid fa-chevron-down";
    accordionBtn.append(faIcon);

    const headerDiv = document.createElement("div");
    headerDiv.className = "url-header";
    const paraLongUrl = document.createElement("p");
    paraLongUrl.className = "long-url";
    paraLongUrl.innerText = long_url;
    const paraShortUrl = document.createElement("p");
    paraShortUrl.className = "mini-url";
    const link = document.createElement("a");
    link.setAttribute("href", short_url);
    link.setAttribute("target", "_blank");
    link.innerText = window.location.origin + "/" + short_url;
    paraShortUrl.append(link);
    headerDiv.append(...[paraLongUrl, paraShortUrl]);

    const infoDiv = document.createElement("div");
    infoDiv.className = "url-info";
    const paraDatetime = document.createElement("p");
    const strongDatetime = document.createElement("strong");
    const faClock = document.createElement("i");
    faClock.className = "fa-solid fa-clock";
    strongDatetime.append(faClock);
    strongDatetime.innerText = " Created On:- ";
    const spanDatetime = document.createElement("span");
    spanDatetime.className = "created-on";
    spanDatetime.innerText = datetime;
    paraDatetime.append(...[strongDatetime, spanDatetime]);
    const paraClicks = document.createElement("p");
    const strongClicks = document.createElement("strong");
    const faChart = document.createElement("i");
    faChart.className = "fa-solid fa-chart-simple";
    strongClicks.append(faChart);
    strongClicks.innerText = " Total Clicks:- ";
    const spanClicks = document.createElement("span");
    spanClicks.className = "clicks";
    spanClicks.innerText = clicks;
    paraClicks.append(...[strongClicks, spanClicks]);
    infoDiv.append(...[paraDatetime, paraClicks]);

    const btnWrapper = document.createElement("div");
    btnWrapper.className = "btn-wrapper";
    const btn = document.createElement("button");
    btn.className = "btn copy-btn";
    btn.innerText = "Copy MiniUrl";
    btnWrapper.append(btn);

    linkWrapperDiv.append(...[accordionBtn, headerDiv, infoDiv, btnWrapper]);

    linksWrapper.insertBefore(linkWrapperDiv, linksWrapper.children[0]);

    accordion(accordionBtn);
    copyToClipboard(linkWrapperDiv);
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
            date_time: response.date_time,
            clicks: response.clicks,
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
            createCardElement(
                urlObject["long_url"],
                urlObject["short_url"],
                urlObject["date_time"],
                urlObject["clicks"]
            );
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
