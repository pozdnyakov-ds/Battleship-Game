<template>
  <div class="logs">
    <div class="logs__title">LOG</div>
    <div class="logs__wrapper">
      <div class="logs__list">
        <div
          class="logs__logs"
          v-for="log in coordinateLogs"
          :key="log.id"
        >
          <div class="logs__log">{{ log.step }}: {{ log.textAddres }}-{{ log.numAddres }} ({{ log.typeShot }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Logs",
  props: {
    coordinateLogs: {
      type: [Object, Array],
      default: '',
      required: true,
    },
  },
}
</script>

<style scoped>
.logs {
  height: 365px;
  width: 120px;
  background-color: #95f5f5;
  border: 1px groove #1D7373;
  border-radius: 5px;
  margin: 12px 0;
}

.logs__wrapper {
  margin: 2px;
  height: calc(365px - 1.1em - 11px);
  overflow-y: scroll;
  overflow-x: hidden;
  display: block;
}

.logs__title {
  text-align: center;
  border-bottom: 1px groove #1d7373;
}

.logs__list {
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column-reverse;
  justify-content: start;
}

.logs__logs {
  padding-left: 5px;
  width: calc(100% - 5px);
  height: 1.1em;
}

.logs__log {
  width: 100%;
  height: 100%;
}
</style>
