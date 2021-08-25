<template>
    <div>
        <v-alert
            type="error"
            v-show="loginFail"
        >Login failed!</v-alert>
        <v-layout align-center justify-center mt-14>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar color="indigo" dark flat>
                        <v-toolbar-title>Login form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form v-model="isValid">
                            <v-text-field 
                                v-model="email"
                                :rules="emailRules"
                                label="Email"
                                name="email"
                                required
                                prepend-inner-icon="mdi-face"
                                type="text"
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                @keyup.enter="loginSubmit"
                                id="password" 
                                label="Password" 
                                name="password" 
                                required
                                prepend-inner-icon="mdi-lock" 
                                type="password"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                            @click="loginSubmit"
                            color="indigo"
                            class="white--text"
                            :disabled="!isValid"
                        >
                            <v-progress-circular
                                indeterminate
                                :size="20"
                                v-if="loggingIn"
                            ></v-progress-circular>
                            <span v-else>Login</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    data: () => ({
        isValid: true,
        loginFail: false,
        loggingIn: false,
        email: '',
        password: '',
        emailRules: [
            v => !!v || 'Email is required',
        ],
        passwordRules: [
            v => !!v || 'Password is required',
        ]
    }),
    methods: {
        loginSubmit() {
            this.loggingIn = true
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    this.loginFail = false
                    this.isValid = true
                    this.$router.push('/')
                })
                .catch((error) => {
                    this.loginFail = true
                    this.password = ''
                    this.loggingIn = false
                    console.log(error.code + ': ' + error.message)
                })
        }
    }
}
</script>