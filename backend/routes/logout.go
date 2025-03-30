package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// LogoutResponse represents the response structure for logout.
// @Description Response message after a successful logout.
type LogoutResponse struct {
	Message string `json:"message"`
}

// Logout godoc
// @Summary      Logout a user
// @Description  Destroys the current session and logs out the user.
// @Tags         Authentication
// @Produce      json
// @Success      200  {object}  LogoutResponse  "Logout successful"
// @Failure      500  {object}  LogoutResponse  "Error during logout"
// @Router       /logout [post]
func Logout(c *fiber.Ctx) error {
	fmt.Println("Logout API called")

	// Retrieve the current session.
	sess, err := Store.Get(c)
	if err != nil {
		fmt.Println("Error retrieving session for logout:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(LogoutResponse{
			Message: "Could not retrieve session",
		})
	}
	fmt.Println("Session retrieved successfully for logout.")

	// Destroy the session.
	if err := sess.Destroy(); err != nil {
		fmt.Println("Error destroying session:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(LogoutResponse{
			Message: "Could not destroy session",
		})
	}
	fmt.Println("Session destroyed successfully for logout.")

	return c.JSON(LogoutResponse{
		Message: "Logout successful",
	})
}
