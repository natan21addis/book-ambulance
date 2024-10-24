const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

const makeCommit = async (n) => {
    if (n === 0) return; // Stop if n reaches 0

    // Import the random-int module
    const { default: randomInt } = await import('random-int');

    // Generate random weeks and days to modify the date
    const weeks = randomInt(0, 54);
    const days = randomInt(0, 6);
    const date = moment().subtract(1, 'year').add(1, 'day').add(weeks, 'weeks').add(days, 'days').toISOString();

    // Create data object
    const data = {
        date: date
    };

    console.log(date);

    // Write the data to the JSON file
    jsonfile.writeFile(FILE_PATH, data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }

        // Add, commit, and push the changes
        simpleGit().add(FILE_PATH)
            .commit('Update date', { '--date': date }, (err) => {
                if (err) {
                    console.error('Error committing:', err);
                    return;
                }

                simpleGit().push((err) => {
                    if (err) {
                        console.error('Error pushing to remote:', err);
                    } else {
                        console.log('Changes pushed successfully!');
                    }

                    // Recursive call to makeCommit with decremented n
                    makeCommit(n - 1);
                });
            });
    });
};

// Start the commit process
makeCommit(100);
