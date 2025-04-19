package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message       string `json:"message"`
	UserID        uint   `json:"user_id"`
	UserName      string `json:"user_name"`
	UserEmail     string `json:"user_email"`
	UserRole      string `json:"user_role"`
	UserCreatedAt int64  `json:"user_created_at"`
}

var Store *session.Store

func SetStore(s *session.Store) {
	Store = s
}

func Login(c *fiber.Ctx) error {
	fmt.Println("Login API called")

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println("❌ JSON parse error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request format",
		})
	}

	var user database.User
	result := database.DB.Where("user_email = ?", req.Email).First(&user)
	if result.Error != nil {
		fmt.Println("❌ User not found:", result.Error)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Email not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.UserPassword), []byte(req.Password)); err != nil {
		fmt.Println("❌ Incorrect password")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Incorrect password",
		})
	}

	fmt.Println("User authenticated:", user.UserEmail)

	// 🧠 Create new session and save details
	sess, err := Store.Get(c)
	if err != nil {
		fmt.Println("❌ Failed to create session:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not create session",
		})
	}

	sess.Set("user_id", user.UserID)
	sess.Set("user_email", user.UserEmail)
	sess.Set("user_role", user.UserRole)

	if err := sess.Save(); err != nil {
		fmt.Println("❌ Failed to save session:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Session save failed",
		})
	}

	return c.JSON(LoginResponse{
		Message:       "Login successful",
		UserID:        user.UserID,
		UserName:      user.UserName,
		UserEmail:     user.UserEmail,
		UserRole:      user.UserRole,
		UserCreatedAt: user.UserCreatedAt,
	})
}
