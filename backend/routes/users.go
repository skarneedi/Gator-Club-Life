package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// GetUsers godoc
// @Summary      Retrieve all users
// @Description  Returns a list of all registered users. Admin access recommended.
// @Tags         Users
// @Produce      json
// @Success      200  {array}   database.User
// @Failure      500  {object}  map[string]string
// @Router       /users [get]
func GetUsers(c *fiber.Ctx) error {
	fmt.Println("GetUsers API called")

	var users []database.User
	result := database.DB.Select("user_id, user_name, user_email, user_role, user_created_at").Find(&users)
	if result.Error != nil {
		fmt.Println("Error fetching users:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(map[string]string{
			"error": "Error retrieving users",
		})
	}

	return c.JSON(users)
}

// CreateUser godoc
// @Summary      Register a new user
// @Description  Creates a new user with name, email, password, and role.
// @Tags         Users
// @Accept       json
// @Produce      json
// @Param        user  body      database.User  true  "New user data"
// @Success      200   {object}  map[string]interface{}
// @Failure      400   {object}  map[string]string
// @Failure      500   {object}  map[string]string
// @Router       /users/create [post]
func CreateUser(c *fiber.Ctx) error {
	fmt.Println("CreateUser API called")

	var user database.User
	if err := c.BodyParser(&user); err != nil {
		fmt.Println("Error parsing request body:", err)
		return c.Status(fiber.StatusBadRequest).JSON(map[string]string{
			"error": "Invalid request: Unable to parse JSON",
		})
	}

	fmt.Printf("Decoded user: %+v\n", user)
	if user.UserName == "" || user.UserEmail == "" || user.UserRole == "" || user.UserPassword == "" {
		fmt.Println("Error: Missing required user fields")
		return c.Status(fiber.StatusBadRequest).JSON(map[string]string{
			"error": "Missing required fields: name, email, role, or password",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.UserPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(map[string]string{
			"error": "Error processing password",
		})
	}
	user.UserPassword = string(hashedPassword)

	result := database.DB.Create(&user)
	if result.Error != nil {
		fmt.Println("Error saving user to database:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(map[string]string{
			"error": "Error saving user to database",
		})
	}

	// Build a response object that omits the password field
	response := map[string]interface{}{
		"user_id":         user.UserID,
		"user_name":       user.UserName,
		"user_email":      user.UserEmail,
		"user_role":       user.UserRole,
		"user_created_at": user.UserCreatedAt,
	}

	fmt.Println("User successfully added:", response)
	return c.JSON(response)
}
