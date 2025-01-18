import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const token = ref(null);
  const user = ref(null);
  const users = ref(null);


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

  async function getAllUsers(){
    try {
      const response = await $fetch(`${apiUrl}/users`, {
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

  return { isLoggedIn, isAdmin, token, user, users, login, getUserInfo, logout, getAllUsers };
});
