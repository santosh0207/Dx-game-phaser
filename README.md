# Phaser Dx game

## Game Features

- You can change the number of Grid By passing arguments in "gridDiscription" function. By default its 8x4 grid.
- You can have multiple power grids with "advantage" and "disadvantage", By providing number argumnts to the function "assignPowerupGrid(2,3)", 2 => advantages, 3 => disdantages. By default its one one.
- The normal tile is shown by blue color, advantage tile is in green color and disadvantage color is in red.
- The ball color for advantages and disadvantages is also same as above.
- Once you collect the advantage ball, your platform size gets increased by 1.5 times of current.
- Once you collect the disadvantage ball, the ball speed increases by 50% of current speed.
- once your ball goes out bound, you looses on life and the ball speed and platform lenght resets to original size.
- Initial speed of the ball is 100, and can be changed by accessing speed variable in "src/objects/Ball.js" file.

# Setup

You'll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

`git clone https://github.com/lean/phaser-es6-webpack.git`

## 2. Install node.js and npm:

https://nodejs.org/en/

## 3. Install dependencies (optionally you can install [yarn](https://yarnpkg.com/)):

Navigate to the cloned repo's directory.

Run:

`npm install`

or if you chose yarn, just run `yarn`

## 4. Run the development server:

Run:

`npm run dev`

This will run a server so you can run the game in a browser. It will also start a watch process, so you can change the source and the process will recompile and refresh the browser automatically.

To run the game, open your browser and enter http://localhost:3000 into the address bar.
