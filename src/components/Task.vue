<template>
    <div class="pa-5">
        <v-list>
            <div v-for="task in tasks" :key="task.id">
                <v-list-item>
                    <v-list-item-content>
                        {{task.title}}
                    </v-list-item-content>
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
                    <v-btn
                    color="success"
                    class="mr-4"
                    @click="addTask"
                    >
                    Add Task
                    </v-btn>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>
<script>
import { db } from '../firebase/db'
import firebase from 'firebase/app'

export default {
    data: () => ({
        tasks: [],
        valid: false,
        taskName: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => v.length <= 20 || 'Name must be less than 20 characters',
        ]
    }),
    firebase: {
        tasks: db.ref('tasks')
    },
    methods: {
        addTask () {
            db.ref('tasks').push({
                title: this.taskName
            })
            this.taskName = ''
        },
        deleteTask(task) {
            const key = task['.key']
            firebase.database().ref('tasks/' + key).remove()
        }
    }
}
</script>