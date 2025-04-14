import fetch from "node-fetch"; // Import node-fetch

const url = 'https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:100){grids{value,solution,difficulty}}}';

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Access the grids array
    const grids = data.newboard.grids;
    // console.log(grids[0].difficulty)

    // Filter for medium difficulty puzzles
    const mediumPuzzles = grids.filter(grid => grid.difficulty === 'Medium');

    console.log('Medium Difficulty Puzzles:', mediumPuzzles);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
