package routes

import (
	"backend/database"
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GetUsers API called")

	var users []database.User
	result := database.DB.Select("user_id, user_name, user_email, user_role, user_created_at").Find(&users)

	if result.Error != nil {
		fmt.Println("Error fetching users:", result.Error)
		http.Error(w, "Error retrieving users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(users)
	if err != nil {
		http.Error(w, "Error encoding users to JSON", http.StatusInternalServerError)
	}
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("CreateUser API called")

	var user database.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		fmt.Println("Error decoding request body:", err)
		http.Error(w, "Invalid request: Unable to parse JSON", http.StatusBadRequest)
		return
	}

	fmt.Printf("Decoded user: %+v\n", user)

	if user.UserName == "" || user.UserEmail == "" || user.UserRole == "" || user.UserPassword == "" {
		fmt.Println("Error: Missing required user fields")
		http.Error(w, "Missing required fields: name, email, role, or password", http.StatusBadRequest)
		return
	}

	if user.UserName == "" || user.UserEmail == "" || user.UserRole == "" || user.UserPassword == "" {
		fmt.Println("Error: Missing required user fields")
		http.Error(w, "Missing required fields: name, email, role, or password", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.UserPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		http.Error(w, "Error processing password", http.StatusInternalServerError)
		return
	}
	user.UserPassword = string(hashedPassword)

	result := database.DB.Create(&user)
	if result.Error != nil {
		fmt.Println("Error saving user to database:", result.Error)
		http.Error(w, "Error saving user to database", http.StatusInternalServerError)
		return
	}

	user.UserPassword = ""

	fmt.Println("User successfully added:", user)
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(user)
	if err != nil {
		http.Error(w, "Error encoding user data to JSON", http.StatusInternalServerError)
	}
}
