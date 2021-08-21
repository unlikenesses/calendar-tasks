<template>
    <div class="pa-5">
        <v-list>
            <div v-for="task in tasks" :key="task.id">
                <v-list-item>
                    <v-list-item-content>
                        {{task.title}}
                        <v-badge 
                            inline
                            :color="task.colour ? task.colour : 'black'"
                        ></v-badge>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn 
                            @click="editTask(task)"
                            icon
                        >
                            <v-icon color="indigo lighten-1">mdi-pencil</v-icon>
                        </v-btn>
                    </v-list-item-action>
                    <v-list-item-action>
                        <v-btn 
                            @click="deleteTask(task)"
                            icon
                        >
                            <v-icon color="indigo lighten-1">mdi-delete</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
                <v-divider/>
            </div>
        </v-list>
        <v-form v-model="valid">
            <v-container>
                <v-row>
                    <v-text-field
                        v-model="taskName"
                        @keyup.enter="addTask"
                        :rules="nameRules"
                        :counter="20"
                        label="Name"
                        required
                        clearable
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-select
                        v-model="taskColour"
                        :items="colours"
                        label="Colour"
                    ></v-select>
                </v-row>
                <v-row>
                    <v-btn
                        color="success"
                        class="mr-4"
                        @click="taskSubmit"
                    >
                    {{ editing ? 'Update' : 'Add' }} Task
                    </v-btn>
                    <v-btn
                        v-if="editing"
                        color="error"
                        @click="cancelEdit"
                    >
                    Cancel
                    </v-btn>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>
<script>
import { db } from '../firebase/firebase'
import firebase from 'firebase/app'

export default {
    data: () => ({
        tasks: [],
        colours: ['red', 'pink', 'blue', 'teal', 'green', 'lime', 'orange', 'brown', 'yellow'],
        valid: false,
        editing: false,
        editingTaskId: null,
        taskName: '',
        taskColour: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => v.length <= 20 || 'Name must be less than 20 characters',
        ]
    }),
    firebase: {
        tasks: db.ref('tasks')
    },
    methods: {
        taskSubmit() {
            if (this.editing) {
                this.updateTask()
            } else {
                this.addTask()
            }
        },
        addTask () {
            db.ref('tasks').push({
                title: this.taskName,
                colour: this.taskColour,
                done: false
            })
            this.taskName = ''
            this.taskColour = ''
        },
        updateTask() {
            db.ref('tasks/' + this.editingTaskId).update({
                title: this.taskName,
                colour: this.taskColour
            })
            this.cancelEdit()
        },
        editTask(task) {
            this.editing = true
            this.editingTaskId = task['.key']
            this.taskName = task.title
            this.taskColour = task.colour
        },
        cancelEdit() {
            this.editing = false
            this.editingTaskId = null
            this.taskName = ''
            this.taskColour = ''
        },
        deleteTask(task) {
            let result = window.confirm('Are you sure you want to delete task "' + task.title + '"?')
            if (result) {
                const key = task['.key']
                firebase.database().ref('tasks/' + key).remove()
            }
        }
    }
}
</script>