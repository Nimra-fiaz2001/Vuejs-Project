<template>
    
    <div class="result-page">
      <h1 class="result-heading">Registration Form Data
      </h1>
      <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="search-bar"
      />
    </div>

      <table class="result-table">
        <thead>
          <tr>
            <th  style="width: 10%;"> First-Name</th>
            <th  style="width: 10%;">Last-Name</th>
            <th  style="width: 10%;">Email</th>
            <th  style="width: 10%;">Password</th>
            <th  style="width: 10%;">Education</th>
            <th  style="width: 10%;">PhoneNo</th>
            <th  style="width: 10%;">CNIC</th>
            
            <th  style="width: 10%;">Age</th>
            <th  style="width: 10%;">Gender</th>
            <th  style="width: 10%;">Address</th>
            <th  style="width: 10%;">DOB</th>
            <th  style="width: 10%;">CV</th>
            <th  style="width: 10%;">Status</th>
            <th  style="width: 10%;">Status</th>

            
            
          </tr>
        </thead>
        <tbody>
            <tr v-for="user in registeredUsersFiltered" :key="user.id">
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.password }}</td>
                <td>{{ user.Education }}</td>
                <td>{{ user.PhoneNo }}</td> <!-- Update this line -->
                <td>{{ user.CINC }}</td> <!-- Update this line -->
                <td>{{ user.Age }}</td> <!-- Update this line -->
                <td>{{ user.Gender }}</td> <!-- Update this line -->
                <td>{{ user.address }}</td>
                <td>{{ user.DOB }}</td> <!-- Update this line -->
                <td>{{ user.cv }}</td>
                <td>{{ user.approved }}</td> <!-- Display the 'approved' field -->
                <td>
            <button
              @click="approveUser(user.email)"
              :class="{ approved: user.approved === 1 }"
            >
              Approve
            </button>
            <button
              @click="disapproveUser(user.email)"
              :class="{ disapproved: user.approved === 0 }"
            >
              Disapprove
            </button>
          </td>
            </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="fetchPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }}</span>
      <button @click="fetchPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      registeredUsers: [],
      registeredUsersFiltered: [],
      currentPage: 1,
      totalPages: 5,
      searchQuery: '',
    };
  },
  mounted() {
    console.log("Mounted hook - Fetching registered users...");
    this.fetchRegisteredUsers();
  },
  watch: {
    searchQuery: {
      handler(newQuery) {
        this.filterUsers(newQuery);
      },
      immediate: true,
    },
  },
  methods: {
    fetchRegisteredUsers(page = 1) {
      axios
        .get(`http://192.168.11.213:3000/users/getAllRegisterUser?page=${page}`)
        .then(response => {
          this.registeredUsers = response.data.getall;
          this.currentPage = response.data.currentPage;
          this.totalPages = response.data.totalPages;
          this.filterUsers(this.searchQuery);
        })
        .catch(error => {
          console.error("Error fetching registered users:", error);
        });
    },
    filterUsers(query) {
      this.registeredUsersFiltered = this.registeredUsers.filter(user =>
        user.firstName.toLowerCase().includes(query.toLowerCase())
      );
    },
    fetchPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchRegisteredUsers(page);
      }
    },
    approveUser(email) {
      axios
        .post('http://192.168.11.213:3000/users/updateRegisterUsers', {
          email,
          status: 1,
        })
        .then(response => {
          console.log('User approved:', response.data);
          const user = this.registeredUsers.find(user => user.email === email);
          if (user) {
            user.approved = 1;
          }
          // You might want to update the user's 'approved' status in the local data
        })
        .catch(error => {
          console.error('Error approving user:', error);
        });
    },
    disapproveUser(email) {
      axios
        .post('http://192.168.11.213:3000/users/updateRegisterUsers', {
          email,
          status: 0,
        })
        .then(response => {
          console.log('User disapproved:', response.data);
          const user = this.registeredUsers.find(user => user.email === email);
          if (user) {
            user.approved = 0;
          }
          // You might want to update the user's 'approved' status in the local data
        })
        .catch(error => {
          console.error('Error disapproving user:', error);
        });
    },
  },
};
</script>


  
<style scoped>
.result-page {
  background-color: #333;
  padding: 20px;
  color: white;
}

.result-heading {
  text-align: center;
  margin-bottom: 20px;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.result-table th,
.result-table td {
  padding: 8px; /* Adjust cell padding */
  border: 1px solid #666;
  text-align: center;
}

.result-table th {
  background-color: #444;
  color: white;
}

/* Alternating row colors */
.result-table tbody tr:nth-child(even) {
  background-color: #555; /* Change to your desired color */
}

.result-table tbody tr:hover {
  background-color: #666; /* Change to your desired hover color */
}

.cv-cell a {
  color: #007bff;
  text-decoration: none;
}

.cv-cell a:hover {
  text-decoration: underline;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar {
  padding: 10px 15px;
  width: 300px;
  border: none;
  border-bottom: 2px solid #2082eb;
  font-size: 16px;
  background-color: transparent;
  color: white;
  transition: border-color 0.3s;
}

.search-bar::placeholder {
  color: #aaa;
}

.search-bar:focus {
  outline: none;
  border-color: #e31b6d;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #2082eb;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #d15151;
  cursor: not-allowed;
}
.approved {
  background-color: green;
  color: white;
}

</style>
