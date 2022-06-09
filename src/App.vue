<template>
  <div id="app" class="playing-field">
    <div class="playing-field__header">
      <Modal
        class="playing-field__modal"
        :nameOfWinner="nameOfWinner"
        :isActiveModal="isActiveModal"
        :isActiveModalInput="isActiveModalInput"
        @modalOpenClose="modalOpenClose()"
        @inputModal="nameUser=$event"
      ></Modal>
      <div class="playing-field__title">Морской бой</div>
    </div>
    <div class="playing-field__body">
      <div class="playing-field__main">
        <div class="playing-field__name">{{ nameComputer }}</div>
        <logs
          class="playing-field__logs"
          :coordinate-logs="logsGamer"
          :key="logsKeyGamer"
        ></logs>
        <battleground
          class="playing-field__battleground"
          :key="battlegroundKeyComputer"
          :callsign='CALLSING_COMPUTER'
          :cells-data=" cellsComputer"
          :event-happened="eventHappened"
          @setCellsData="setCellsData($event, CALLSING_COMPUTER)"
          @shipsData="shipsDataRecording($event, CALLSING_COMPUTER)"
          @shotFireUser="shotFireUser($event)"
        >
        </battleground>
      </div>
      <div class="playing-field__buttons">
        <button class="playing-field__button" @click="startOver">Новый бой</button>
        <button class="playing-field__button" @click="modalOpenClose()">Изменить имя</button>
      </div>
      <div class="playing-field__main">
        <div class="playing-field__name">{{ nameUser }}</div>
        <battleground
          class="playing-field__battleground"
          :key="battlegroundKeyGamer"
          :callsign="CALLSING_GAMER"
          :cells-data="cellsGamer"
          :event-happened="eventHappened"
          @setCellsData="setCellsData($event, CALLSING_GAMER)"
          @shipsData="shipsDataRecording($event, CALLSING_GAMER)"
        >
        </battleground>
        <logs
          class="playing-field__logs"
          :coordinate-logs="logsComputer"
          :key="logsKeyComputer"
        ></logs>
      </div>
    </div>
  </div>
</template>

<script>
const SIZE_SEA = store.fieldSize.width * store.fieldSize.height;
import Battleground from "./component/Battleground";
import Modal from "./component/Modal";
import Logs from "./component/Logs";
import store from "./store/store";

export default {
  components: {Battleground, Modal, Logs},
  name: "app",
  data() {
    return {
      cellsGamer: {},
      cellsComputer: {},
      gameOver: false,
      isModal: true,
      battlegroundKeyGamer: -1,
      battlegroundKeyComputer: 1,
      logsKeyGamer: -3,
      logsKeyComputer: 3,
      eventHappened: {GAMER: false, COMPUTER: false},
      shipsDataGamer: {},
      shipsDataComputer: {},
      compII: {
        wounded: false,
        coordinate: 0,
      },
      nameUser: 'John Rackham',
      nameComputer: 'Captain Disolm',
      nameOfWinner: '',
      isActiveModal: true,
      isActiveModalInput: true,
      logsGamer: {},
      logsComputer: {},
      counterOfKilledShipsGamer: 0,
      counterOfKilledShipsComputer: 0,
    };
  },
  created() {
    this.CALLSING_GAMER = store.callsign.GAMER;
    this.CALLSING_COMPUTER = store.callsign.COMPUTER;
  },
  methods: {
    startOver() {
      this.cellsGamer = {};
      this.cellsComputer = {};
      this.gameOver = false;
      this.battlegroundKeyGamer -= 1;
      this.battlegroundKeyComputer += 1;
      this.eventHappened = {GAMER: false, COMPUTER: false};
      this.compII = {wounded: false, coordinate: 0};
      this.logsGamer = {};
      this.logsComputer = {};
      this.counterOfKilledShipsGamer = 0;
      this.counterOfKilledShipsComputer = 0;
    },
    setCellsData(data, callsign) {
      if (callsign === store.callsign.COMPUTER) {
        this.cellsComputer = Object.assign(data);
      } else {
        this.cellsGamer = Object.assign(data);
      }
      this.eventHappened[callsign] = !this.eventHappened[callsign];
    },
    shotFireUser(cell) {
      if (this.counterOfKilledShipsGamer === Object.keys(this.shipsDataGamer).length
        || this.counterOfKilledShipsComputer === Object.keys(this.shipsDataComputer).length) {
        return
      }

      //Поиск какому кораблю принадлежит попадание
      if (cell.status === store.statusCells.shipsComp) {
        //Поиск какому кораблю принадлежит попадание

        for (let i = 0; i < Object.keys(this.shipsDataComputer).length; i++) {
          if (this.shipsDataComputer[i].shipAddress.indexOf(cell.id) >= 0) {
            this.shipsDataComputer[i].numberOfHits++;
            if (this.shipsDataComputer[i].numberOfHits === this.shipsDataComputer[i].SIZE) {
              this.shipsDataComputer[i].afloat = false;
              this.counterOfKilledShipsComputer += 1;
            } else {
              this.cellsComputer[cell.id].status = store.statusCells.wounded
            }
          }
          //Прорисовка потопленного корабля
          if (!this.shipsDataComputer[i].afloat) {
            for (let j = 0; j < this.shipsDataComputer[i].shipAddress.length; j++) {
              this.cellsComputer[this.shipsDataComputer[i].shipAddress[j]].status = store.statusCells.killed
            }
            for (let j = 0; j < this.shipsDataComputer[i].nearShipAddress.length; j++) {
              this.cellsComputer[this.shipsDataComputer[i].nearShipAddress[j]].status = store.statusCells.blunder
            }
          }
        }
        this.recordLogs(cell, this.logsGamer, store.statusShot.wounded);
        this.logsKeyGamer += 1
        this.battlegroundKeyComputer += 1;
      } else {
        this.cellsComputer[cell.id].status = store.statusCells.blunder;
        this.recordLogs(cell, this.logsGamer, store.statusShot.blunder);
        this.logsKeyGamer += 1
        this.battlegroundKeyComputer += 1;
        this.shotFireComputer()
      }
    },
    shotFireComputer() {
      if (this.counterOfKilledShipsGamer === Object.keys(this.shipsDataGamer).length
        || this.counterOfKilledShipsComputer === Object.keys(this.shipsDataComputer).length) {
        return
      }
      let coordinate = 0;
      const step = [store.fieldSize.width, 1, -store.fieldSize.width, -1]

      if (this.compII.wounded) {
        outer:
          for (let i = 1; i < store.ships[0].SIZE + 1; i++) {
            for (let j = 0; j < step.length; j++) {
              coordinate = this.compII.coordinate + step[j] * i;
              if (coordinate < store.fieldSize.width
                || coordinate % store.fieldSize.height === 0
                || coordinate >= SIZE_SEA) {
              } else if (this.cellsGamer[coordinate].status === store.statusCells.shipsUser
                || this.cellsGamer[coordinate].status === store.statusCells.initial) {
                break outer;
              }
            }
          }
      } else {
        coordinate = Math.floor(Math.random() * (SIZE_SEA - 1));
      }

      const cell = this.cellsGamer[coordinate];
      if (cell.status === store.statusCells.shipsUser) {
        this.compII.wounded = true;
        //Поиск какому кораблю принадлежит попадание
        for (let i = 0; i < Object.keys(this.shipsDataGamer).length; i++) {
          if (this.shipsDataGamer[i].shipAddress.indexOf(cell.id) >= 0) {
            this.shipsDataGamer[i].numberOfHits++;
            if (this.shipsDataGamer[i].numberOfHits === this.shipsDataGamer[i].SIZE) {
              this.shipsDataGamer[i].afloat = false;
              this.counterOfKilledShipsGamer += 1;
            } else {
              this.cellsGamer[cell.id].status = store.statusCells.wounded
              this.compII.coordinate = coordinate;
            }
          }
          //Прорисовка потопленного корабля
          if (!this.shipsDataGamer[i].afloat && !this.shipsDataGamer[i].paintedSunkenShip) {
            this.compII.wounded = false;
            for (let j = 0; j < this.shipsDataGamer[i].shipAddress.length; j++) {
              this.cellsGamer[this.shipsDataGamer[i].shipAddress[j]].status = store.statusCells.killed
            }
            for (let j = 0; j < this.shipsDataGamer[i].nearShipAddress.length; j++) {
              this.cellsGamer[this.shipsDataGamer[i].nearShipAddress[j]].status = store.statusCells.blunder
            }
            this.shipsDataGamer[i].paintedSunkenShip = true;
          }
        }
        this.recordLogs(cell, this.logsComputer, store.statusShot.wounded);
        this.logsKeyComputer -= 1
        this.battlegroundKeyGamer -= 1;
        this.shotFireComputer()
      } else if (cell.status === store.statusCells.initial) {
        this.cellsGamer[cell.id].status = store.statusCells.blunder;
        this.recordLogs(cell, this.logsComputer, store.statusShot.blunder);
        this.logsKeyComputer -= 1
        this.battlegroundKeyGamer -= 1;
      } else {
        this.shotFireComputer();
      }
    },

    shipsDataRecording(data, callsign) {
      if (callsign === store.callsign.GAMER) {
        this.shipsDataGamer = Object.assign(data);
      } else {
        this.shipsDataComputer = Object.assign(data);
      }
    },
    recordLogs(cell, logsData, statusShot) {
      const ID = Object.keys(logsData).length;
      logsData[ID] = Object.assign({}, {
        step: ID + 1,
        id: ID,
        textAddres: cell.textAddres,
        numAddres: cell.numAddres,
        typeShot: statusShot,
      })
    },

    modalOpenClose(activeInput = true) {
      this.isActiveModalInput = activeInput;
      this.isActiveModal = !this.isActiveModal;
    },
  },
  watch: {
    counterOfKilledShipsGamer() {
      if (this.counterOfKilledShipsGamer === Object.keys(this.shipsDataComputer).length) {
        this.nameOfWinner = this.nameUser
        this.modalOpenClose(false);
      }
    },
    counterOfKilledShipsComputer() {
      if (this.counterOfKilledShipsComputer === Object.keys(this.shipsDataGamer).length) {
        this.nameOfWinner = this.nameComputer
        this.modalOpenClose(false);
      }
    }
  }
};
</script>

<style scoped>
.playing-field {
  width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.playing-field__header {
}

.playing-field__title {
  text-align: center;
  font-size: 2em;
  margin: 10px;
}

.playing-field__modal {
  display: block;
  position: absolute;
}

.playing-field__body {
  display: flex;
  padding-top: 20px;
}

.playing-field__main {
  display: grid;
}

.playing-field__name {
  font-size: 1.5em;
  text-align: center;
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

.playing-field__battleground {
  display: block;
}

.playing-field__buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playing-field__button {
  display: block;
  margin: 20px 0;
  border-radius: 3px;
}
</style>
