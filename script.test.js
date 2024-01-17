const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;

  beforeAll(async () => {
     players = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    console.log(players);
    // Ensure that players is an array
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    // Check if the response is an array before using forEach
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

describe("addNewPlayer", () => {
  // Make the API call once before all the tests run
  let newPlayer = {
    name: "Cody Morales",
    breed: "Poodle"
  };
  beforeAll(async () => {
    preCount = await fetchAllPlayers();
    player = await addNewPlayer(newPlayer);
    postCount = await fetchAllPlayers();
  });

  test("playerCount should be increased by 1", async () => {
      expect(preCount.length + 1).toBe(postCount.length)
  });

  afterAll(async () => {
    await removePlayer(player.id)
  });
});

describe("fetchSinglePlayer", () => {
  // Make the API call once before all the tests run
  let player;
  beforeAll(async () => {
    player = await fetchSinglePlayer(5617);
  });

  test("returnSingePlayer", async () => {
    expect(player).toBeTruthy()
  });

  test("returns players with name and id", async () => {
    expect(player.name).toBe("Filbert")
    expect(player.breed).toBe("Shetland Sheepdog / Border Collie")
  });
});