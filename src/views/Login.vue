<template>
	<article>
		
	  <div class="container" :class="{ 'sign-up-active': signUp }">
		<div class="overlay-container">
		  <div class="overlay">
			<div class="overlay-left" style="margin-right: 50px">
			  <h1>Welcome back!</h1>
			  <p>Please login with your personal Info!</p>
			  <button class="invert" id="signIn" @click="signUp = !signUp">Sign In</button>
			</div>
			<div class="overlay-right">
			  <h1>Hello, Friends!</h1>
			  <p>Please enter your personal details!</p>
			  <button class="invert" id="signUp" @click="signUp = !signUp">Sign Up</button>
			</div>
		  </div>
		</div>
		<!-- Sign up form -->
		<form class="sign-up" v-if="signUp" action="#" @submit.prevent="signUpSubmit">
		  <h2>Create Login:</h2>
		  <div>Use your email for registration</div>
		  <input type="text" v-model="signUpName" placeholder="Name" required />
		  <input type="email" v-model="signUpEmail" placeholder="Email" required />
		  <input type="password" v-model="signUpPassword" placeholder="Password" required />
		  <button style="margin-top: 30px">Sign Up</button>
		</form>
  
		<!-- Sign in form -->
		<form class="sign-in" v-else action="#" @submit.prevent="signInSubmit">
		  <h2>Sign In:</h2>
		  <div>Use your account</div>
		  <input type="text" v-model="signInEmail" placeholder="Email" required />
		  <input type="password" v-model="signInPassword" placeholder="Password" required />
		  <a href="#">Forget your Password?</a>
		  <button>Sign In</button>
		</form>
	  </div>
	</article>
  </template>

  <script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      signUp: false, // For toggling between Sign Up and Sign In
      signUpName: '',
      signUpEmail: '',
      signUpPassword: '',
      signInEmail: '',
      signInPassword: ''
    };
  },
  methods: {
    ...mapActions(['signUpAction', 'signInAction']),
    
    async signUpSubmit() {
      const userData = {
        name: this.signUpName,
        email: this.signUpEmail,
        password: this.signUpPassword
      };
      await this.signUpAction(userData);
      // Handle post sign-up logic, maybe navigate to another page or display a message
    },

    async signInSubmit() {
  const userData = {
    email: this.signInEmail,
    password: this.signInPassword,
  };
  await this.signInAction(userData);

  // Assuming signInAction sets the user as authenticated
  this.$router.push('/profile'); // Redirect to the profile page
}
  }
};
</script>

  
  <style lang="scss" scoped>
  .container {
	position: relative;
	margin-top: 100px;
	width: 768px;
	margin-left:100px;
	height: 480px;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 15px 30px rgba(0, 0, 0, 2), 0 10px 10px rgba(0, 0, 0, 2);
	background: linear-gradient(to bottom, #efefef, #ccc);
	@media (max-width: 568px) {
	  /* Adjust container styles for smaller screens */
	  width: 100%;
	  height: auto;
	  margin-top: 30px;
	}
  }
  .overlay-container {
	position: absolute;
	//  margin-top: 20px;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.5s ease-in-out;
	z-index: 100;
	@media (max-width: 568px) {
	  /* Adjust overlay-container styles for smaller screens */
	  width: 100%;
	  height: auto;
	  left: 0;
	  transform: none;
	}
  }
  
  .overlay {
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
	background: linear-gradient(to bottom right, #7fd625, #009345);
	color: #fff;
	transform: translateX(0);
	transition: transform 0.5s ease-in-out;
	@media (max-width: 200px) {
	  /* Adjust overlay styles for smaller screens */
	  width: 100%;
	  left: 0;
	}
  }
  
  /* Styles for the left and right overlays */
  @mixin overlays($property) {
	position: absolute;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
	flex-direction: column;
	padding: 70px 40px;
	width: calc(50% - 80px);
	height: calc(100% - 140px);
	text-align: center;
	transform: translateX($property);
	transition: transform 0.5s ease-in-out;
	@media (max-width: 200px) {
	  /* Adjust overlay-left and overlay-right styles for smaller screens */
	  width: 100%;
	  margin: 0;
	}
  }
  .overlay-left {
	@include overlays(-30%);
	margin-top: 40px;
	margin-right: 30px;
  }
  
  .overlay-right {
	/* Add your styles for the right overlay here */
	@include overlays(0);
	right: 0;
	margin-top: 40px;
	margin-left: 20px;
	@media (max-width: 200px) {
	  /* Adjust overlay-left and overlay-right styles for smaller screens */
	  width: 100%;
	  margin: 0;
	}
  }
  h2 {
	margin: 0;
  }
  p {
	margin: 20px 0 30px;
  }
  a {
	color: #222;
	text-decoration: none;
	margin: 15px 0;
	font-size: 1rem;
  }
  button {
	border-radius: 20px;
	border: 1px solid #009345;
	background-color: #009345;
	color: #fff;
	font-size: 1rem;
	font-weight: bold;
	padding: 10px 40px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 0.1s ease-in;
	&:active {
	  transform: scale(0.9);
	}
	&:focus {
	  outline: none;
	}
  }
  button .invert {
	background-color: transparent;
	border-color: #fff;
  }
  form {
	position: absolute;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
	flex-direction: column;
	padding: 90px 60px;
	width: calc(50% - 2px);
	height: calc(100% - 50px);
	text-align: center;
	background: linear-gradient(to bottom, #efefef, #ccc);
	transition: all 0.5s ease-in-out;
	@media (max-width: 200px) {
	  /* Adjust form styles for smaller screens */
	  width: 100%;
	  padding: 50px 20px;
	}
  
	div {
	  font-size: 1rem;
	}
	input {
	  background-color: #eee;
	  border: none;
	  padding: 8px 15px;
	  margin: 6px 0;
	  width: calc(100% - 30px);
	  border-radius: 15px;
	  border-bottom: 1px solid #ddd;
	  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 -1px 1px #fff, 0 1px 0 #fff;
	  overflow: hidden;
	  &:focus {
		outline: none;
		background-color: #fff;
	  }
	}
  }
  .sign-in {
	left: 0;
	z-index: 2;
	@media (max-width: 200px) {
	  /* Adjust sign-up and sign-in styles for smaller screens */
	  width: 100%;
	  left: 0;
	}
  }
  .sign-up {
	left: 0;
	z-index: 1;
	opacity: 0;
	@media (max-width: 200px) {
	  /* Adjust sign-up and sign-in styles for smaller screens */
	  width: 100%;
	  left: 0;
	}
  }
  .sign-up-active {
	.sign-in {
	  transform: translateX(100%);
	}
	.sign-up {
	  transform: translateX(100%);
	  opacity: 1;
	  z-index: 5;
	  animation: show;
	}
	.overlay-container {
	  transform: translateX(-100%);
	}
	.overlay {
	  transform: translateX(50%);
	}
	.overlay-left {
	  transform: translateX(0);
	}
	.overlay-right {
	  transform: translateX(20%);
	}
  }
  @keyframes show {
	0% {
	  opacity: 0;
	  z-index: 1;
	}
	49% {
	  opacity: 0;
	  z-index: 1;
	}
	50% {
	  opacity: 0;
	  z-index: 1;
	}
  }
  </style>

  