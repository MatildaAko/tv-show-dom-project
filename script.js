//You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   rootElem.textContent = `Got ${episodeList.length} episode(s)`;
// }

// window.onload = setup;
const rootElem = document.getElementById("root");
const allEpisodes = getAllEpisodes();

function setup() {
  makePageForEpisodes(allEpisodes);
}

//displays the episode on the page after it's html has been created
function makePageForEpisodes(episodeList) {
  console.log(episodeList[0]);
  episodeList.forEach((episode) => {
    rootElem.innerHTML += displayEpisode(episode);
  });
}

//creates the html layout for each episode
function displayEpisode(episode) {
  let seasonNumber = `${episode.season}`
  let episodeNumber = `${episode.number}`;
  return `<div class="episode-container"><div class="episode-name"><h1>${episode.name}</h1><h2>S${seasonNumber.padStart(
    2,
    0
  )}E${episodeNumber.padStart(2, 0)}</h2></div><div class="episode-info"><img src=${episode.image.medium}><p>${
    episode.summary
  }</p></div><div class="data-origin"><p>This data originally came from <a href="${episode.url}">TVMaze.com</a></p></div></div>`;
}

window.onload = setup;
