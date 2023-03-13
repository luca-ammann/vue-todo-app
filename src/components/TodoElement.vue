<template>
  <div class="todo-element">
    <img src="https://img.icons8.com/dotty/20/000000/move.png" class="handle" />
    <input type="checkbox" :checked="todo.completed" @change="updateStatus" />
    <div class="revealed-text">
      <p
        v-bind:style="[todo.completed ? { 'text-decoration': 'line-through' } : { 'text-decoration': 'none' }]"
        v-show="!updating"
      >{{ todoTextToShow }}</p>
      <textarea
        v-on:input="fitToContent"
        ref="inputUpdateTodo"
        v-model="updatedText"
        type="text"
        v-show="updating"
        class="textarea-update"
        @keyup.esc="saveUpdatedTodo"
      />
      <a
        v-show="expandLink !== ''"
        @click="expandLink === 'Show more...' ? expandLink = 'Show less...' : expandLink = 'Show more...'"
        class="read-more-link"
      >{{ expandLink }}</a>
    </div>
    <img
      v-show="todo.updatable && !updating"
      @click="updateTodo"
      src="../assets/pencil.svg"
      alt="Pencil-icon as svg"
      width="20"
    />
    <img
      v-show="updating"
      @click="saveUpdatedTodo"
      src="../assets/save.svg"
      alt="Save-icon"
      width="20"
    />
    <img
      @click="deleteTodo"
      src="../assets/trash.svg"
      alt="Trash-icon as svg"
      width="20"
      class="grid-end"
    />
  </div>
</template>

<script>
export default {
  name: "TodoElement",
  props: ["todo"],
  data: function() {
    return {
      expandLink: "",
      updating: false,
      updatedText: "",
      todoTextToShow: this.todo.text
    };
  },
  created() {
    if (this.todo.text.length > 50) {
      this.todoTextToShow = this.todo.text.substr(0, 50);
      this.expandLink = "Show more...";
    }
  },
  mounted() {
    if (this.todo.shouldMoveDown) {
      setTimeout(() => {
        const heightOfList = document.getElementsByClassName("todo-list")[0]
          .clientHeight;
        const root = document.querySelector(":root");
        root.style.setProperty(
          "--translation-for-added-todo",
          "-" + (heightOfList - this.$el.clientHeight) + "px"
        );
      }, 1);
    }
  },
  watch: {
    todo: {
      handler(val) {
        if (val.text.length > 50) {
          this.todoTextToShow = val.text.substr(0, 50);
          this.expandLink = "Show more...";
        } else {
          this.todoTextToShow = val.text;
          this.expandLink = "";
        }
      },
      deep: true
    },
    expandLink: {
      handler(val) {
        if (val === "Show less...") {
          this.todoTextToShow = this.todo.text;
        } else {
          this.todoTextToShow = this.todo.text.substr(0, 50);
        }
      }
    }
  },
  methods: {
    fitToContent: function() {
      const el = this.$refs.inputUpdateTodo;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    },
    updateStatus: function() {
      this.$store.dispatch("updateCompleted", this.todo.id);
    },
    deleteTodo: function() {
      if (this.updating) {
        this.$emit("set-updatable-to-true");
      }

      this.$store.dispatch("deleteTodo", this.todo.id);
    },
    updateTodo: function() {
      this.updating = true;
      this.updatedText = this.todo.text;
      this.$emit("set-updatable-to-false", this.todo.id);
      this.$nextTick(() => {
        this.$refs.inputUpdateTodo.focus();
      });
    },
    saveUpdatedTodo: function() {
      const obj = {
        text: this.updatedText,
        id: this.todo.id
      };
      this.updating = false;
      this.$store.dispatch("updateTodoText", obj);
      this.$emit("set-updatable-to-true");
    },
    setExpandLink: function(newVal) {
      this.expandLink = newVal;
    }
  }
};
</script>

<style scoped>
.todo-element {
  width: 100%;
  display: grid;
  grid-template-columns: 20px 20px auto 20px 20px;
  column-gap: 20px;
  border: 1px solid rgb(0, 0, 0);
  background-color: rgb(243, 243, 243);
  margin-top: 10px;
  padding: 0 10px;
}

input {
  margin: 18.5px 3.5px 0 3.5px;
}

img {
  margin-top: 16px;
  cursor: pointer;
}

p {
  word-wrap: break-word;
  word-break: break-all;
}

.read-more-link {
  text-decoration: none;
  font-weight: bold;
  color: #000;
  cursor: pointer;
}

.textarea-update {
  margin: 10.5px 0;
  width: 100%;
  resize: vertical;
  padding: 5px;
  overflow-y: hidden;
}

.grid-end {
  grid-column: 5;
}

.handle {
  cursor: unset;
}

.draggable-icon {
  cursor: move;
}

.delete-animation {
  animation: delete-todo 2s ease forwards;
}

@keyframes delete-todo {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(500px);
    opacity: 0;
  }
}

.delete-animation-after {
  animation: delete-todo-translation 2s ease forwards;
}

@keyframes delete-todo-translation {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50px);
  }
}
</style>
