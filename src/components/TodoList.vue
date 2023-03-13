<template>
  <div class="list">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>Todo App</h1>
    <input
      ref="todoInput"
      :disabled="!addable"
      type="text"
      placeholder="Type your todo in here..."
      @keyup.enter="addTodo"
      v-model="newTodo"
    />
    <draggable class="todo-list" handle=".handle" v-model="todoList" ghost-class="ghost" @end="onDragEnd" v-bind="dragOptions">
      <transition-group name="flip-list">
        <TodoElement
          class="flip-list-item"
          v-bind:key="todo.id"
          v-for="todo in todoList"
          :todo="todo"
          v-on:set-updatable-to-false="setUpdatableToFalse($event)"
          v-on:set-updatable-to-true="setUpdatableToTrue"
        />
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import TodoElement from "./TodoElement";
import draggable from "vuedraggable";

export default {
  name: "TodoList",
  data: function() {
    return {
      newTodo: "",
      addable: true
    };
  },
  created() {
    console.log("created on todoList");
    this.$store.dispatch("getTodosFromDB");
  },
  components: {
    TodoElement,
    draggable
  },
  computed: {
    todoList: {
      get(){
        return this.$store.getters.fetchTodos;
      },
      set(val){
        // TODO: wenn etwas geadded wird, neue order setzen
        // nutzen, um neue Liste an store zu senden
        console.log(val);
      }
    },
    dragOptions(){
      return {
        disabled: false
      }
    }
  },
  methods: {
    addTodo: function() {
      if (this.newTodo === "") {
        return;
      }

      this.$store.dispatch("addTodo", this.newTodo);
      this.newTodo = "";
    },
    setUpdatableToFalse: function(excludedId) {
      this.addable = false;
      this.$store.dispatch("setUpdatableToFalse", excludedId);
    },
    setUpdatableToTrue: function() {
      this.addable = true;
      this.$store.dispatch("setUpdatableToTrue");
    },
    onDragEnd: function(event){
      // new order into db
      const obj = {
        oldOrder: event.oldIndex,
        newOrder: event.newIndex
      };
      this.$store.dispatch("updateOrder", obj);
      console.log(event);
    }
  }
};
</script>

<style scoped>
:root {
  --translation-for-added-todo: 0px
}

.list {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
}

img {
  width: 200px;
  align-self: center;
}

.ghost {
  opacity: .5;
  background: #9e9e9e;
}

.flip-list-item {
  transition: all 1s;
}

.flip-list-enter {
  opacity: 0;
  transform: translateY(var(--translation-for-added-todo));
}

.flip-list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.flip-list-leave-active {
  position: absolute;
}
</style>
