<template>
    <div class="pa-5">
        <v-calendar
            :events="events"
            @click:date="dateClicked"
        ></v-calendar>
        <div class="mt-5">
            <h4>Tasks for {{ currentDate }}</h4>
            <v-list>
                <div v-for="(task, taskId) in tasks" :key="task.id">
                    <v-list-item
                        @click="toggleTask(task, taskId)"
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
import { db } from '../firebase/firebase'

export default {
    data: () => ({
        tasks: {},
        events: [],
        currentDate: new Date().toISOString().split('T')[0]
    }),
    firebase: {
        events: db.ref('events')
    },
    mounted: function() {
        db.ref('tasks').once('value', snapshot => {
            this.tasks = snapshot.val()
            this.setCheckboxes(this.currentDate)
        })
    },
    methods: {
        dateClicked({ date }) {
            this.currentDate = date
            this.setCheckboxes(date)
        },
        setCheckboxes(date) {
            let completedTaskIds = this.getCompletedTasksForDate(date)
            const checkboxTaskIds = Object.keys(this.tasks)
            checkboxTaskIds.forEach(key => {
                let task = this.tasks[key]
                if (completedTaskIds.indexOf(key) != -1) {
                    task.done = true
                } else {
                    task.done = false
                }
            })
        },
        getCompletedTasksForDate(date) {
            let completedTasksForThisDate = this.events.filter(event => event.start === date)

            return completedTasksForThisDate.map(event => event.taskId)
        },
        toggleTask(task, taskId) {
            let eventObject = {
                name: task.title,
                start: this.currentDate,
                taskId: taskId,
                color: task.colour ? task.colour : 'blue'
            }
            let taskInEvents = this.events.filter(event => event.start === this.currentDate && event.taskId === taskId)
            if (taskInEvents.length === 0) {
                db.ref('events').push(eventObject)
            } else if (taskInEvents.length > 1) {
                console.error('Found more than one event!')
            } else {
                let key = taskInEvents[0]['.key']
                db.ref('events/' + key).remove()
            }
        }
    }
}
</script>