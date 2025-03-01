package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *fiber.Ctx) error {
	fmt.Println("GetUsers API called")

	var users []database.User
	result := database.DB.Select("user_id, user_name, user_email, user_role, user_created_at").Find(&users)
	if result.Error != nil {
		fmt.Println("Error fetching users:", result.Error)
		return c.Status(fiber.StatusInternalServerError).SendString("Error retrieving users")
	}

	return c.JSON(users)
}

func CreateUser(c *fiber.Ctx) error {
	fmt.Println("CreateUser API called")

	var user database.User
	if err := c.BodyParser(&user); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request: Unable to parse JSON")
	}

	fmt.Printf("Decoded user: %+v\n", user)
	if user.UserName == "" || user.UserEmail == "" || user.UserRole == "" || user.UserPassword == "" {
		fmt.Println("Error: Missing required user fields")
		return c.Status(fiber.StatusBadRequest).SendString("Missing required fields: name, email, role, or password")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.UserPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Error processing password")
	}
	user.UserPassword = string(hashedPassword)

	result := database.DB.Create(&user)
	if result.Error != nil {
		fmt.Println("Error saving user to database:", result.Error)
		return c.Status(fiber.StatusInternalServerError).SendString("Error saving user to database")
	}

	user.UserPassword = ""
	fmt.Println("User successfully added:", user)
	return c.JSON(user)
}
