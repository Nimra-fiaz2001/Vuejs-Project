<template>
  <div class="profile-container">
    <h1>Welcome to your Profile</h1>

    <table>
      <tr>
        <th>Name</th>
        
        <th>Password</th>
      </tr>
      <tr>
        <td>{{ userData.name }}</td>
        
        <td @click="togglePasswordVisibility">
          <span v-if="hidePassword">******</span>
          <span v-else>{{ userData.password }}</span>
        </td>
      </tr>
    </table>
    <div class="update-container">
      <h2>Update Your Name</h2>
      <input v-model="updatedName" placeholder="New Name" />
      <button class="update-button" @click="updateName">Update Name</button>
    </div>
    <div class="update-container">
      <h2>Update Your Password</h2>
      <input type="password" v-model="currentPassword" placeholder="Current Password" />
      <input type="password" v-model="newPassword" placeholder="New Password" />
      <button class="update-button" @click="updatePassword">Update Password</button>
    </div>
    <div class="logout-container">
      <button class="logout-button" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {},
      updatedName: "",
      currentPassword: "",
      newPassword: "",
      hidePassword: true,
      loading: true, // Add the loading property
    };
  },
  created() {
    // Load user data from local storage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      this.userData = userData;
      this.updatedName = userData.name;
      this.loading = false; // Mark loading as complete
    }
  },
  methods: {
    updateName() {
      if (this.updatedName.trim() !== "") {
        // Update the name in the local storage
        this.userData.name = this.updatedName;
        localStorage.setItem("user", JSON.stringify(this.userData));
        alert("Name updated successfully!");
      } else {
        alert("Please enter a valid name.");
      }
    },
    updatePassword() {
      if (this.currentPassword === this.userData.password) {
        if (this.newPassword.trim() !== "") {
          // Update the password in the local storage
          this.userData.password = this.newPassword;
          localStorage.setItem("user", JSON.stringify(this.userData));
          alert("Password updated successfully!");
        } else {
          alert("Please enter a valid new password.");
        }
      } else {
        alert("Current password is incorrect.");
      }
      // Clear the password fields
      this.currentPassword = "";
      this.newPassword = "";
    },
    togglePasswordVisibility() {
      this.hidePassword = !this.hidePassword;
    },
    logout() {
      localStorage.removeItem("user");
      this.userData = {};
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
/* Add your styles for the Profile.vue file here */

.profile-container {
  width: 100%;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 -1px 1px #fff, 0 1px 0 #fff;
}

h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

td {
  cursor: pointer;
  font-weight: bold;
}

.update-container {
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #333;
}

button.update-button,
button.logout-button {
  display: block;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(#009345, #009345);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

button.update-button:hover,
button.logout-button:hover {
  background-color: #0079ce;
}

button.update-button:focus,
button.logout-button:focus {
  outline: none;
}

/* Responsive styles */

@media screen and (max-width: 768px) {
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  table {
    font-size: 14px;
  }
  th,
  td {
    padding: 8px;
  }
  button.update-button,
  button.logout-button {
    font-size: 14px;
    padding: 10px;
  }
  .profile-container {
    padding: 20px;
  }
}
</style>
