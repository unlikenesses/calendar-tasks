<template>
  <v-app id="inspire">
    <v-app id="inspire">
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <v-list dense>
          <v-list-item link to='/'>
            <v-list-item-action>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Calendar</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link to='/tasks'>
            <v-list-item-action>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Tasks</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-app-bar
        app
        color="indigo"
        dark
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Daily Devoirs</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="loggedIn">
          <span>{{ loggedInUser }}</span>
          <v-btn
            class="ml-4"
            @click="logout"
          >Logout</v-btn>
        </div>
      </v-app-bar>
  
      <v-main>
        <router-view></router-view>
      </v-main>
      <v-footer
        color="indigo"
        app
      >
        <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    data: () => ({
        drawer: null,
        loggedIn: false,
        loggedInUser: ''
    }),
    mounted: function() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.loggedIn = true
                this.loggedInUser = user.email
            } else {
                this.loggedIn = false
                this.loggedInUser = ''
            }
        })
    },
    methods: {
      logout() {
        firebase.auth().signOut()
        window.location.reload()
      }
    }
}
</script>