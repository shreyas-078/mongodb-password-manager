const select = document.getElementById("option-container");
const platformControls = document.querySelector(".platform-controls");
const newPassControls = document.querySelector(".add-new-pass");
const fetchDetailsButton = document.getElementById("fetch-details-btn");
const addNewPlatformButton = document.getElementById("add-new-platform");
const resultDiv = document.querySelector(".platform-details");

document.getElementById("helper-text").classList.remove("invisible");
document.getElementById("helper-text").textContent =
  "This is a Password Manager Connected to MongoDB and can save and fetch your passwords from anywhere, anytime.";

select.addEventListener("change", () => {
  if (select.selectedIndex === 2) {
    document.getElementById("helper-text").classList.add("invisible");
    resultDiv.classList.add("invisible");
    platformControls.classList.remove("invisible");
    newPassControls.classList.add("invisible");
    document.getElementById("platform-name").value = "";
  } else if (select.selectedIndex === 1) {
    document.getElementById("helper-text").classList.add("invisible");
    resultDiv.querySelector("div").classList.add("invisible");
    resultDiv.querySelector("ul").classList.remove("invisible");

    fetch("/fetch-all-platforms", {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data.length === 0) {
          document.getElementById("helper-text").textContent =
            "There are no Saved Platforms";
          document.getElementById("helper-text").classList.remove("invisible");
          return;
        }
        document.getElementById("helper-text").classList.add("invisible");
        resultDiv.querySelector("ul").innerHTML = "";

        data.forEach((platform) => {
          const newLi = document.createElement("li");
          const newButton = document.createElement("button");
          newButton.addEventListener("click", () => {
            fetch("/remove-details", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                platformName: platform.platformName,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
              })
              .then((data) => {
                if (data.message) {
                  newLi.remove();
                  if (document.querySelector("ul").innerHTML === "") {
                    document.getElementById("helper-text").textContent =
                      "There are no Saved Platforms";
                    document
                      .getElementById("helper-text")
                      .classList.remove("invisible");
                    return;
                  }
                }
              });
          });
          newButton.textContent = "Delete Record";
          newLi.textContent = platform.platformName.toUpperCase();
          resultDiv.querySelector("ul").append(newLi);
          newLi.append(newButton);
          resultDiv.classList.remove("invisible");
        });
      });

    platformControls.classList.add("invisible");
    newPassControls.classList.add("invisible");
  } else if (select.selectedIndex === 0) {
    document.getElementById("helper-text").classList.remove("invisible");
    document.getElementById("helper-text").textContent =
      "This is a Password Manager Connected to MongoDB and can save and fetch your passwords from anywhere, anytime.";
    resultDiv.classList.add("invisible");
    platformControls.classList.add("invisible");
    newPassControls.classList.add("invisible");
  } else {
    document.getElementById("helper-text").classList.add("invisible");
    resultDiv.classList.add("invisible");
    newPassControls.classList.remove("invisible");
    platformControls.classList.add("invisible");
    document.getElementById("new-platform-name").value = "";
    document.getElementById("new-platform-username").value = "";
    document.getElementById("new-platform-pass").value = "";
  }
});

fetchDetailsButton.addEventListener("click", () => {
  const platformName = document
    .getElementById("platform-name")
    .value.toUpperCase();
  if (!platformName) {
    document.getElementById("helper-text").textContent =
      "Please enter platform name.";
    document.getElementById("helper-text").classList.remove("invisible");
    return;
  }
  document.getElementById("helper-text").classList.add("invisible");
  fetch("/fetch-details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platformName: platformName,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data.length === 0) {
        document.getElementById("helper-text").textContent =
          "There is no Matching Platform";
        document.getElementById("helper-text").classList.remove("invisible");
        resultDiv.classList.add("invisible");
        return;
      }
      resultDiv.querySelector("ul").classList.add("invisible");
      document.getElementById("helper-text").classList.add("invisible");
      resultDiv.classList.remove("invisible");
      resultDiv.querySelector("div").classList.remove("invisible");
      resultDiv.querySelector(".res-pn").textContent =
        "Platform Name: " + data[0].platformName;
      resultDiv.querySelector(".res-pun").textContent =
        "Platform Username: " + data[0].platformUsername;
      resultDiv.querySelector(".res-ppn").textContent =
        "Platform password: " + data[0].platformPass;
    });
});

addNewPlatformButton.addEventListener("click", () => {
  const platformName = document
    .getElementById("new-platform-name")
    .value.toUpperCase();
  const platformUserName = document.getElementById(
    "new-platform-username"
  ).value;
  const password = document.getElementById("new-platform-pass").value;

  if (!platformName || !platformUserName || !password) {
    document.getElementById("helper-text").textContent =
      "Please enter all fields";
    document.getElementById("helper-text").classList.remove("invisible");
    return;
  }
  document.getElementById("helper-text").classList.add("invisible");

  fetch("/add-platform", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platformName: platformName,
      platformUserName: platformUserName,
      platformPass: password,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data.error) {
        document.getElementById("helper-text").textContent =
          "Platform Already Exists!";
        document.getElementById("helper-text").classList.remove("invisible");
        return;
      }
      document.getElementById("helper-text").textContent =
        "Platform Added Successfully!";
      document.getElementById("helper-text").classList.remove("invisible");
    });
});
