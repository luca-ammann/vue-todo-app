<template>
  <div id="app">
    <TodoList />
  </div>
</template>

<script>
import TodoList from "./components/TodoList";

export default {
  name: "app",
  components: {
    TodoList
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  max-width: 600px;
  margin: 60px auto 0 auto;
}
</style>
