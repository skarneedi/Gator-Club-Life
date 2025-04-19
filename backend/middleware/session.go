package middleware

import (
	"backend/routes"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func SessionContext() fiber.Handler {
	return func(c *fiber.Ctx) error {
		sess, err := routes.Store.Get(c)
		if err != nil {
			fmt.Println("Failed to get session:", err)
			return c.Next()
		}

		userEmail := sess.Get("user_email")
		userID := sess.Get("user_id")
		userRole := sess.Get("user_role")

		c.Locals("user_email", userEmail)
		c.Locals("user_id", userID)
		c.Locals("user_role", userRole)

		return c.Next()
	}
}
