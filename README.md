## Skeleton aka boilerplate for react and threejs (WebGL) scene based app/game/experiment

### Running the game
1) `npm i` - first install dependencies  
2) `npm start` - just start the webpack and dev server

### Features
- gui
- shaders
- scenes
- loading
- saving
- stats
- code splitting
- reselect selectors for performance

### Small things
- Game pause
- Game preloader

### TODO:
- Player object?
- Add way to include shaderpass
- Inventory
- Eject from create-react-app
- Add src to path lookup to avoid `../../xx` imports
- Set up dev/prod environmental builds
- Deploy to Zeit's `now` to share your experiments with folks

### Done:
- ~~Routing~~
- ~~Use store for storing some data across scenes~~
- ~~Per scene loading, changing levels don't break the game.~~
- ~~Properly render scene canvases, dont change dom~~