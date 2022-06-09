<template>
  <div class="modal">
    <div class="modal-overlay" :class="classActiveModalOverlay">
      <div class="modal-window" :class="classActiveModalWindow">
        <div class="modal-header">
          <span class="modal-title">{{ isActiveModalInput ? GREETINGS : GAMEOVER }}</span>
        </div>

        <div class="modal-body">
          <input v-if="isActiveModalInput" type="text" @input="$emit('inputModal', $event.target.value)"
                 v-model='nameUser'>
          <div v-else>{{ textGameVictory }}</div>
        </div>

        <div class="modal-footer">
          <button @click="$emit('modalOpenClose', '', true)">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/store";

export default {
  name: "Modal",
  props: {
    isActiveModal: {
      type: Boolean,
      default: true,
      required: true,
    },
    isActiveModalInput: {
      type: Boolean,
      default: true,
      required: true,
    },
    nameOfWinner: {
      type: String,
      default: '',
      required: true,
    },

  },
  data() {
    return {
      nameUser: 'John Rackham',
    };
  },
  created() {
    this.GREETINGS = store.modalText.greetings;
    this.GAMEOVER = store.modalText.gameOver
  },
  methods: {},
  computed: {
    //подложка модального окна
    classActiveModalOverlay() {
      return {
        activeModalOverlay: this.isActiveModal === true,
        inActiveModalOverlay: this.isActiveModal === false,
      };
    },
    //модальное окно
    classActiveModalWindow() {
      return {
        activeModalWindow: this.isActiveModal === true,
        inActiveModalWindow: this.isActiveModal === false,
      };
    },
    textGameVictory() {
      return store.modalText.gameVictory + this.nameOfWinner;
    }
  },
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.modal-window {
  width: 400px;
  border-radius: 5px;
  border: 5px solid #eee;
  background: #fff;
  margin: 0 auto;
}

.modal-header {
  padding: 5px 10px;
  display: flex;
  /* justify-content: space-between; */
  justify-content: center;
  border-bottom: 1px solid #eee;
  background-color: rgb(158, 187, 241);
}

.modal-title {
  font-size: 1.5rem;
}

.modal-close {
  cursor: pointer;
}

.modal-body {
  display: flex;
  justify-content: space-evenly;
  padding: 10px;
  margin: 0 0 5px;
  background-color: rgb(219, 255, 250);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
  border-top: 1px solid #eee;
  background-color: rgba(0, 255, 255, 0.356);
}

.modal-footer button {
  margin-left: 10px;
}

.activeModalOverlay {
  opacity: 1;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  transition: background .2s ease-in;
}

.inActiveModalOverlay {
  opacity: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0);
  transition: all .2s ease-out;
}

.activeModalWindow {
  transform: translateY(200px);
  transition: transform .2s ease-in;
}

.inActiveModalWindow {
  transform: translateY(-200px);
  transition: transform .2s ease-out;
}
</style>
