<template>
  <div class='cell'>
    <div
      class='cell__elem'
      :class="{ 'cell__elem_cursor-aim': isCursorAim }"
      :style="{backgroundColor: colorCell}"
      @click="shotFire">
      {{ name }}
    </div>
  </div>
</template>
<script>
import store from "../store/store";
export default {
  props: {
    callsign: {
      type: String,
      default: '',
      required: true,
    },
    status: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: [String, Number],
      default: '',
      required: true,
    },
    id: {
      type: Number,
      default: undefined,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    shotFire() {
      if (this.callsign === store.callsign.COMPUTER
        && this.status === store.statusCells.initial
        || this.status === store.statusCells.shipsComp) {
        this.$emit("shotFire");
      }
    },

  },
  computed: {
    colorCell() {
      switch (this.status) {
        case store.statusCells.wounded:
          return '#fff200';
        case store.statusCells.blunder:
          return '#4465af';
        case store.statusCells.killed:
          return '#ff3c00';
        case store.statusCells.shipsUser:
          return '#282828';
        case store.statusCells.shipsComp:
        case store.statusCells.initial:
          return '#95f5f5';
        case store.statusCells.nameTD:
          return '#84cc84';
      }
    },
    isCursorAim() {
      return this.callsign === store.callsign.COMPUTER
        && this.status === store.statusCells.initial
        || this.status === store.statusCells.shipsComp;
    }
  },

};
</script>
<style>
.cell {
  border: 1px groove #1d7373;
  border-radius: 1px;
}

.cell__elem {
  width: 30px;
  height: 30px;
  font-size: 20px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cell__elem_cursor-aim {
  cursor: url("../img/aim.png") 16 16, crosshair;
}

.cell__elem_cursor-aim:hover {
  border-color: red;
  box-shadow: inset 0 0 4px red;
}
</style>
