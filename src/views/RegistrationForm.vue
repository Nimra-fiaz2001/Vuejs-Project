<template>
    <div class="registration-form">
      <h1 class="form-heading">Registration Form</h1>
      <h2 class="section-heading">General Information:</h2>
      <div class="form-group">
        <label for="name">First Name</label>
        <input type="text" v-model="firstName" placeholder="First Name" id="firstName">
      </div>
      <div class="form-group">
        <label for="name">Last Name</label>
        <input type="text" v-model="lastName" placeholder="Last Name" id="lastName">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" placeholder="Email" id="email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" placeholder="Password" id="password">
      </div>
       <!-- Education Information Section -->
    <h2 class="section-heading">Education Information:</h2>
      <div class="form-group">
        <label for="education">Education</label>
        <select v-model="education" id="education">
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="secondary">Under-Graduation</option>
          <option value="secondary">Graduation</option>
        </select>
      </div>
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="text" v-model="phoneNo" placeholder="Phone Number" id="phoneNo">
      </div>
      <div class="form-group">
        <label for="cnic">cinc</label>
        <input type="text" v-model="cinc" placeholder="CNIC (e.g. 12345-6789012-3)" id="cinc">
      </div>
      <div class="form-group">
        <label for="age">Age</label>
        <input type="number" v-model="age" placeholder="Age" id="age">
      </div>
      <div class="form-group">
        <label>Gender</label>
        <div class="radio-group">
          <label><input type="radio" v-model="gender" value="male"> Male</label>
          <label><input type="radio" v-model="gender" value="female"> Female</label>
          <label><input type="radio" v-model="gender" value="other"> Other</label>
        </div>
      </div>
      <div class="form-group">
        <label for="address">Address</label>
        <input type="text" v-model="address" placeholder="Address" id="address">
      </div>
      <div class="form-group">
        <label for="dob">Date of Birth</label>
        <input type="date" v-model="dob" id="dob">
      </div>
       <!-- CV Upload Section -->
    <h2 class="section-heading">Upload CV:</h2>

      <div class="form-group">
        <label for="cv">CV</label>
        <input type="file" @change="onFileChange" id="cv">
        <p class="validation-message">{{ cvValidationMessage }}</p>
      </div>
      <button @click="onSubmit">Submit</button>
      
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        education: "primary",
        phoneNo: "",
        cinc: "",
        age: "",
        gender: "male",
        address: "",
        dob: "",
        cv: null,
        cvValidationMessage: "",
      };
    },
    methods: {
      onFileChange(event) {
        const selectedFile = event.target.files[0];
  
        // Validate file format
        const allowedFormats = ['pdf', 'jpg', 'jpeg', 'png'];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        if (!allowedFormats.includes(fileExtension)) {
          this.cvValidationMessage = 'Please select a valid file format (PDF, JPG, JPEG, PNG)';
          return;
        } else {
          this.cvValidationMessage = "";
        }
  
        // Validate file size (2MB)
        const maxSizeMB = 2;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (selectedFile.size > maxSizeBytes) {
          this.cvValidationMessage = `File size should not exceed ${maxSizeMB}MB`;
          return;
        } else {
          this.cvValidationMessage = "";
        }
  
        // If validations pass, assign the file to the 'cv' property
        this.cv = selectedFile;
      },
      onSubmit() {
        // Your form submission logic with Axios
        const formData = new FormData();
        formData.append('firstName', this.firstName);
        formData.append('lastName', this.lastName);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('education', this.education);
        formData.append('phoneNo', this.phoneNo);
        formData.append('cinc', this.cinc);
        formData.append('age', this.age);
        formData.append('gender', this.gender);
        formData.append('address', this.address);
        formData.append('dob', this.dob);
        formData.append('cv', this.cv);
       
  
        axios.post('http://192.168.11.213:3000/registration/register-user', formData)
          .then(response => {
    // Navigate to the result page with form data as query params
    this.$router.push({
       // name: 'result', // Make sure this matches your actual route name
      query: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        education: this.education,
        phoneNo: this.phoneNo,
        cinc: this.cinc,
        age: this.age,
        gender: this.gender,
        address: this.address,  
        dob: this.dob,
        cv: this.cv ? this.cv.name : null, // Pass file name
      },
    });
  })
  .catch(error => {
    // Handle error
    console.error('Error submitting form', error);
  });
      }
    },
  };
  </script>
<style scoped>
.registration-form {
  background-color: #333;
  padding: 20px;
  width: 50%;
  margin: 0 auto;
  color: white;
}

.form-heading {
  text-align: center;
  margin-top: 5px;
}

.form-group label {
  display: inline-block;
  margin-bottom: 5px;
}

.form-group {
  margin-bottom: 15px;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
select,
input[type="date"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #555;
  color: white;
}

.radio-group {
  display: flex;
  gap: 15px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
.section-heading {
  font-size: 1.5rem;
  margin-top: 20px;
  margin-bottom: 10px;
}


@media (max-width: 600px) {
  .registration-form {
    width: 90%;
  }
}
</style>
      