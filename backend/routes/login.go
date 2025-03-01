package routes

import (
	"backend/database"
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Login API called")

	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Println("Error decoding login request:", err)
		http.Error(w, "Invalid request: Unable to parse JSON", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" {
		http.Error(w, "Missing required fields: email and password", http.StatusBadRequest)
		return
	}

	var user database.User
	result := database.DB.Where("user_email = ?", req.Email).First(&user)
	if result.Error != nil {
		fmt.Println("User not found or error:", result.Error)
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.UserPassword), []byte(req.Password))
	if err != nil {
		fmt.Println("Password mismatch:", err)
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	resp := LoginResponse{
		Message: "Login successful",
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		http.Error(w, "Error encoding response to JSON", http.StatusInternalServerError)
	}
}
