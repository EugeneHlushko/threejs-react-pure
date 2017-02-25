# WebGL boilerplate for scene based experiments powered by React ES6/ES7 and Three.js 

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
- Game pre loader
- Shader multi-pass system (TBD)
- Tests covering functionality (TBD)

#### Scope of this boilerplate
    - React and three.js
    - Texture pre loading
    - Models pre loading
    - Scene pre loading
    - Player data pre loading
    - Switching between scenes
    - Shader pre loading
    - Multiple shader passes

#### Under consideration to be in scope
    - Player controls, you might not need a player object in the experiments
    - Talking to Server, i will just add dummy methods for sagas
    - Mongo and small api on server side for save/load?

#### Out of scope
    - World Gravity
    - Player/enemy Jumping

#### TODO:
- Intersection between objects
- Dialog: text and options, callback for choice done.
- Player object: TODO: Receive Model from modeler;
- Player movement: move over terrain height
- Simple default level switch to next - this requires dialog
- Add way to include shaderpass
- Add a way to preload and use models in scenes for objects
- Reactotron or similar for most convinient redux development experience
- Consider GSAP for tweens
- Inventory
- Eject from create-react-app. Under consideration.
  - Add node-sass, change styles from pure css to scss. Still not sure on this
  - Add more rules for webpack, go with webpack 2. Maybe CRA has it by that time.
  - Extend eslint airbnb config
- Set up dev/prod environmental builds
- Deploy to Zeit's `now` to share your experiments with folks

#### Done:
- ~~Player controls: moving player over the map with wasd~~
- ~~Add src to path lookup to avoid `../../xx` imports~~
- ~~Define scope for BP~~
- ~~Player reducer~~
- ~~Routing~~
- ~~Use store for storing some data across scenes~~
- ~~Per scene loading, changing levels don't break the game.~~
- ~~Properly render scene canvases, dont change dom~~