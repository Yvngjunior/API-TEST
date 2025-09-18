const fetch = require("node-fetch");
const chalk = require("chalk");
const fs = require("fs");
const { exec } = require("child_process");
const inquirer = require("inquirer");

// Function to display selected fields
const displayFields = (data, selectedKeys) => {
  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      console.log(chalk.yellow(`\nItem ${i + 1}:`));
      selectedKeys.forEach((key) => {
        if (item.hasOwnProperty(key)) {
          console.log(chalk.cyan(key), ":", chalk.magenta(item[key]));
        }
      });
    });
  } else {
    selectedKeys.forEach((key) => {
      if (data.hasOwnProperty(key)) {
        console.log(chalk.cyan(key), ":", chalk.magenta(data[key]));
      }
    });
  }
};

// Ask for API URL
inquirer.prompt([
  {
    type: 'input',
    name: 'apiURL',
    message: 'Enter API URL:'
  }
]).then(async answers => {
  const apiURL = answers.apiURL;

  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    console.log(chalk.blue.bold("\n✅ Full API Response:"));
    console.log(JSON.stringify(data, null, 2));

    // Determine available keys for selection
    let keys = [];
    if (Array.isArray(data)) {
      keys = Object.keys(data[0]);
    } else {
      keys = Object.keys(data);
    }

    // Prompt user to select which keys to display
    inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedKeys',
        message: 'Select keys to display in terminal:',
        choices: keys
      }
    ]).then(selection => {
      displayFields(data, selection.selectedKeys);

      // Ask if user wants to save JSON
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'saveFile',
          message: 'Do you want to save this JSON to a file?'
        }
      ]).then(saveAns => {
        if (saveAns.saveFile) {
          inquirer.prompt([
            {
              type: 'input',
              name: 'fileName',
              message: 'Enter file name (e.g., data.json):'
            }
          ]).then(fileAns => {
            fs.writeFileSync(fileAns.fileName, JSON.stringify(data, null, 2));
            console.log(chalk.blue(`\n✅ JSON saved to ${fileAns.fileName}`));

            // Ask if user wants to open in Neovim
            inquirer.prompt([
              {
                type: 'confirm',
                name: 'openNvim',
                message: 'Open in Neovim now?'
              }
            ]).then(nvimAns => {
              if (nvimAns.openNvim) {
                exec(`nvim ${fileAns.fileName}`, (err) => {
                  if (err) console.error(chalk.red("❌ Error opening Neovim:"), err);
                });
              }
            });
          });
        }
      });
    });

  } catch (err) {
    console.error(chalk.red("\n❌ Error fetching API:"), err);
  }
});
