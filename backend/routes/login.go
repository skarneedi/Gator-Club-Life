package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"golang.org/x/crypto/bcrypt"
)

// LoginRequest represents the expected JSON payload for login.
type LoginRequest struct {
	Email    string `json:"email"`    // User's email address
	Password string `json:"password"` // User's password
}

// LoginResponse now includes a userName field so the frontend can display the user’s name.
type LoginResponse struct {
	Message  string `json:"message"`
	UserName string `json:"userName"`
}

// Session store variable.
var Store *session.Store

// SetStore allows setting the session store from main.go.
func SetStore(s *session.Store) {
	Store = s
}

// Login handles user login requests using Fiber's context.
func Login(c *fiber.Ctx) error {
	fmt.Println("Login API called")

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println("Error parsing login request:", err)
		return c.Status(fiber.StatusBadRequest).JSON(map[string]string{
			"message": "Invalid request: Unable to parse JSON",
		})
	}

	fmt.Printf("Login attempt for email: %s\n", req.Email)

	if req.Email == "" || req.Password == "" {
		fmt.Println("Missing required fields for email or password")
		return c.Status(fiber.StatusBadRequest).JSON(map[string]string{
			"message": "Missing required fields: email and password",
		})
	}

	var user database.User
	result := database.DB.Where("user_email = ?", req.Email).First(&user)
	if result.Error != nil {
		fmt.Println("User not found or error:", result.Error)
		return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
			"message": "Invalid email or account not found",
		})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.UserPassword), []byte(req.Password))
	if err != nil {
		fmt.Printf("Password mismatch for email: %s, error: %v\n", req.Email, err)
		return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
			"message": "Incorrect password",
		})
	}

	fmt.Println("User authenticated successfully:", req.Email)

	// Create a new session for the user.
	sess, err := Store.Get(c)
	if err != nil {
		fmt.Println("Error retrieving session for user:", req.Email, "Error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(map[string]string{
			"message": "Could not create session",
		})
	}

	sess.Set("user_id", user.UserID)
	sess.Set("user_email", user.UserEmail)
	sess.Set("user_role", user.UserRole)
	if err := sess.Save(); err != nil {
		fmt.Println("Error saving session for user:", req.Email, "Error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(map[string]string{
			"message": "Could not save session",
		})
	}

	fmt.Println("Session created successfully for user:", req.Email)

	// Return the user’s name in the response so the frontend can display it.
	resp := LoginResponse{
		Message:  "Login successful",
		UserName: user.UserName, // from the database.User struct
	}
	return c.JSON(resp)
}
