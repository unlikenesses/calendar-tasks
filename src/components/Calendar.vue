<template>
    <div class="pa-5">
        <v-sheet>
            <v-toolbar flat>
                <v-btn
                    outlined
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="prev"
                    class="mr-2"
                >
                    <v-icon small>
                    mdi-chevron-left
                    </v-icon>
                </v-btn>
                <v-btn
                    outlined
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="next"
                    class="mr-4"
                >
                    <v-icon small>
                    mdi-chevron-right
                    </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                </v-toolbar-title>
            </v-toolbar>
        </v-sheet>
        <v-calendar
            ref="calendar"
            :events="events"
            type="month"
            v-model="focus"
            @click:date="dateClicked"
        ></v-calendar>
        <div class="mt-5">
            <h4>Tasks for {{ humanDate }}</h4>
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
import firebase from 'firebase/app'
import 'firebase/auth'
import { db } from '../firebase/firebase'

export default {
    data: () => ({
        focus: '',
        tasks: {},
        events: [],
        userId: null,
        currentDate: new Date().toISOString().split('T')[0]
    }),
    computed: {
        humanDate: function() {
            return new Date(`${this.currentDate}T00:00:00`).toLocaleString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        }
    },
    mounted: function() {
        this.$refs.calendar.checkChange()
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.userId = user.uid
                this.$rtdbBind('events', db.ref('events').child(this.userId))
                // Set checkboxes:
                db.ref('tasks').child(this.userId).once('value', snapshot => {
                    this.tasks = snapshot.val()
                    this.setCheckboxes(this.currentDate)
                })
            }
        })
    },
    methods: {
        prev() {
            this.$refs.calendar.prev()
        },
        next() {
            this.$refs.calendar.next()
        },
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
                db.ref('events').child(this.userId).push(eventObject)
            } else if (taskInEvents.length > 1) {
                console.error('Found more than one event!')
            } else {
                let key = taskInEvents[0]['.key']
                db.ref('events').child(this.userId).child(key).remove()
            }
        }
    }
}
</script>