const rootElem = document.getElementById("root");
const searchBox = document.querySelector("#search-input");
const displayNumberOfShows = document.querySelector(".display-shows");
const episodeSelect = document.querySelector("#select-episodes");

const showSelect = document.querySelector("#select-show");
const shows = getAllShows();

function setup() {
  selectShow(shows);
  searchBox.addEventListener("input", showSearch);
  displayShowsAndEpisodes(shows);
  episodeSelect.style.display = "none";
}
function addBackButton() {
  let goBack = document.createElement("a");
  goBack.innerHTML = "Back to All Shows";
  displayNumberOfShows.appendChild(goBack);
  goBack.addEventListener("click", (e) => {
    e.preventDefault();
    rootElem.innerHTML = "";
    showSelect.style.display = "block";
    return setup();
  });
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
      searchBox.addEventListener("input", episodeSearch);

      addBackButton();
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
      // console.log(h1);
    } else {
      displayNumberOfShows.innerHTML = `<p>Displaying ${showOrEpisodes.length} episodes</p>`;
    }
  });
  let h1 = rootElem.querySelectorAll(".show-link");
  h1.forEach((showTitle) => {
    shows.forEach((show) => {
      if (show.name.includes(showTitle.innerHTML)) {
        const showId = show.id;
        showTitle.addEventListener("click", () => {
          getEpisodesFromApi(showId);
          showSelect.style.display = "none";
        });
      }
    });
  });
}

function padNumbers(episode) {
  return `S${episode.season.toString().padStart(2, 0)}E${episode.number.toString().padStart(2, 0)}`;
}

//creates the html layout for each episode

function displayEpisode(showOrEpisode) {
  let picture;
  let numbers;
  let rating;
  let genre;
  let status;
  let runtime;
  let showName;
  if (showOrEpisode.image == undefined) {
    picture = "./images/no-picture-available-icon-1.jpeg";
  } else {
    picture = showOrEpisode.image.medium;
  }
  let summary = showOrEpisode.summary;
  if (summary == undefined) {
    summary = "Sorry, there is no summary available.";
  }
  
  if (showOrEpisode.season == undefined) {
    numbers = "";
    rating = `<h4>Rated:</h4>${showOrEpisode.rating.average}`;
    genre = `<h4>Genres:</h4>${showOrEpisode.genres}`;
    status = `<h4>Status:</h4>${showOrEpisode.status}`;
    runtime = `<h4>Runtime:</h4>${showOrEpisode.runtime}`;
    showDisplay = `display-shows`;
    showName = `<h1 class="episode-name show-link">${showOrEpisode.name}</h1>`;
  } else {
    numbers = `<h2>${padNumbers(showOrEpisode)}</h2>`;
    rating = "";
    genre = "";
    status = "";
    runtime = "";
    showDisplay = "";
    showName = `<h1 class="episode-name">${showOrEpisode.name}</h1>`;
  }

  return `
  <div class="episode-info-wrapper">
  <div class="episode-name-wrapper">${showName}${numbers}
    <div class="episode-container ${showDisplay}">
      <img class="episode-image" src=${picture} />
      <p class="summary">${summary.substring(3, 150)}</p>
      <div class="extra-info">${rating}${genre.split(",").join(", ")}${status}${runtime}
      </div>
    </div>
  </div>
  <p class="data-origin">This data originally came from <a href="${showOrEpisode.url}">TVMaze.com</a></p>
  </div>`;
}

//SEARCH
function showSearch(e) {
  const searchString = e.target.value.toLowerCase();
  const filteredShows = shows.filter((show) => {
    return (
      show.name.toLowerCase().includes(searchString) ||
      show.genres.forEach((genre) => genre.toLowerCase().includes(searchString)) ||
      show.summary.toLowerCase().includes(searchString)
    );
  });
  displayCorrectEpisodes(filteredShows);
  displayNumberOfShows.innerHTML = `<p>Displaying ${filteredShows.length}/${shows.length} shows</p>`;
}

function episodeSearch(e) {
  const searchString = e.target.value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name.toLowerCase().includes(searchString) || episode.summary.toLowerCase().includes(searchString);
  });
  displayCorrectEpisodes(filteredEpisodes);
  displayNumberOfShows.innerHTML = `<p>Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes</p>`;
}

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
      const showId = show.id;
      getEpisodesFromApi(showId);
    }
  });
  if (selectedShow === "All Shows") {
    rootElem.innerHTML = "";
    selectShow(shows);
    searchBox.addEventListener("input", showSearch);
    displayShowsAndEpisodes(shows);
    episodeSelect.style.display = "none";
  }
});

episodeSelect.addEventListener("change", () => {
  const selectedEpisode = episodeSelect.options[episodeSelect.selectedIndex].value;

  if (selectedEpisode === "All Episodes") {
    displayCorrectEpisodes(allEpisodes);
    displayNumberOfShows.innerHTML = `<p>Displaying ${allEpisodes.length} episodes</p>`;
    addBackButton();
  } else {
    let selected = allEpisodes.filter((episode) => {
      return selectedEpisode.includes(padNumbers(episode));
    });
    displayCorrectEpisodes(selected);
    displayNumberOfShows.innerHTML = "";
    addBackButton();
  }
});

window.onload = setup;
