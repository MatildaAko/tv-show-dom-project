const rootElem = document.getElementById("root");
const allEpisodes = getAllEpisodes();
const searchBox = document.querySelector("#search-input");
const displayNumberOfShows = document.querySelector(".display-shows");
const episodeSelect = document.querySelector("#select-episodes");

function setup() {
  makePageForEpisodes(allEpisodes);
}

function displayCorrectEpisodes(episodes) {
  rootElem.innerHTML = ""; 
  makePageForEpisodes(episodes);
}
//ADD EPISODES
//displays the episode on the page after it's html has been created
function makePageForEpisodes(episodeList) {
  episodeList.forEach((episode) => {
    rootElem.innerHTML += displayEpisode(episode);
    displayNumberOfShows.innerHTML = `<p>Displaying ${allEpisodes.length} episodes</p>`;
  });
}

function padNumbers(episode) {
  return `S${episode.season.toString().padStart(2, 0)}E${episode.number.toString().padStart(2, 0)}`;
}

//creates the html layout for each episode
function displayEpisode(episode) {
  return `<div class="episode-container"><div class="episode-name-wrapper"><h1 class="episode-name">${episode.name}</h1><h2>${padNumbers(episode)}</h2></div><div class="episode-info"><img src=${episode.image.medium}><p class="summary">${
    episode.summary
  }</p></div><div class="data-origin"><p>This data originally came from <a href="${episode.url}">TVMaze.com</a></p></div></div>`;
}

//SEARCH

function episodeSearch(e) {
  const searchString = e.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name.toLowerCase().includes(searchString) || episode.summary.toLowerCase().includes(searchString);
  });
  displayCorrectEpisodes(filteredEpisodes);
  displayNumberOfShows.innerHTML = `<p>Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes</p>`;
}
searchBox.addEventListener("input", episodeSearch);

//SELECT
episodeSelect.innerHTML = `<option>All Episodes</option>${allEpisodes.map(episode => {
  return `<option>${padNumbers(episode)} - ${episode.name}</option>`;
})}`;

function selectEpisode() {
  
}

episodeSelect.addEventListener("change", () => {
  const selectedEpisode = episodeSelect.options[episodeSelect.selectedIndex].value;
  if (selectedEpisode === "All Episodes") {
    displayCorrectEpisodes(allEpisodes);
  } else {
    let selected = allEpisodes.filter((episode) => {
      return episode.name.includes(selectedEpisode.substring(9));
    });
    displayCorrectEpisodes(selected);
  }
});

window.onload = setup;
