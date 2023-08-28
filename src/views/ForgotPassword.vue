<style>
.login-container {
    border: solid 2px #676767;
    background-color: #2c2828;
    border-radius: 7px;
    height: 75%;
}

.items-center {
    align-items: center;
}

.wrap {
    flex-wrap: wrap;
}

.children-form {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.href-makers {
    color: #909090;
}

.buttons-login {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.func {
    gap: 50px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
}

.msg {
    position: absolute;
}

@media screen and (max-width: 725px) {
    .login {
        flex-direction: column;
    }

    .func,
    .form {
        height: 50%;
        width: 100% !important;
    }
}
</style>
<template>
    <div>
      <h1>Forgot Password</h1>
      <input v-model="email" placeholder="Email">
      <button @click="sendResetEmail">Send Reset Email</button>
    </div>
  </template>
  
  <script>
// importar axios para hacer peticiones
import axios from 'axios';
// importar para configurar rutas
import { createRouter, createWebHistory } from 'vue-router'
  export default {
    data() {
      return {
        email: ''
      };
    },
    methods: {
      async sendResetEmail() {
        try {
          const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: this.email })
          });
  
          if (response.status === 200) {
            // Password reset email sent successfully
          } else if (response.status === 404) {
            // User not found
          } else {
            // Other error
          }
        } catch (error) {
            alert(e.response.data.error)
        }
      }
    }
  };
  </script>








