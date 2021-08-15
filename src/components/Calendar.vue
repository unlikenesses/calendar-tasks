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
                    <v-list-item
                        @click="toggleTask(task)"
                    >
                        <v-list-item-action>
                            <v-checkbox
                                v-model="task.done"
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

// events is an array of objects like this:
// {
//   start: '2021-10-10',
//   name: 'eat a peach',
//   taskId: '-MgajESAuxzU3GgBE37t'
// } 

export default {
    data: () => ({
        tasks: [],
        events: [
            {
                start: '2021-08-23',
                name: 'take a walk',
                taskId: '-Mh5U_O_Ub3XnmxCS1Uk'
            },
            {
                start: '2021-08-04',
                name: 'take a walk',
                taskId: '-Mh5U_O_Ub3XnmxCS1Uk'
            },
            {
                start: '2021-08-04',
                name: 'have a nap',
                taskId: '-Mh5UcTyyE18V83OdVXA'
            }
        ],
        currentDate: null
    }),
    firebase: {
        tasks: db.ref('tasks')
    },
    methods: {
        dateClicked({ date }) {
            this.currentDate = date
            let currentTasks = this.getTasksForDate(date)
            this.setCheckboxes(currentTasks)
        },
        getTasksForDate(date) {
            let eventsForThisDate = this.events.filter(event => event.start === date)
            return eventsForThisDate.map(event => event.taskId)
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
        toggleTask(task) {
            let eventObject = {
                name: task.title,
                start: this.currentDate,
                taskId: task['.key']
            }
            let taskInEvents = this.events.filter(event => event.start === this.currentDate && event.taskId === task['.key'])
            if (taskInEvents.length === 0) {
                this.events.push(eventObject)
            } else {
                this.events = this.events.filter(event => event.start !== this.currentDate || event.taskId !== task['.key'])
            }
        }
    }
}
</script>