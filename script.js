const APIURL = 'https://api.github.com/users/';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const getUser = async (username) => {
    try {
        const { data } = await axios(APIURL + username)
        createUserCard(data);
        getRepos(username);
    } catch (err) {
        if(err.response.status === 404){
            creatErrorCard('No profile with this User Name');
        }
    }
}

const getRepos = async (username) => {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data);
    } catch (err) {
            creatErrorCard('Problem Fetching repos');
    }
}

const creatErrorCard = (msg) => {
    const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>`;
    main.innerHTML = cardHTML;
}

const createUserCard = async (user) => {
    const cardHTML = `<div class="card">
    <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>
        <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following}<strong>Following</strong></li>
            <li>${user.public_repos}<strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
    </div>
</div>`
main.innerHTML = cardHTML;
}

const addReposToCard = (repos) => {
    const reposEl = document.getElementById('repos');
    repos
    .slice(0, 3)
    .forEach(repo => {
        const repoLink = document.createElement('a');
        repoLink.classList.add('repo');
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.innerHTML = repo.name;
        reposEl.appendChild(repoLink);
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;
    if(user) {
        getUser(user);
        search.value = '';
    }
})