import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Student from '../views/Registrationdata.vue'
import Teacher from '../views/RegistrationForm.vue'
import Dashboard from '../views/Dashboard.vue'
import Result from '../views/Result.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/home',
			component: Home
		},
		{
			path: '/login',
			component: () => import('../views/Login.vue')
		},
		{
			path: '/profile',
			component: () => import('../views/Profile.vue')
		},
		{
			path: '/registrationdata',
			component: () => import('../views/Registrationdata.vue')
		},
		{
			path: '/registrationform',
			component: () => import('../views/RegistrationForm.vue')
		},
		{
			path: '/dashboard',
			component: () => import('../views/Dashboard.vue')
		},
		{
			path: '/result',
			name: 'result',
			component: Result,
			meta: { hideSidebar: true }, // Add this line to hide the sidebar on this route
		  },
		
	],
});


export default router

