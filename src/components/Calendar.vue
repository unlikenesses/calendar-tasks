<template>
    <div class="pa-5">
        <v-calendar
            :events="events"
            @click:date="dateClicked"
        ></v-calendar>
        <div class="mt-5">
            <h4>Tasks for {{ currentDate }}</h4>
            <v-list>
                <div v-for="task in tasks" :key="task.id">
                    <v-list-item>
                        <v-list-item-action>
                            <v-checkbox
                                :input-value="task.done"
                                color="indigo"
                            ></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                            {{ task.title }}
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider/>
                </div>
            </v-list>
        </div>
    </div>
</template>
<script>
import { db } from '../firebase/db'
// import firebase from 'firebase/app'

// completed is an array of objects like this:
// {
//   date: '2021-10-10', (or whatever date format I end up using)
//   tasks: [
//     'MgajESAuxzU3GgBE37t', 'MggN6xAeGwqxqo5AmMU',  
//   ]
// }

export default {
    data: () => ({
        tasks: [],
        events: [],
        completed: [
            {
                date: '2021-08-23',
                tasks: [
                    '-MgajESAuxzU3GgBE37t',
                ]
            },
            {
                date: '2021-08-04',
                tasks: [
                    '-MgajESAuxzU3GgBE37t',
                    '-MggN6xAeGwqxqo5AmMU',
                ]
            }
        ],
        currentDate: null
    }),
    mounted() {
        this.updateEvents()
    },
    firebase: {
        tasks: db.ref('tasks')
    },
    methods: {
        dateClicked({ date }) {
            // passed date as string in format yyyy-mm-dd
            this.currentDate = date
            let currentTasks = this.getTasksForDate(date)
            this.setCheckboxes(currentTasks)
        },
        getTasksForDate(date) {
            for (let i = 0; i < this.completed.length; i++) {
                let current = this.completed[i]
                if (current.date === date) {
                    return current.tasks
                }
            }
            return []
        },
        setCheckboxes(taskIds) {
            for (let i = 0; i < this.tasks.length; i++) {
                let task = this.tasks[i]
                let taskId = task['.key']
                if (taskIds.indexOf(taskId) != -1) {
                    task.done = true
                } else {
                    task.done = false
                }
            }
        },
        updateEvents() {
            for (let i = 0; i < this.completed.length; i++) {
                let day = this.completed[i]
                for (let d = 0; d < day.tasks.length; d++) {
                    let task = this.getTaskById(day.tasks[d])
                    this.events.push({
                        name: task.title,
                        start: day.date
                    })
                }
            }
        },
        getTaskById(taskId) {
            for (let i = 0; i < this.tasks.length; i++) {
                let task = this.tasks[i]
                if (task['.key'] === taskId) {
                    return task
                }
            }
        }
    }
}
</script>