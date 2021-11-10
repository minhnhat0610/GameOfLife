function seed(a,b) {
  return [a,b];
}

function same(cell1, cell2) {
  return JSON.stringify(cell1) == JSON.stringify(cell2);
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell,state) {
  this.state = state;
  this.cell = cell;
  for(let i = 0 ; i< this.state.length; i++){
    if(cell[0] == state[i][0] && cell[1] == state[i][1]){
      return true
    }
  }

  return false;
}


const printCell = (cell, state) => {
  
  let result = contains.call(this,cell,state);
  if(result){
    return '\u25A3'
  }
  else{
    return '\u25A2'
  }
  
};

const corners = (state = []) => {
  let lowestX, lowestY, highestX, highestY;

  lowestX = state[0][0];
  lowestY = state[0][1];
  highestX = state[0][0];
  highestY = state[0][1];
   if (state) {
     for(let i= 0 ; i <state.length; i++){
        if(state[i][0] < lowestX){
          lowestX = state[i][0]
        }
        if (state[i][1] < lowestY) {
          lowestY = state[i][1]
        }
        if (state[i][0] > highestX) {
          highestX = state[i][0]
        }
        if (state[i][1] > highestY) {
          highestY = state[i][1]
        }
      }

      return {topRight:[highestX, highestY], bottomLeft: [lowestX, lowestY]}
   }

   else{
    return {topRight: [0,0], bottomLeft: [1,1]}
  }
   
};



const printCells = (state) => {
  let retangle = corners(state);
  highestX = retangle.topRight[0];
  highestY = retangle.topRight[1];
  lowestX = retangle.bottomLeft[0];
  lowestY = retangle.bottomLeft[1];
  let result = "";
  for(let i = highestY ; i >= lowestY; i--){
    for(let j = lowestX; j <= highestX; j++){
      result += printCell([j,i],state) + " ";
    }

    result += "\n";

  }

  return result;
};

const getNeighborsOf = (cell) => {
  let result = [];

  let lowestX = cell[0] - 1;
  let highestX = cell[0] + 1;
  let lowestY = cell[1] - 1;
  let highestY = cell[1] + 1;
  
  for(let i = lowestY ; i <= highestY; i++){
    for(let j = lowestX; j <= highestX; j++){
      if (JSON.stringify(cell) != JSON.stringify([j,i])) {
        result.push([j,i]);
      }
    }

  }

  return result;
};

const getLivingNeighbors = (cell, state) => {
  let result = [];
  let neighbors = getNeighborsOf(cell);
  
  for(let i = 0 ; i<neighbors.length; i++){
    if(contains(neighbors[i],state)){
      result.push(neighbors[i]);
    }
  }

  return result;
};

const willBeAlive = (cell, state) => {
  let LivingNeighbor = getLivingNeighbors(cell,state);
  let numberLivingNeighbor = LivingNeighbor.length;
  if (numberLivingNeighbor == 3 || (numberLivingNeighbor == 2 && contains(cell,state))) {
    return true
  }
  else return false
};

const calculateNext = (state) => {
  let aliveNext = [];
  let retangle = corners(state);

  highestX = retangle.topRight[0] + 1;
  highestY = retangle.topRight[1] + 1;
  lowestX = retangle.bottomLeft[0] - 1;
  lowestY = retangle.bottomLeft[1] - 1;

  for(let i = lowestY ; i <= highestY; i++){
    for(let j = lowestX; j <= highestX; j++){
      if (willBeAlive([j,i],state)) {
        aliveNext.push([j,i]);
      }
    }

  }

  return aliveNext;
};

const iterate = (state, iterations) => {
  let nextState = [];
  nextState.push(state);
  for(let i = 0; i< iterations; i++){
    state = calculateNext(state);
    nextState.push(state);
  }
  return nextState;
};

const main = (pattern, iterations) => {
  let gameState = iterate(pattern,iterations);
  let result = "";
  for(let i = 0 ; i <= iterations ;i++){
    result += printCells(gameState[i]);
    result += "\n";
  }

  return result;
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }

  console.log(main(startPatterns.rpentomino, 2));
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;