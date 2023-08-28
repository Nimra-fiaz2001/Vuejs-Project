<template>
	<div class="total" >
		
		<div class="loader" v-if="isLoading"></div> 
	  <table class="table" v-if="!isLoading">
		<thead >
		  <tr>
			<th>ID</th>
			<th>Name</th>
			<th>Email</th>
			<th>Action</th>
		  </tr>
		</thead>
		<tbody>
		  <tr v-for="user in users" :key="user.login.uuid">
			<td>{{ user.login.uuid }}</td>
			<td>{{ user.name.first }} {{ user.name.last }}</td>
			<td>{{ user.email }}</td>
			<td><button @click="openModal(user)">View</button></td>
		  </tr>
		</tbody>
	  </table>
  
	  <!-- Modal -->
	  <div class="modal" :class="{ 'is-active': isModalActive }">
		<div class="modal-background" @click="closeModal"></div>
		<div class="modal-content">
		  <div class="box" v-if="selectedUser">
			<h3>User Information</h3>
			<p>
			  <strong>Name:</strong> {{ selectedUser.name.first }}
			  {{ selectedUser.name.last }}
			</p>
			<p><strong>Email:</strong> {{ selectedUser.email }}</p>
			<!-- Add other user information fields here -->
		  </div>
		</div>
		<button
		  class="modal-close is-large"
		  aria-label="close"
		  @click="closeModal"
		></button> 
	  </div>
	</div>
	
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
	data() {
	  return {
		users: [],
		isModalActive: false,
		selectedUser: null,
		isLoading: true, // Add this line
	  };
	},
	created() {
	  this.fetchUsers();
	},
	methods: {
	  fetchUsers() {
		const numberOfUsers = 14; // Specify the number of users you want to fetch
		const apiUrl = `https://randomuser.me/api/?results=${numberOfUsers}`;
  
		axios
		  .get(apiUrl)
		  .then((response) => {
			this.users = response.data.results;
			setTimeout(() => {
			  this.isLoading = false; // Hide the loader after a delay
			}, 1000); // Adjust the delay time as needed
		  })
		  .catch((error) => {
			console.error("Error fetching users:", error);
			this.isLoading = false; // Hide the loader in case of an error
		  });
	  },
	  openModal(user) {
		this.selectedUser = user;
		this.isModalActive = true;
	  },
	  closeModal() {
		this.isModalActive = false;
	  },
	},
  };
  </script>
  
  <style>
  .total {
	 width: 100%;
	display: flex;
	margin-top: 30px;
	flex-direction: column;
	align-items: center;	
  }
  .table > :not(caption) > * > * {
	/* background: linear-gradient(#5ee49c, #899b92); */
	box-sizing: border-box;
	padding: 10px;
	position: sticky;
	border: 1px solid #ccc;
	background-color: var(--bs-table-bg);
  }
  
  .table {
	
	margin: 0;
	padding: 0;
	justify-content: center;
	margin: 20px auto 0; /* Center horizontally, 20px margin at the top */
	max-width: 100%;
	border-collapse: collapse;
	
  }
  
  td {
	border-color: inherit;
	border-style: solid;
  }
  .table > thead {
	background-color: #333;
	color: #fff;
  }
  .table > tbody {
	background-color: #d88686;
  }
  th,
  td {
	box-sizing: border-box;
	padding: 10px;
	border: 1px solid #ccc;
  }
  
  tbody tr:nth-child(even) {
	background-color: #e0e0e0;
  }
  
  tbody tr:hover {
	background-color: #ccc;
  }
  .modal {
	display: none;
  }
  
  .modal.is-active {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
  }
  
  .modal-background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
  }
  
  .modal-content {
	background-color: #fff;
	padding: 20px;
	border-radius: 4px;
  }
  
  .modal-close {
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
  }
  .loader {
  border: 8px solid #f3f3f3; /* Light gray */
  border-top: 5px solid #021624; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite; /* Spinning animation */
  margin: 0 auto;
  margin-top: 200px;
  display: block;
}

/* Keyframe animation for loader */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Media query for smaller screens */
@media screen and (max-width: 400px) {
 .table{
	font-size: 10px;
	background:red;
	width: 50%;
 }
}
  </style>
  