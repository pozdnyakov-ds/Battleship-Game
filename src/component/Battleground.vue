<template>
  <div class="wrapper">
    <div class="polygon">
      <div
        class="polygon__td"
        v-for="cell in fieldCreation"
        :key="cell.id"
      >
        <cell
          class="td__flex"
          :name="cell.name"
          :id="cell.id"
          :status="cell.status"
          :callsign="callsign"
          @shotFire="shotFireUser(cell)"
        >
        </cell>
      </div>
    </div>
  </div>
</template>

<script>
const SIZE_SEA = store.fieldSize.width * store.fieldSize.height;
const NUMBER_OF_SHIP_TYPES = Object.keys(store.ships).length

import Cell from "./Cell";
import store from "../store/store";

export default {
  components: {Cell},
  props: {
    callsign: {
      type: String,
      required: true,
    },
    cellsData: {
      type: [Object, Array],
      required: true,
    },
    eventHappened: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      nameColumn: "АБВГДЕЖЗИК",
    };
  },
  computed: {
    //создаётся поле с координатной сеткой и ID
    fieldCreation() {
      const arrayCells = {};
      for (let s = 0; s < SIZE_SEA; s++) {
        const data = {};
        data.id = s;
        if (this.cellsData[s]) {
          data.status = this.cellsData[s].status;
          data.typeShot = this.cellsData[s].typeShot;
        } else {
          data.status = store.statusCells.initial;
          data.typeShot = '';
        }
        data.urlIcon = '';
        //записываем числа в координатную сетку
        if (s < store.fieldSize.width && s !== 0) {
          data.name = this.nameColumn[s - 1];
          data.status = store.statusCells.nameTD;
        } else {
          data.name = '';
        }
        //записываем буквы в координатную сетку
        if (s % store.fieldSize.height === 0 && s !== 0) {
          data.name = s / store.fieldSize.height;
          data.status = store.statusCells.nameTD;
        }
        if (s === 0) {
          data.status = store.statusCells.nameTD;
        }
        data.numAddres = Math.floor(s / store.fieldSize.width);
        data.textAddres = this.nameColumn[Math.floor(s - data.numAddres * store.fieldSize.width) - 1]
        arrayCells[s] = Object.assign(data);
      }
      if (!this.cellsData[0]) {
        const shipsData = this.placementOfShips();
        const NUMBER_OF_SHIP_DATA = Object.keys(shipsData).length

        for (let i = 0; i < NUMBER_OF_SHIP_DATA; i++) {
          for (let j = 0; j < shipsData[i].SIZE; j++) {
            if (this.callsign === store.callsign.GAMER) {
              arrayCells[shipsData[i].shipAddress[j]].status = store.statusCells.shipsUser;
            } else {
              arrayCells[shipsData[i].shipAddress[j]].status = store.statusCells.shipsComp;
            }
          }
        }
        this.$emit("setCellsData", arrayCells)
        this.$emit("shipsData", shipsData)
      }
      return arrayCells
    },
  },
  methods: {
    placementOfShips() {
      const shipsData = {};
      //массив запрещённых координат
      const closedCoordinates = [];
      for (let i = 0; i < SIZE_SEA; i++) {
        if (i < store.fieldSize.width || i % store.fieldSize.height === 0) {
          closedCoordinates.push(i)
        }
      }
      let shipNum = 0;
      for (let i = 0; i < NUMBER_OF_SHIP_TYPES; i++) {
        for (let j = 0; j < store.ships[i].QUANTITY; j++) {
          drawShipsOne(store.ships[i].SIZE, shipNum)
          shipNum++;
        }
      }

      function drawShipsOne(lengthShips, shipNum) {
        // расстановка кораблей с перебором модификаций и кол-ва
        //поиск случайной координаты
        const coordinate = Math.floor(Math.random() * (SIZE_SEA - 1));
        //расположение корабля (вертикальное или горизонтальное)
        let vector = [-store.fieldSize.width, -1, 1, store.fieldSize.width];
        // Выбор куда будет плыть корабль (вверх, вправо, вниз, вправо)
        vector = vector[Math.floor(Math.random() * vector.length)];

        //Проверка на допустимость расположения корабля
        const bufferShipAddress = [];
        const bufferNearShipAddress = [];
        for (let i = 0; i < lengthShips; i++) {
          if (closedCoordinates.indexOf(coordinate + vector * i) >= 0 ||
            (coordinate + vector * i) < 0 ||
            (coordinate + vector * i) >= SIZE_SEA) {
            return drawShipsOne(lengthShips, shipNum);
          } else {
            closedCoordinates.push(coordinate + vector * i);
            bufferShipAddress.push(coordinate + vector * i);
          }
        }
        //Координаты вокруг корабля
        let tempArr = [];
        for (let i = 0; i < bufferShipAddress.length; i++) {
          tempArr.push(bufferShipAddress[i] + -1,
            bufferShipAddress[i] + 1,
            bufferShipAddress[i] + -store.fieldSize.width,
            bufferShipAddress[i] + store.fieldSize.width,
            bufferShipAddress[i] - 1 - store.fieldSize.width,
            bufferShipAddress[i] + 1 - store.fieldSize.width,
            bufferShipAddress[i] - 1 + store.fieldSize.width,
            bufferShipAddress[i] + 1 + store.fieldSize.width);
        }
        //Убираем лишние
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i] > store.fieldSize.width
            && tempArr[i] < SIZE_SEA
            && tempArr[i] % store.fieldSize.width !== 0
            && bufferShipAddress.indexOf(tempArr[i]) === -1
          ) {
            bufferNearShipAddress.push(tempArr[i]);
          }
        }
        closedCoordinates.push(...bufferNearShipAddress);
        shipsData[shipNum] = Object.assign({}, {
          shipAddress: bufferShipAddress,
          nearShipAddress: bufferNearShipAddress,
          SIZE: lengthShips,
          afloat: true,
          paintedSunkenShip: false,
          numberOfHits: 0,
        })
      }
      return shipsData;

    },

    shotFireUser(cell) {
      this.$emit('shotFireUser', cell);
    },
  },

};
</script>

<style scoped>
.polygon {
  display: grid;
  grid-template: repeat(11, 1fr) / repeat(11, 1fr);

  margin: 10px;
  padding: 5px;
  border: 3px groove #006363;
  border-radius: 3px;
  background-color: #33cccc;
  cursor: crosshair;
}

.polygon__td {
  width: 100%;
  height: 100%;
}
</style>
