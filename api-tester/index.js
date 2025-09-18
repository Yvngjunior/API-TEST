// index.js
const fetch = require("node-fetch");
const chalk = require("chalk");

// Utility function to fetch and display JSON
async function getData(url, label) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log(chalk.cyan.bold(`\n=== ${label} ===`));

    if (data.content && data.author) {
      console.log(chalk.yellow(`"${data.content}"`));
      console.log(chalk.green(`– ${data.author}`));
    } else if (data.title && data.url) {
      console.log(chalk.magenta(`Meme: ${data.title}`));
      console.log(chalk.blue(`URL: ${data.url}`));
    } else if (data.quote && data.author) {
      console.log(chalk.yellow(`"${data.quote}"`));
      console.log(chalk.green(`– ${data.author}`));
    } else {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
  } catch (err) {
    console.error(chalk.red("Error fetching:"), err.message);
  }
}

// Test different APIs
(async () => {
  await getData("https://api.quotable.io/random", "Random Quote (Quotable)");
  await getData("https://meme-api.com/gimme", "Random Meme (Meme API)");
  await getData("https://wisdomapi.herokuapp.com/v1/random", "Startup Quote (Wisdom)");
})();
