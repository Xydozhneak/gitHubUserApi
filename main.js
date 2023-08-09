const API = 'https://api.github.com';
const mainContainer = document.createElement("div");
mainContainer.classList.add("mainContainer");
document.body.append(mainContainer);

async function controller(action) {
    try {
        const response = await fetch(action);
        if (response.status > 399) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const buttonSearch = document.querySelector("#search");
buttonSearch.addEventListener('click', async () => {
    mainContainer.innerHTML = "";
    const userLogin = document.querySelector("#login").value;
    const user = await controller(`${API}/users/${userLogin}`);
    console.log(user);
    const userContainer = showUser(user);
    mainContainer.append(userContainer);
    const repos = await controller(`${API}/users/${userLogin}/repos`);
    showRepos(repos);
});

const randomUserButton = document.querySelector("#randomUser");
randomUserButton.addEventListener('click', async () => {
    mainContainer.innerHTML = "";
    const randomUser = await getRandomUser();
    const user = await controller(`${API}/users/${randomUser}`);
    console.log(randomUser);
    if (randomUser) {
        const userContainer = showUser(user);
        mainContainer.append(userContainer);
        const repos = await controller(`${API}/users/${randomUser}/repos`);
        showRepos(repos);
    }
});

function showUser(user) {
    const userInfo = document.createElement("div");
    userInfo.classList.add("userInfo");

    if (!user) {
        userInfo.innerText = "USER NOT FOUND";
        return userInfo;
    }

    const avatar = user.avatar_url;
    const name = user.name;
    const bio = user.bio;
    const location = user.location;
    const followers = user.followers;

    const img = document.createElement("img");
    const userName = document.createElement("h2");
    const description = document.createElement("p");
    const loc = document.createElement("p");
    const followersInfo = document.createElement("p");

    img.src = avatar;
    userName.innerText = `User Name: ${name}`;
    description.innerText = `Bio: ${bio ? bio : "empty"}`;
    loc.innerText = `Location: ${location ? location : "empty"}`;
    followersInfo.innerText = `Followers: ${followers}`;
    userInfo.classList.add("animate__animated", "animate__bounce");
    userInfo.append(img, userName, description, loc, followersInfo);
    return userInfo;
}

async function getRandomUser() {
    try {
        const userList = await controller(`${API}/users?per_page=100`);
        const randomIndex = Math.floor(Math.random() * userList.length);
        const randomUser = userList[randomIndex];
        console.log(randomUser);
        return randomUser.login;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const cardContainer = document.createElement("div");
cardContainer.classList.add("cardContainer");

function showRepos(userRepos) {
    cardContainer.innerHTML = '';
    userRepos.forEach(repos => {
        const reposCard = document.createElement("div");
        reposCard.classList.add("reposCard");
        const reposName = document.createElement("h3");
        const description = document.createElement("p");
        reposName.innerText = `Name: ${repos.name}`;
        description.innerText = `Description: ${repos.description}`;
        reposCard.append(reposName, description);
        reposCard.classList.add("animate__animated", "animate__bounce");
        cardContainer.append(reposCard);
    });
    mainContainer.append(cardContainer);
}

const userLogin = document.querySelector("#login");
const form = document.querySelector(".form");
const errMsg = document.createElement("span");
errMsg.id = "error";
errMsg.innerText = "*Incorrect input";
errMsg.classList.add("none");
form.append(errMsg);

userLogin.addEventListener('input', () => {
    const username = userLogin.value.trim();

    if (/^[a-zA-Z0-9]+$/.test(username) || username.length === 0) {
        userLogin.style.borderColor = 'green';
        errMsg.classList.add("none");
    } else {
        errMsg.classList.remove("none");
        userLogin.style.borderColor = 'red';
    }
});