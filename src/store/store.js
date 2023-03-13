import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebase'
import 'array.prototype.move';

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        todos: []
    },
    mutations: {
        ADD_TODO(state, todo) {
            todo.shouldMoveDown = true;
            state.todos.push(todo);
        },
        UPDATE_COMPLETED(state, id) {
            const index = this.getters.fetchTodoIndex(id);
            state.todos[index].completed = !state.todos[index].completed;
        },
        UPDATE_ORDER(state, obj){
            state.todos.move(obj.oldOrder, obj.newOrder);
        },
        DELETE_TODO(state, id) {
            const index = this.getters.fetchTodoIndex(id);
            state.todos.splice(index, 1);
        },
        SET_UPDATABLE_TO_FALSE(state, excludedId) {
            state.todos.forEach(todo => {
                if (todo.id !== excludedId) {
                    todo.updatable = false;
                }
            });
        },
        SET_UPDATABLE_TO_TRUE(state) {
            state.todos.forEach(todo => todo.updatable = true);
        },
        UPDATE_TODO_TEXT(state, obj) {
            const index = this.getters.fetchTodoIndex(obj.id);
            state.todos[index].text = obj.text;
        },
        SET_TODOS(state, todos) {
            state.todos = todos;
        },
        SYNC_DB(state, obj) {
            const oldIndex = obj.oldOrder;
            const newIndex = obj.newOrder;

            const [lowerNum, higherNum] = (() => {
                if(oldIndex > newIndex){
                    return [newIndex, oldIndex];
                }
                return [oldIndex, newIndex];
            })();

            for(let i = lowerNum; i <= higherNum; i++){
                const todo = state.todos[i];
                db.collection('todos').doc(todo.id).update({
                    order: i
                })
                .then(() => {
                    console.log("done, sync_db worked!");
                })
                .catch(err => console.log(err));
            }
        }
    },
    actions: {
        addTodo(context, text) {
            db.collection('todos').add({
                completed: false,
                title: text,
                order: this.getters.getNextArrayIndex
            })
                .then(docRef => {
                    context.commit('ADD_TODO', {
                        id: docRef.id,
                        text: text,
                        completed: false,
                        updatable: true,
                        order: this.getters.getNextArrayIndex
                    });
                });
        },
        updateCompleted(context, id) {
            const todo = this.getters.fetchTodo(id);
            db.collection('todos').doc(id).update({
                completed: !todo.completed
            })
                .then(() => {
                    context.commit('UPDATE_COMPLETED', id);
                });
        },
        updateOrder(context, obj){
            // mutate array
            context.commit("UPDATE_ORDER", obj);

            // mutate db with array
            context.commit("SYNC_DB", obj);

        },
        deleteTodo(context, id) {
            db.collection('todos').doc(id).delete()
                .then(() => {
                    context.commit('DELETE_TODO', id);
                });
        },
        setUpdatableToFalse(context, excludedId) {
            context.commit('SET_UPDATABLE_TO_FALSE', excludedId);
        },
        setUpdatableToTrue(context) {
            context.commit('SET_UPDATABLE_TO_TRUE');
        },
        updateTodoText(context, obj) {
            db.collection('todos').doc(obj.id).update({
                title: obj.text
            })
                .then(() => {
                    context.commit('UPDATE_TODO_TEXT', obj);
                });
        },
        getTodosFromDB(context) {
            let tempTodos = [];
            let todos = undefined;
            db.collection('todos').get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const obj = {
                            id: doc.id,
                            text: doc.data().title,
                            completed: doc.data().completed,
                            updatable: true,
                            order: doc.data().order
                        }
                        tempTodos.push(obj);
                    });
                    todos = tempTodos.sort((todoA, todoB) => todoA.order - todoB.order);
                    context.commit('SET_TODOS', todos);
                }).catch(err => console.log(err));
        }
    },
    getters: {
        fetchTodos: (state) => {
            return state.todos;
        },
        fetchTodoIndex: (state) => (id) => {
            return state.todos.findIndex(todo => todo.id === id);
        },
        fetchTodoIndexWithOrder: (state) => (order) => {
            return state.todos.findIndex(todo => todo.order === order);
        },
        fetchTodo: (state, getters) => (id) => {
            return state.todos[getters.fetchTodoIndex(id)];
        },
        getTodoIdWithOrder: (state) => (order) => {
            const todo = state.todos.find(todo => todo.order === order);
            return todo.id;
        },
        getNextArrayIndex: (state) => {
            return state.todos.length + 1;
        }
    }

});
