package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message string `json:"message"`
}

func Login(c *fiber.Ctx) error {
	fmt.Println("Login API called")

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println("Error parsing login request:", err)
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request: Unable to parse JSON")
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Missing required fields: email and password")
	}

	var user database.User
	result := database.DB.Where("user_email = ?", req.Email).First(&user)
	if result.Error != nil {
		fmt.Println("User not found or error:", result.Error)
		return c.Status(fiber.StatusUnauthorized).SendString("Invalid email or password")
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.UserPassword), []byte(req.Password))
	if err != nil {
		fmt.Println("Password mismatch:", err)
		return c.Status(fiber.StatusUnauthorized).SendString("Invalid email or password")
	}

	resp := LoginResponse{
		Message: "Login successful",
	}

	return c.JSON(resp)
}
