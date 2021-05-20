const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "covid19India.db");
const app = express();
let db = null;

const DbAndServerInitialization = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("running");
    });
  } catch (e) {
    console.log(e.message);
  }
};

DbAndServerInitialization();

app.get("/states/", async (request, response) => {
  const selectQuery = `select state_name from state`;
  const result = await db.all(selectQuery);
  response.send(result);
});

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const selectQuery = `select state_name from state where state_id=${stateId}`;
  const result = await db.all(selectQuery);
  response.send(result);
});

app.post("/districts/", async (request, response) => {
  const { stateId, districtName, cases, cured, active, deaths } = request.body;
  const postDistrictQuery = `
  INSERT INTO
    district (state_id, district_name, cases, cured, active, deaths)
  VALUES
    (${stateId}, '${districtName}', ${cases}, ${cured}, ${active}, ${deaths});`;
  await db.run(postDistrictQuery);
  response.send("District Successfully Added");
});
