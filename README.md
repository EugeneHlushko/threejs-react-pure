# WebGL boilerplate for experiments powered by React ES7/ES7 and Three.js 

### Running the boilerplate
1) `npm i` - first install dependencies  
2) `npm start` - just start the webpack and dev server

### Features
- React ES6/ES7 based three.js playground
- gui
- shaders
- scenes
- loading
- saving
- stats
- code splitting and pre-loading
- per scene loading
- reselect selectors for performance

### Small things
- Game pause
- Game preloader

#### Scope of this boilerplate
    - React and three.js
    - Texture pre loading
    - Models pre loading
    - Scene pre loading
    - Player data pre loading
    - Switching between scenes
    - Shader pre loading
    - Multiple shader passes

#### Out of scope for this boilerplate
    - Player controls, you might not need a player object in the experiments
    - Talking to Server, i will just add dummy methods for sagas

#### TODO:
- Player object
- Player controls? is it in scope?
- Simple default level switch to next
- Add way to include shaderpass
- Add a way to preload and use models in scenes for objects
- Consider GSAP for tweens
- Inventory
- Eject from create-react-app. Why?
- Add src to path lookup to avoid `../../xx` imports
- Set up dev/prod environmental builds
- Deploy to Zeit's `now` to share your experiments with folks

#### Done:
- ~~Define scope for BP~~
- ~~Player reducer~~
- ~~Routing~~
- ~~Use store for storing some data across scenes~~
- ~~Per scene loading, changing levels don't break the game.~~
- ~~Properly render scene canvases, dont change dom~~