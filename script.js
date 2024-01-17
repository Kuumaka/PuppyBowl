// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2310-FSA-ET-WEB-PT-SF-B";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(API_URL + "/players");
    const result = await response.json();
    return result.data.players; // Return the array of player objects
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(API_URL + `/players/${playerId}`);
    const result = await response.json();
    return result.data.player; // Return the player object
  } catch (err) {
    console.error(`Uh oh, trouble fetching player #${playerId}!`, err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const result = await response.json();
    return result.data; // Return the player object
  } catch (err) {
    console.error("Uh oh, something went wrong with adding that player!", err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result; // Return the result of the deletion
  } catch (err) {
    console.error(`Uh oh, trouble removing player #${playerId} from the roster!`, err);
    throw err; // Rethrow the error to be handled by the caller
  }
};

/**
 * Updates `<main>` to display a list of all players.
 * If there are no players, a corresponding message is displayed instead.
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const mainElement = document.querySelector("main");
  mainElement.innerHTML = ""; // Clear the current contents of <main>

  if (playerList.length === 0) {
    mainElement.innerHTML = "<p>No players available.</p>";
    return;
  }

  playerList.forEach((player) => {
    const playerCard = document.createElement("div");
    playerCard.classList.add("player-card");
  
    // Display player information
    playerCard.innerHTML = `
      <h2>${player.name}</h2>
      <p>ID: ${player.id}</p>
      <img src="${player.imageUrl}" alt="${player.name}">
      <button class="details-button" data-player='${JSON.stringify(player)}'>
        See details
      </button>
      <button class="remove-button" data-player-id="${player.id}">
        Remove from roster
      </button>
    `;
  
    // Add event listeners
    playerCard.querySelector('.details-button').addEventListener('click', (event) => {
      const clickedPlayer = JSON.parse(event.target.dataset.player);
      renderSinglePlayer(clickedPlayer);
    });

    playerCard.querySelector('.remove-button').addEventListener('click', (event) => {
      const playerIdToRemove = event.target.dataset.playerId;
      removeRender(playerIdToRemove);
    });
  
    mainElement.appendChild(playerCard);
  });
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const mainElement = document.querySelector("main");
  mainElement.innerHTML = ""; // Clear the current contents of <main>

  const playerCard = document.createElement("div");
  playerCard.classList.add("player-card");

  // Display single player information
  playerCard.innerHTML = `
    <h2>${player.name}</h2>
    <p>ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <img src="${player.imageUrl}" alt="${player.name}">
    <p>Team: ${player.teamName || "Unassigned"}</p>
    <button class="back-button" id="backButton">
      Back to all players
    </button>
  `;

  // Add event listener for the "Back to all players" button
  playerCard.querySelector('#backButton').addEventListener('click', async() => {
    await init();
  });

  mainElement.appendChild(playerCard);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  const formElement = document.getElementById("new-player-form");
  formElement.innerHTML = ""; // Clear the current contents of the form

  // Display new player form
  formElement.innerHTML = `
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="breed">Breed:</label>
    <input type="text" id="breed" name="breed" required>
    <label for="imageBox">Image URL:</label>
    <input type="text" id="imageBox" name="imageBox" required>
    <button type="button" id="addPlayerButton">Add New Player</button>
  `;

  // Add event listener for the "Add New Player" button
  formElement.querySelector('#addPlayerButton').addEventListener('click', async () => {
    await submitNewPlayerForm();
  });
};

/**
 * Function to handle form submission
 */
const submitNewPlayerForm = async () => {
  const nameInput = document.getElementById("name");
  const breedInput = document.getElementById("breed");
  const imageInput = document.getElementById("imageBox");

  const newPlayer = {
    name: nameInput.value,
    breed: breedInput.value,
    imageUrl: imageInput.value,
  };

  try {
    // Call addNewPlayer and fetch all players
    await addNewPlayer(newPlayer);
    const updatedPlayerList = await fetchAllPlayers();
    
    // Render all players and the new player form
    renderAllPlayers(updatedPlayerList);
    renderNewPlayerForm();
  } catch (err) {
    console.error("Error submitting new player form:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
};


/**
 * Function to handle removal and re-rendering
 */
const removeRender = async (playerId) => {
  await removePlayer(playerId);
  const players = await fetchAllPlayers();
  await renderAllPlayers(players);
  await renderNewPlayerForm();
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
