document.addEventListener("DOMContentLoaded", () => {
  var gameBS = new Vue({
    el: "#gameBS",
    data: {
      nameUser: "Капитан Джек", //Имя Юзера в начале игры
      nameComp: "Disolm", //Имя компьютера

      valueCellsUser: [], //значение всех ячеек юзера
      valueCellsComputer: [], //значение всех ячеек компьютера

      sunkenShipUser: [], //счётчик потопленных кораблей
      sunkenShipComp: [], //счётчик потопленных кораблей
      valueShipsUser: [], //адреса кораблей
      valueShipsComputer: [], //адреса кораблей
      valueAddsUser: [], //адреса куда ставить корабли нельзя
      valueAddsComputer: [], //адреса куда ставить корабли нельзя

      shipsUser: [], //[потоплен?][координаты корабля][координаты вокруг][длина, число попаданий]
      shipsComp: [],

      blocked: false, // блокировка стрельбы User
      shootingBanUser: [], // адреса куда стрелять нельзя User
      shootingBanComp: [], // адреса куда стрелять нельзя Comp
      timer: 1000, //время на ход компьютера

      isActiveModal: true, //Состояние модального окна
      isActiveModalInput: true, //Состояние модального окна
      textHeaderModal: "Игра Морской бой приветствует Вас", //приветственная надпись
      textGameVictory: "", //Текст во время победы
    },
    methods: {
      //Методы

      // Прорисовка полей Юзера и Компьютера
      drawField: function (player, cells, valueShips, valueAdds, ships) {
        const polygonEl = document.getElementById(player);
        polygonEl.textContent = "";

        const tablet = document.createElement("tablet");
        tablet.classList.add("tablet");

        polygonEl.append(tablet);

        //создание таблицы и заполнение её
        for (let y = 0; y <= 10; y++) {
          const line = [];
          const tr = document.createElement("tr");
          tr.classList.add("tr");
          tr.dataset.y = y;

          for (let x = 0; x <= 10; x++) {
            const td = document.createElement("td");
            td.classList.add("td");
            td.setAttribute("id", "0АБВГДЕЖЗИК"[x] + "-" + String(y));

            Object.assign(td.dataset, { x, y });

            tr.append(td);
            line.push(td);

            if (y == 0 && x != 0) {
              td.textContent = "АБВГДЕЖЗИК"[x - 1];
            }

            if (x == 0 && y != 0) {
              td.textContent = y;
            }

            if (x == 0 || y == 0) {
              td.classList.add("navigation");
            }

            if (player == "polygonComputer" && x != 0 && y != 0) {
              td.classList.add("cursor-pointer");
            }
          }
          tablet.append(tr);
          cells.push(line);
        }
        //вызов функции для создания кораблей
        this.drawShips(cells, valueShips, valueAdds, player, ships);
      },
      //====================================================================================================
      drawShips: function (cells, valueShips, valueAdds, player, ships) {
        // расстановка кораблей с перебором модификаций и кол-ва

        for (let s = 0; s < 10; s++) {
          do {
            // console.log(this.ships[s][1]);
          } while (drawShipsOne(ships[s][3], s));
        }

        // подфункция с проверками на корректность расстановки
        function drawShipsOne(lengthShips, s) {
          //временный буфер если всё ОК, то запишутся в основной массив
          let bufferShips = [];
          let bufferAdds = [];

          //поиск случайной координаты
          const xAdds = Math.floor(1 + Math.random() * 10); //поиск первой координаты х
          const yAdds = Math.floor(1 + Math.random() * 10); //поиск первой координаты у

          //возможность куда может плыть корабль (вверх, вправо, вниз, вправо)
          let vector = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
          ];

          // Выбор куда будет плыть корабль (вверх, вправо, вниз, вправо)
          vector = vector[Math.floor(Math.random() * 4)];

          //Проверка на допустимость расположения корабля
          for (let i = 0; i < lengthShips; i++) {
            //Проверка, что корабль располагается на полигоне
            if (
              xAdds + vector[0] * i <= 0 ||
              xAdds + vector[0] * i > 10 ||
              yAdds + vector[1] * i <= 0 ||
              yAdds + vector[1] * i > 10
            ) {
              // console.log("ошибка установки корабля по приделам поля");
              return true;
            } else if (
              valueAdds.indexOf(
                cells[xAdds + vector[0] * i][yAdds + vector[1] * i].id
              ) >= 0
            ) {
              //Проверка, что корабли не столкнутся
              //  console.log("ошибка установки корабля по наложению");
              return true;
            } else {
              //Если всё хорошо, то запись координат расположения корабля в буфер по id
              bufferShips.push(
                cells[xAdds + vector[0] * i][yAdds + vector[1] * i].id
              );
            }
          }

          valueShips = valueShips.concat(bufferShips); //Запись координат расположения корабля

          //Запись координат вокруг корабля в буфер (если координаты выходят за полигон, то не записываются)
          for (let y = 1; y <= 10; y++) {
            for (let x = 1; x <= 10; x++) {
              if (bufferShips.indexOf(cells[x][y].id) >= 0) {
                for (let p = -1; p <= 1; p++) {
                  if (x + p >= 1 && x + p <= 10) {
                    for (let n = -1; n <= 1; n++) {
                      if (y + n >= 1 && y + n <= 10) {
                        bufferAdds.push(cells[x + p][y + n].id);
                      }
                    }
                  }
                }
              }
            }
          }
          valueAdds = valueAdds.concat(bufferAdds); //Запись координат вокруг корабля в массив функции

          ships[s][1].push(bufferShips);
          ships[s][2].push(bufferAdds);

          return false;
        }

        //прорисовка кораблей на поле и запись основной массив c прорисовкой кораблей на поле
        for (let y = 1; y <= 10; y++) {
          for (let x = 1; x <= 10; x++) {
            if (
              valueShips.indexOf(cells[x][y].id) >= 0 &&
              player == "polygonUser"
            ) {
              cells[x][y].classList.add("ships");
              this.valueShipsUser.push(cells[x][y]);
            } else if (
              valueShips.indexOf(cells[x][y].id) >= 0 &&
              player == "polygonComputer"
            ) {
              this.valueShipsComputer.push(cells[x][y]);
              // cells[x][y].classList.add("ships");
            }
          }
        }
      },
      //=============================================
      //выстрел Юзера
      fireUser: function (eventObject) {
        const addressClick = eventObject.target;

        //Проверка клик в нужные места
        if (
          addressClick.tagName !== "TD" ||
          addressClick.classList.contains("navigation") ||
          this.blocked ||
          this.shootingBanUser.indexOf(addressClick.id) >= 0
        ) {
          return;
        }
        //Если всё ОК, то запись в массив куда потом нажимать нельзя
        this.shootingBanUser.push(addressClick.id);
        // console.log(this.shipsComp)

        //проверка на попадание в корабль
        if (this.valueShipsComputer.indexOf(addressClick) >= 0) {
          // console.log('клик-попадание')
          addressClick.classList.remove("ships");
          addressClick.classList.add("wounded");
          addressClick.innerHTML = "&#128293;";
          this.sunkenShipUser.push(addressClick.id);

          //проверка потоплен ли корабль
          for (let s = 0; s < 10; s++) {
            if (this.shipsComp[s][1][0].indexOf(addressClick.id) >= 0) {
              this.shipsComp[s][4] += 1;
              if (this.shipsComp[s][3] == this.shipsComp[s][4]) {
                this.shipsComp[s][0] = true;
                this.borderShipDraw(
                  this.shipsComp,
                  this.valueCellsComputer,
                  this.shootingBanUser                  
                );
              }
            }
          }
        } else {
          // console.log('клик-промах')
          addressClick.classList.add("blunder");
          addressClick.innerHTML = "&#8779";
          //Бан на повторный выстрел
          this.blocked = true;
          //Если промах, то стреляет компьютер
          setTimeout(this.fireComputer, this.timer);
        }
        //Если все корабли подбиты, то конец игры
        if (this.sunkenShipUser.length == 20) {
          this.modalOpenClose("Victory", this.nameUser, false);
        }
      },
      //выстрел компьютера

      fireComputer: function () {
        //Поиск координат куда будет выстрел и проверка можно ли туда стрелять
        let xAdds;
        let yAdds;
        do {
          xAdds = Math.floor(1 + Math.random() * 10); //поиск координаты выстрела х
          yAdds = Math.floor(1 + Math.random() * 10); //поиск координаты выстрела у
          if (this.shootingBanComp.length >= 100) {
            return console.log("Конец игры");
          }
        } while (
          this.shootingBanComp.indexOf(this.valueCellsUser[xAdds][yAdds].id) >=
          0
        );
        const addressClick = this.valueCellsUser[xAdds][yAdds];
        //Если всё ОК, то запись в массив куда потом нажимать нельзя

        this.shootingBanComp.push(addressClick.id);

        //проверка на попадание в корабль
        if (this.valueShipsUser.indexOf(addressClick) >= 0) {
          // console.log('клик-попадание')
          addressClick.classList.remove("ships");
          addressClick.classList.add("wounded");
          addressClick.innerHTML = "&#128293;";
          this.sunkenShipComp.push(addressClick.id);

          //проверка потоплен ли корабль
          for (let s = 0; s < 10; s++) {
            if (this.shipsUser[s][1][0].indexOf(addressClick.id) >= 0) {
              this.shipsUser[s][4] += 1;
              if (this.shipsUser[s][3] == this.shipsUser[s][4]) {
                this.shipsUser[s][0] = true;
                this.borderShipDraw(
                  this.shipsUser,
                  this.valueCellsUser,
                  this.shootingBanComp                  
                );
              }
            }
          }

          //Если попадание, то повторный выстрел
          setTimeout(this.fireComputer, this.timer);
        } else {
          // console.log('клик-промах')
          addressClick.classList.add("blunder");
          addressClick.innerHTML = "&#8779";
          //Если все корабли подбиты, то конец игры
          if (this.sunkenShipComp.length == 20) {
            this.modalOpenClose("GAME OVER", this.nameComp, false);
          }
        }
        //Снятие бана на выстрел юзера
        this.blocked = false;
      },
      //Прорисовка клеток вокруг потопленного корабля
      borderShipDraw: function (ships, cells, shootingBan) {
        for (let s = 0; s < 10; s++) {
          if (ships[s][0]) {
            for (let x = 1; x <= 10; x++) {
              for (let y = 1; y <= 10; y++) {
                if (ships[s][2][0].indexOf(cells[x][y].id) >= 0) {
                  cells[x][y].classList.add("blunder");
                  shootingBan.push(cells[x][y].id);
                }
              }
            }
            for (let x = 1; x <= 10; x++) {
              for (let y = 1; y <= 10; y++) {
                if (ships[s][1][0].indexOf(cells[x][y].id) >= 0) {
                  cells[x][y].classList.remove("blunder");
                  cells[x][y].classList.remove("wounded");
                  cells[x][y].classList.add("killed");
                  cells[x][y].innerHTML = "&#9760;";
                }
              }
            }
          }
        }
      },

      //=============================================
      //Модальное окно при запуске, смене имени и информации о конце игры
      modalOpenClose: function (textHeader, name, active) {
        //текст в шапке окна
        this.textHeaderModal = textHeader;
        //наличие или отсутствие поля для ввода имени юзера
        this.isActiveModalInput = active;
        //текст когда конец игры
        if (!active) {
          this.textGameVictory = "Игра окончена, выиграл " + name;
        }
        //если окно запущено, то выключается, если нет, то появляется.
        if (this.isActiveModal) {
          this.isActiveModal = false;
        } else {
          this.isActiveModal = true;
        }
      },
      //функция на первый и повторный запуск игры
      restart: function () {
        //Обнуление переменных перед новой игрой
        this.valueCellsUser = [];
        this.valueCellsComputer = [];
        this.valueShipsUser = [];
        this.valueShipsComputer = [];
        this.valueAddsUser = [];
        this.valueAddsComputer = [];
        this.shootingBanUser = [];
        this.shootingBanComp = [];
        this.sunkenShipUser = [];
        this.sunkenShipComp = [];
        this.shipsUser = [
          [false, [], [], 4, 0], 
          [false, [], [], 3, 0],
          [false, [], [], 3, 0],
          [false, [], [], 2, 0],
          [false, [], [], 2, 0],
          [false, [], [], 2, 0],
          [false, [], [], 1, 0],
          [false, [], [], 1, 0],
          [false, [], [], 1, 0],
          [false, [], [], 1, 0],
        ];
        this.shipsComp = [
          [false, [], [], 4, 0], 
          [false, [], [], 3, 0],
          [false, [], [], 3, 0],
          [false, [], [], 2, 0],
          [false, [], [], 2, 0],
          [false, [], [], 2, 0],
          [false, [], [], 1, 0],
          [false, [], [], 1, 0],
          [false, [], [], 1, 0],
          [false, [], [], 1, 0],
        ];

        //Запуск приложения с вводными
        this.drawField(
          "polygonUser",
          this.valueCellsUser,
          this.valueShipsUser,
          this.valueAddsUser,
          this.shipsUser
        );
        this.drawField(
          "polygonComputer",
          this.valueCellsComputer,
          this.valueShipsComputer,
          this.valueAddsComputer,
          this.shipsComp
        );
      },
      //поиск пустых клеток вокруг корабля
    },

    mounted() {
      //само вызывающаяся функция после загрузки HTML
      this.restart();
    },

    computed: {
      // Динамическая работа с классами

      //подложка модального окна
      classActiveModalOverlay: function () {
        return {
          activeModalOverlay: this.isActiveModal === true,
          inActiveModalOverlay: this.isActiveModal === false,
        };
      },
      //модальное окно
      classActiveModalWindow: function () {
        return {
          activeModalWindow: this.isActiveModal === true,
          inActiveModalWindow: this.isActiveModal === false,
        };
      },
    },
  });
});
