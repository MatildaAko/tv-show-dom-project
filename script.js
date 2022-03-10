const rootElem = document.getElementById("root");
const searchBox = document.querySelector("#search-input");
const displayNumberOfShows = document.querySelector(".display-shows");
const episodeSelect = document.querySelector("#select-episodes");

const showSelect = document.querySelector("#select-show");
const shows = getAllShows();

function setup() {
  selectShow(shows);
  displayShowsAndEpisodes(shows);
  episodeSelect.style.display = "none";
}

let getEpisodesFromApi = function (showId) {
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      episodeSelect.style.display = "block";
      rootElem.innerHTML = "";
      displayShowsAndEpisodes(allEpisodes);
      selectEpisode(allEpisodes);
    })
    .catch((error) => console.error(error, "This can't be displayed"));
};

function displayCorrectEpisodes(episodes) {
  rootElem.innerHTML = "";
  displayShowsAndEpisodes(episodes);
}
//ADD EPISODES
//displays the episode on the page after it's html has been created

function displayShowsAndEpisodes(showOrEpisodes) {
  showOrEpisodes.forEach((showOrEpisode) => {
    rootElem.innerHTML += displayEpisode(showOrEpisode);
    if (showOrEpisodes === shows) {
      displayNumberOfShows.innerHTML = `<p>Displaying ${showOrEpisodes.length} shows</p>`;
    } else {
      displayNumberOfShows.innerHTML = `<p>Displaying ${showOrEpisodes.length} episodes</p>`;
    }
  });
}

function padNumbers(episode) {
  return `S${episode.season.toString().padStart(2, 0)}E${episode.number.toString().padStart(2, 0)}`;
}

//creates the html layout for each episode
function displayEpisode(episode) {
  let picture;
  let numbers;
  if (episode.image == undefined) {
    picture = "./images/no-picture-available-icon-1.jpeg";
  } else {
    picture = episode.image.medium;
  }
  let summary = episode.summary;
  if (summary == undefined) {
    summary = "Sorry, there is no summary available.";
  }
  if (episode.season == undefined) {
    numbers = "";
  } else {
    numbers = `<h2>${padNumbers(episode)}</h2>`;
  }
  return `<div class="episode-container"><div class="episode-name-wrapper"><h1 class="episode-name">${episode.name}</h1>${numbers}</div><div class="episode-info"><img src=${picture}><p class="summary">${summary}</p></div><div class="data-origin"><p>This data originally came from <a href="${episode.url}">TVMaze.com</a></p></div></div>`;
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
function selectShow(shows) {
  showSelect.innerHTML = `<option>All Shows</option>${shows
    .sort((a, b) => (a.name.toLowerCase() === b.name.toLowerCase() ? 0 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
    .map((show) => {
      return `<option>${show.name}</option>`;
    })}`;
}
function selectEpisode(episodes) {
  episodeSelect.innerHTML = `<option>All Episodes</option>${episodes.map((episode) => {
    return `<option>${padNumbers(episode)} - ${episode.name}</option>`;
  })}`;
}

showSelect.addEventListener("change", () => {
  const selectedShow = showSelect.options[showSelect.selectedIndex].value;

  shows.forEach((show) => {
    if (show.name.includes(selectedShow)) {
      console.log(selectedShow);

      const showId = show.id;

      getEpisodesFromApi(showId);
    }
  }); if (selectedShow === "All Shows") {
      console.log(selectedShow);
      rootElem.innerHTML = "";
      displayShowsAndEpisodes(shows)
    }  
});

episodeSelect.addEventListener("change", () => {
  const selectedEpisode = episodeSelect.options[episodeSelect.selectedIndex].value;

  if (selectedEpisode === "All Episodes") {
    displayCorrectEpisodes(allEpisodes);
    displayNumberOfShows.innerHTML = `<p>Displaying ${allEpisodes.length} episodes</p>`;
  } else {
    let selected = allEpisodes.filter((episode) => {
      return selectedEpisode.includes(padNumbers(episode));
    });
    displayCorrectEpisodes(selected);
    displayNumberOfShows.innerHTML = "";
  }
});

window.onload = setup;
