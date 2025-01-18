import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const token = ref(null);
  const user = ref(null);
  const users = ref([]);


  const isLoggedIn = computed(() => {
    return user.value ? user.value.name : ''
  })

  const isAdmin = computed(() => {
    return user.value ? user.value.role === 'Administrator' : false
  })

  async function login(apiUrl, loginFormData) {
    try {
      const response = await $fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: loginFormData,
      });

      if (response) {
        token.value = response; // Assume response._data contains the token
        localStorage.setItem("token", token.value);
        await getUserInfo(apiUrl); // Fetch user information after login
      } else {
        throw new Error(`Login failed with status ${response.status}`);
      }
    } catch (e) {
      console.error("Login request failed:", e);
      throw e; // Re-throw error for handling in the component
    }
  }

  async function getUserInfo(apiUrl) {
    try {
      const response = await $fetch(`${apiUrl}/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      });
  
      // Validate and assign the user data
      if (response && response.username) {
        user.value = response; // Directly assign the response as the user object
        console.log("User info successfully retrieved:", response);
      } else {
        console.error("Unexpected response structure:", response);
        throw new Error("Invalid user info response format.");
      }
    } catch (e) {
      console.error("Get user info request failed:", e.message || e);
      throw e; // Re-throw to handle in the calling code
    }
  }
  
  

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  }

  async function getAllUsers(apiUrl){
    try {
      const response = await $fetch(`${apiUrl}/client`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      });
  
      // Validate and assign the user data
      if (response) {
        users.value = response; 
        console.log("Users info successfully retrieved:", response);
      } else {
        console.error("Unexpected response structure:", response);
        throw new Error("Invalid user info response format.");
      }
    } catch (e) {
      console.error("Get user info request failed:", e.message || e);
      throw e; // Re-throw to handle in the calling code
    }
  }

  async function createUser(apiUrl, userData) {
    try {
      const response = await $fetch(`${apiUrl}/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: userData,
      });
  
      // Optionally add the new user to the existing users list
      users.value.push(response);
  
      console.log("User created successfully:", response);
      return response; // Return the created user for further use
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  }

  async function fetchClientDetails(apiUrl, username) {
    try {
      const response = await $fetch(`${apiUrl}/client/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      });
  
      if (response && response.username) {
        console.log("Client details fetched successfully:", response);
        return response; // Return the client details
      } else {
        throw new Error("Invalid API response structure.");
      }
    } catch (error) {
      console.error("Error in fetchClientDetails:", error.message || error);
  
      // Re-throw the error with additional context
      throw {
        message: error.message,
        response: error.response, // Include response for status handling
      };
    }
  }
  
  

  return { isLoggedIn, isAdmin, token, user, users, login, getUserInfo, logout, getAllUsers, createUser, fetchClientDetails };
});
