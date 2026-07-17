const mongoose = require("mongoose");
require("dotenv").config();

console.log("Checking environment URI:", process.env.MONGODB_URI);

const passwordsToTest = [
  "JxA4FKytBq83e7dO",
  "JxA4FKytBq83e7d0",
  "Jxa4FKytBq83e7dO",
  "Jxa4FKytBq83e7d0",
  ".JxA4FKytBq83e7dO",
  ".JxA4FKytBq83e7d0",
  ".Jxa4FKytBq83e7dO",
  ".Jxa4FKytBq83e7d0"
];

async function runTests() {
  for (const pw of passwordsToTest) {
    const uri = `mongodb+srv://ankit2914978_db_user:${pw}@cluster0.ch5dcmc.mongodb.net/JobPortal?retryWrites=true&w=majority`;
    console.log(`Testing password: ${pw}...`);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`SUCCESS with password: ${pw}`);
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error(`FAILED with password ${pw}:`, err.message);
    }
  }
  console.log("All password options failed.");
  process.exit(1);
}

runTests();
