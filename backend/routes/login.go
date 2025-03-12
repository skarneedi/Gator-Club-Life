package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// LoginRequest represents the expected JSON payload for login.
// @Description Login credentials for the user.
type LoginRequest struct {
	Email    string `json:"email"`    // User's email address
	Password string `json:"password"` // User's password
}

// LoginResponse represents the JSON response after a successful login.
// @Description Response message after a successful login.
type LoginResponse struct {
	Message string `json:"message"`
}

// Login handles user login requests using Fiber's context.
// @Summary Login a user
// @Description Authenticate a user and return a success message.
// @Tags Authentication
// @Accept json
// @Produce json
// @Param login body LoginRequest true "Login credentials"
// @Success 200 {object} LoginResponse "Login successful"
// @Failure 400 {object} map[string]string "Missing required fields"
// @Failure 401 {object} map[string]string "Invalid email or account not found or incorrect password"
// @Router /login [post]
func Login(c *fiber.Ctx) error {
	fmt.Println("Login API called")

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println("Error parsing login request:", err)
		return c.Status(fiber.StatusBadRequest).JSON(map[string]string{
			"message": "Invalid request: Unable to parse JSON",
		})
	}

	if req.Email == "" || req.Password == "" {
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
		fmt.Println("Password mismatch:", err)
		return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
			"message": "Incorrect password",
		})
	}

	resp := LoginResponse{
		Message: "Login successful",
	}

	return c.JSON(resp)
}
