export default {
  fieldSize: {
    height: 11,
    width: 11,
  },

  statusCells: {
    wounded: 'wounded',
    blunder: 'blunder',
    killed: 'killed',
    shipsUser: 'shipsUser',
    shipsComp: 'shipsComp',
    initial: 'initial',
    nameTD: 'nameTD',
  },

  callsign: {
    GAMER: 'gamer',
    COMPUTER: 'computer',
  },

  ships: {
    0: {
      NAME: 'Battleship',
      SIZE: 4,
      QUANTITY: 1,
    },
    1: {
      NAME: 'Cruiser',
      SIZE: 3,
      QUANTITY: 2,
    },
    2: {
      NAME: 'Submarine',
      SIZE: 2,
      QUANTITY: 3,
    },
    3: {
      NAME: 'Destroyer',
      SIZE: 1,
      QUANTITY: 4,
    },
  },
  statusShot: {
    wounded: '+',
    blunder: '-',
  },

  modalText: {
    greetings: 'Игра Морской бой приветствует Вас',
    gameOver: 'GAME OVER',
    gameVictory: 'Игра окончена, выиграл: '
  }

}
