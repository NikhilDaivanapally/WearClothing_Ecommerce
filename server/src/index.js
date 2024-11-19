const connectDB = require("../src/db/connectToMysql");
const app = require("./app");
require("dotenv").config({ path: "./env" });

connectDB
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running on  http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Mysql db connect failed", err));
 