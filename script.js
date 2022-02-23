const rootElem = document.getElementById("root");
const allEpisodes = getAllEpisodes();
const searchBox = document.querySelector("#search-input");
const displayNumberOfShows = document.querySelector(".display-shows");

function setup() {
  makePageForEpisodes(allEpisodes);
}
//ADD EPISODES
//displays the episode on the page after it's html has been created
function makePageForEpisodes(episodeList) {
  episodeList.forEach((episode) => {
    rootElem.innerHTML += displayEpisode(episode);
    displayNumberOfShows.innerHTML = `<p>Displaying ${allEpisodes.length} episodes</p>`;
  });
}

//creates the html layout for each episode
function displayEpisode(episode) {
  let seasonNumber = `${episode.season}`;
  let episodeNumber = `${episode.number}`;
  return `<div class="episode-container"><div class="episode-name-wrapper"><h1 class="episode-name">${episode.name}</h1><h2>S${seasonNumber.padStart(2, 0)}E${episodeNumber.padStart(2, 0)}</h2></div><div class="episode-info"><img src=${episode.image.medium}><p class="summary">${
    episode.summary
  }</p></div><div class="data-origin"><p>This data originally came from <a href="${episode.url}">TVMaze.com</a></p></div></div>`;
}

//SEARCH

function episodeSearch(e) {
  const searchString = e.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name.toLowerCase().includes(searchString) || episode.summary.toLowerCase().includes(searchString);
  });
  rootElem.innerHTML = ""; 
  makePageForEpisodes(filteredEpisodes);
  displayNumberOfShows.innerHTML = `<p>Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes</p>`;
}
searchBox.addEventListener("input", episodeSearch);

window.onload = setup;
