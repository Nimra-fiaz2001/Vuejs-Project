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
      <div class="filter-bar">
      <label>Filter by Status:</label>
      <select v-model="selectedStatus">
        <option value="all">All</option>
        <option value="approved">Approved</option>
        <option value="disapproved">Disapproved</option>
        <option value="pending">Pending</option>
      </select>
    </div>
      <div class="table-container">
        
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
                <td class="cv-cell"><a @click="downloadCV(user.id)" v-bind:class="{ 'cursor-pointer': !isDownloadingCV }">
                    <i class="fas fa-download"></i></a>
                    <div v-if="isDownloadingCV" class="loader"></div>
                    </td>
                    
                    <td>
  <button @click="showApproveModal(user.id)">
    <i class="fas fa-check-circle" :class="{ approved: user.approved === 1 }"></i>
  </button>
  <button @click="showDisapprovedModal(user.id)">
    <i class="fas fa-times-circle" :class="{ disapproved: user.approved === 0 }"></i>
  </button>
</td>
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
  <StatusChangeModal
  :showModal="showStatusChangeModal"
  @status-change-confirmed="handleStatusChangeConfirmed"
/>
</div>

</template>

<script>
  import StatusChangeModal from './StatusChangeModal.vue'; // Path to your StatusChangeModal component
  import axios from 'axios';

export default {
  components: {
    StatusChangeModal, // Register the StatusChangeModal component
  },
  data() {
    return {
      registeredUsers: [],
      registeredUsersFiltered: [],
      currentPage: 1,
      totalPages: 5,
      searchQuery: '',
      itemsPerPage: 10,
      selectedStatus: "all",
      showStatusChangeModal: false,
      userIdForStatusChange: null,
      isDownloadingCV: false,   // To track if the CV is being downloaded
      loadingDelay: 1000, 
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
    showApproveModal(userId) {
  this.userIdForStatusChange = userId;
  this.showStatusChangeModal = true;
  this.statusChangeType = 'Approved'; // Set the status change type to 'Approved'
},
showDisapprovedModal(userId) {
  this.userIdForStatusChange = userId;
  this.showStatusChangeModal = true;
  this.statusChangeType = 'Disapproved'; // Set the status change type to 'Disapproved'
},
handleStatusChangeConfirmed(confirm) {
  if (confirm) {
    // Call your API to update status here
    const userId = this.userIdForStatusChange;
    const newStatus = this.getNewStatusForUserId(userId); // Determine the new status based on user input
    // Update the latest status based on the confirmation
    axios
      .put('http://192.168.11.213:3000/registration/update-users', {
        id: userId,
        status: newStatus,
      })
      .then(response => {
        console.log('Status updated:', response.data);
        // Update the local data with the new status
        const user = this.registeredUsers.find(user => user.id === userId);
        if (user) {
          user.latestStatus = newStatus;
          user.approved = newStatus === 'Approved' ? 1 : newStatus === 'Disapproved' ? 0 : -1;
        }
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  }
  this.showStatusChangeModal = false; // Close the modal after handling the confirmation
  this.statusChangeType = ''; // Reset the status change type
},
getNewStatusForUserId(userId) {
  // Return the status change type set by showApproveModal or showDisapprovedModal
  return this.statusChangeType;
},
downloadCV(userId) {
  this.isDownloadingCV = true; // Show the loader and set the flag
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
    })
    .finally(() => {
      this.isDownloadingCV = false; // Hide the loader after the download is complete or failed
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
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #2082eb;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: auto;
}
.cursor-pointer {
  cursor: pointer;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@media (max-width: 768px) {
  table{
    width: 100%;
    margin-right: 0;
  }
  th, 
  td{
    font-size: 2px !important;
    padding: 2px;
    margin: 0;
  }
  /* Adjust font size and padding for better mobile readability */
  .result-table th,
  .result-table td {
    padding: 5px;
    font-size: 10px;
    max-width: 100px;
  }
  .pagination button {
    padding: 3px 6px;
    font-size: 10px;
  }

  /* Adjust spacing and alignment for mobile screens */
  .content-container {
    margin: 0; /* Remove left margin on mobile screens */
    width:100%;
  }
  .table-container {
    overflow-x: auto;
    width: 100%;
    padding: 10px;
  }

  /* Center align the table header on mobile screens */
  .result-table th {
    text-align: center;
  }
  
  /* Reduce padding on small screens */
  .header {
    padding: 10px;
  }
  .filter-bar {
    padding: 10px;
  }
  
  /* Expand search bar to full width on mobile */
  .search-bar {
    width: 100%;
    padding: 8px 12px;
    font-size: 12px;
  }

  /* Adjust items per page buttons */
  .items-per-page button {
    padding: 3px 6px;
  }

  /* Adjust the loader size for small screens */
  .loader {
    width: 12px;
    height: 12px;
  }
  .result-page{
    width: 100%;
    padding: 6px;
    margin: 0;
  }
}
</style>
