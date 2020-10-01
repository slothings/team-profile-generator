const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

async function init() {
    console.log("Let's get a team set up!");

    let teamHTML = "";
    let teamSize;

    await inquirer.prompt(
        {
            type: "number",
            message: "How many members are on your team?",
            name: "teamMemberSize"
        }
    ).then((data) => {
        teamSize = data.teamMemberSize + 1;
    });
    if (teamSize === 0) {
        console.log("Your team has no members :(");
        return;
    }
    for (i = 1; i < teamSize; i++) {
        let name;
        let id;
        let title;
        let email;

        await inquirer.prompt([
            {
                type: "input",
                message: "What is employee " + [i] +"'s name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is employee " + [i] +"'s id?",
                name: "id"
            },
            {
                type: "input",
                message: "What is employee " + [i] + "'s email?",
                name: "email"
            },
            {
                type: "input",
                message: "What is employee " + [i] +"'s title?",
                name: "title",
                choices: ["Engineer", "Intern", "Manager"]
            }
        ]).then((data) => {
            name = data.name;
            id = data.id;
            title = data.title;
            email = data.email;
        });

        switch (title) {
            case "Manager":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Manager's Office Number?",
                        name: "officeNumber"
                    }
                ]).then((data) => {
                    const manager = new Manager(name, id, email, data.officeNumber);

                    teamMember = fs.readFileSync("templates/manager.html");

                    teamHTML = teamHTML + "\n" + eval("`" + teamMember + "`");
                });
                break;

            case "Intern":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What school is your Intern from?",
                        name: "school"
                    }
                ]).then((data) => {
                    const intern = new Intern(name, id, email, data.school);
                    teamMember = fs.readFileSync("templates/intern.html");
                    teamHTML = teamHTML + "\n" + eval("`" + teamMember + "`");
                });
                break;

            case "Engineer":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Engineer's GitHub?",
                        name: "github"
                    }
                ]).then((data) => {
                    const engineer = new Engineer(name, id, email, data.github);
                    teamMember = fs.readFileSync("templates/engineer.html");
                    teamHTML = teamHTML + "\n" + eval("`" + teamMember + "`");
                });
                break;
        }
    }

    const mainHTML = fs.readFileSync("templates/main.html");

    teamHTML = eval("`" + mainHTML + "`");

    fs.writeFile("output/team.html", teamHTML, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("Works!");
    });
}

init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```