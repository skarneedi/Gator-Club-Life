package main

import (
	"backend/database"
	"backend/middleware"
	"backend/routes"
	"fmt"
	"log"

	_ "backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

var store = session.New(session.Config{
	CookieSecure:   false, // ✅ required for localhost HTTP
	CookieHTTPOnly: true,
	CookieSameSite: "None", // ❗ this is the key fix!
	Expiration:     0,
})

func main() {
	fmt.Println("Starting Gator-Club-Life Backend...")
	database.InitDB()
	fmt.Println("Database Connection Successful!")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:4200",
		AllowCredentials: true,
	}))

	routes.SetStore(store)
	middleware.SetStore(store)

	app.Use(middleware.SessionContext())

	app.Get("/session-check", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"user_email": c.Locals("user_email"),
			"user_id":    c.Locals("user_id"),
			"user_role":  c.Locals("user_role"),
		})
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Gator-Club-Life!")
	})
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser)
	app.Post("/login", routes.Login)
	app.Post("/logout", routes.Logout)

	app.Get("/clubs", routes.GetClubs)
	app.Get("/clubs/:id", middleware.RequireAuth(), routes.GetClubByID)
	app.Get("/clubs/:id/officers", middleware.RequireAuth(), routes.GetOfficersByClubID)

	app.Get("/events", middleware.RequireAuth(), routes.GetEvents)
	app.Post("/events/send-confirmation", middleware.RequireAuth(), routes.SendRSVPConfirmation)

	app.Get("/announcements", middleware.RequireAuth(), routes.GetAnnouncements)
	app.Post("/announcements/create", middleware.RequireAuth(), routes.CreateAnnouncement)

	app.Post("/event-permits/submit", middleware.RequireAuth(), routes.SubmitFullEventPermit)
	app.Get("/submissions", middleware.RequireAuth(), routes.GetUserSubmissions)

	routes.RegisterBookingRoutes(app)

	app.Get("/debug-session", func(c *fiber.Ctx) error {
		val := c.Locals("session")
		if val == nil {
			fmt.Println("⚠️ No session attached to context")
			return c.SendString("No session found in context")
		}
		sess := val.(*session.Session)

		email := sess.Get("user_email")
		if email == nil {
			fmt.Println("⚠️ Session exists, but no user_email stored")
			return c.SendString("Session exists but no user_email set")
		}

		fmt.Println("✅ Session found for:", email)
		return c.SendString(fmt.Sprintf("Session found for: %v", email))
	})

	log.Fatal(app.Listen(":8080"))
}
