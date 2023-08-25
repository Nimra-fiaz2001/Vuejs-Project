<template>
<div class="result-page">
    <div class="header">
      <h1 class="result-heading">Registration Form Data</h1>
      <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="search-bar"
      />
    </div>
    </div>
    <div class="content-container">
      <div class="items-per-page">
        <label>Show items per page:</label>
        <button @click="setItemsPerPage(5)">5</button>
        <button @click="setItemsPerPage(10)">10</button>
        <button @click="setItemsPerPage(15)">15</button>
        <button @click="setItemsPerPage(20)">20</button>
        <!-- You can add more buttons for different options -->
      </div>
      <div class="table-container">
        <div class="filter-bar">
      <label>Filter by Status:</label>
      <select v-model="selectedStatus">
        <option value="all">All</option>
        <option value="approved">Approved</option>
        <option value="disapproved">Disapproved</option>
        <option value="pending">Pending</option>
      </select>
    </div>
      <table class="result-table">
        <thead>
          <tr>
            <th> First-Name</th>
            <th>Last-Name</th>
            <th>Email</th>
            
            <th>Education</th>

            <th>CNIC</th>
            
            <th>Age</th>
            <th>Gender</th>
            <th>Address</th>
            <th>DOB</th>
            <th>CV</th>
            
            <th class="status">Status</th>
            <th class="latest-status">Latest Status</th>

            
            
          </tr>
        </thead>
        <tbody>
            <tr v-for="user in registeredUsersFiltered" :key="user.id">
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                
                <td>{{ user.Education }}</td>
               
                <td>{{ user.CINC }}</td> <!-- Update this line -->
                <td>{{ user.Age }}</td> <!-- Update this line -->
                <td>{{ user.Gender }}</td> <!-- Update this line -->
                <td>{{ user.address }}</td>
                <td>{{ user.DOB }}</td> <!-- Update this line -->
                <td class="cv-cell"><a @click="downloadCV(user.id)">
                    <i class="fas fa-download"></i></a></td>
                 <!-- Display the 'approved' field -->
                
                 
                  <td>
            <button
              @click="approveUser(user.id)"
              :class="{ approved: user.approved === 1 }">Approved
            </button>
            <button
              @click="disapproveUser(user.id)"
              :class="{ disapproved: user.approved === 0 }">Disapproved</button></td>
          <td>{{ getStatusText(user) }}</td>
            </tr>
      </tbody>
    </table>
    </div>
    <div class="pagination">
      
      <button @click="fetchPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }}</span>
      <button @click="fetchPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
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
      itemsPerPage: 10,
      selectedStatus: "all",
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
    .get(`http://192.168.11.213:3000/registration/get-all-user?page=${page}&limit=${this.itemsPerPage}`)
    .then(response => {
      this.registeredUsers = response.data.getall.map(user => ({
        ...user,
        latestStatus: user.approved === 1 ? 'Approved' : user.approved === 0 ? 'Disapproved' : 'Pending',
      }));
      this.currentPage = response.data.currentPage;
      this.totalPages = response.data.totalPages;
      this.filterUsers(this.searchQuery);
    })
    .catch(error => {
      console.error("Error fetching registered users:", error);
    });
},
    setItemsPerPage(value) {
      console.log('Items per page changed:', value);
      this.itemsPerPage = value;
      this.fetchPage(1); // Fetch the first page with the new itemsPerPage value
    },
    fetchPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchRegisteredUsers(page);
      }
    },
    approveUser(id) {
      axios
        .put('http://192.168.11.213:3000/registration/update-users', {
          id,
          approved : 1,
        })
        .then(response => {
          console.log('User approved:', response.data);
          const user = this.registeredUsers.find(user => user.id === id);
          if (user) {
            user.approved = 1;
          }
          // You might want to update the user's 'approved' status in the local data
        })
        .catch(error => {
          console.error('Error approving user:', error);
        });
    },
    disapproveUser(id) {
      axios
        .put('http://192.168.11.213:3000/registration/update-users', {
          id,
          approved : 0,
        })
        .then(response => {
          console.log('User disapproved:', response.data);
          const user = this.registeredUsers.find(user => user.id === id);
          if (user) {
            user.approved = 0;
          }
          // You might want to update the user's 'approved' status in the local data
        })
        .catch(error => {
          console.error('Error disapproving user:', error);
        });
    },
    downloadCV(userId) {
      const requestData = { id: userId };
      axios
        .get(`http://192.168.11.213:3000/registration/download-cv?id=${userId}`,  {
          responseType: 'blob',
        })
        .then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.download = `CV_${userId}.pdf`;
          link.click();

          URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error fetching user CV:', error);
        });
    },
    getStatusText(user) {
    if (user.approved === 1) {
      return 'Approved';
    } else if (user.approved === 0) {
      return 'Disapproved';
    } else {
      return 'Pending';
    }
  
},
filterUsers(query) {
  this.registeredUsersFiltered = this.registeredUsers.filter(user => {
    const userStatus = user.latestStatus.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query.toLowerCase()) &&
      (userStatus === 'pending' || userStatus === 'disapproved') // Include pending and disapproved users
    );
  });
},
computed: {
    filteredUsers() {
      if (this.selectedStatus === "all") {
        return this.registeredUsersFiltered;
      } else {
        return this.registeredUsersFiltered.filter(
          user => user.latestStatus.toLowerCase() === this.selectedStatus
        );
      }
    },
  },
  },
};
</script>
  
<style scoped>
.result-page {
    background-color: whitesmoke;
  padding: 20px;
  color: rgb(22, 21, 21);
  width: 100%;
  font-size: small;
 
  
}
.table-container {
  width: 100%;
  overflow-x: auto;
}
.content-container {
  flex: 1; /* Allow the content to take up remaining space */
  display: flex;
  flex-direction: column; /* Stack table and pagination vertically */
  align-items: flex-start; /* Align content on the left side */
  margin-left: 20px; /* Add some spacing between search and content */
  width: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-heading {
    margin: 0;
}

.result-table {
  
  border-collapse: collapse;
  margin: 0 auto;
  width: 100%;
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


.cv-cell {
  text-align: center;
}
.status {
  text-align: center;
}
.latest-status-cell {
  text-align: center;
}

.status-cell {
  text-align: center;
}

.search-container {
    display: flex;
  align-items: center;
}

.search-bar {
  padding: 10px 15px;
  width: 300px;
  border: none;
  border-bottom: 2px solid #2082eb;
  font-size: 16px;
  background-color: transparent;
  color: black;
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
  font-size: 15px;
}
.disapproved {
  background-color: red;
  color: white;
  font-size: 15px;
}
.result-table th.latest-status {
  background-color: yellow;
  color: black;
  text-align: center; /* Center align the text */
}
.result-table th.status {
  text-align: center;
}

.items-per-page {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.items-per-page label {
  margin-right: 10px;
}

.items-per-page button {
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  background-color: #2082eb;
  color: white;
  border: none;
}

.items-per-page button:focus {
  outline: none;
}
.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 10px;
}

.filter-bar label {
  margin-right: 10px;
}

.filter-bar select {
  padding: 5px;
  background-color: #2082eb;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 25px;
}
@media (max-width: 768px) {
  .content-container {
    margin: 0; /* Remove left margin on mobile screens */
  }

  .table-container {
    overflow-x: auto;
  }

  .result-table th,
  .result-table td {
    padding: 6px; 
    font-size: 12px; 
  }
  .pagination button {
    padding: 3px 8px;
  }
}
@media (max-width: 300px) {
  .search-bar {
    width: 100%; /* Expand search bar to full width on very narrow screens */
  }
  .content-container{
    width: 100%;
  }
  .table-container{
    width: 100%;
    overflow-x: auto;
  }
  
}
</style>
