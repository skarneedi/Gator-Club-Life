package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// Logout handles user logout by destroying the current session.
func Logout(c *fiber.Ctx) error {
	fmt.Println("Logout API called")

	// Retrieve the current session.
	sess, err := Store.Get(c)
	if err != nil {
		fmt.Println("Error retrieving session for logout:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(map[string]string{
			"message": "Could not retrieve session",
		})
	}
	fmt.Println("Session retrieved successfully for logout.")

	// Destroy the session.
	if err := sess.Destroy(); err != nil {
		fmt.Println("Error destroying session:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(map[string]string{
			"message": "Could not destroy session",
		})
	}
	fmt.Println("Session destroyed successfully for logout.")

	return c.JSON(map[string]string{
		"message": "Logout successful",
	})
}
