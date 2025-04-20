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

// ✅ Shared session store across routes and middleware
var store = session.New(session.Config{
	CookieSecure:   false, // allow HTTP for local dev
	CookieHTTPOnly: true,  // prevent JavaScript access
	CookieSameSite: "Lax", // allow cookie on cross-origin form submits
})

func main() {
	fmt.Println("Starting Gator-Club-Life Backend...")
	database.InitDB()
	fmt.Println("Database Connection Successful!")

	app := fiber.New()

	// ✅ Enable CORS with credentials to allow cookies
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:4200", // your Angular frontend
		AllowCredentials: true,
	}))

	// ✅ Set session store and middleware
	routes.SetStore(store)
	app.Use(middleware.SessionContext())

	// ✅ Debug route to check session
	app.Get("/session-check", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"user_email": c.Locals("user_email"),
			"user_id":    c.Locals("user_id"),
			"user_role":  c.Locals("user_role"),
		})
	})

	// ✅ Base routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Gator-Club-Life!")
	})
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	// ✅ Auth routes
	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser)
	app.Post("/login", routes.Login)
	app.Post("/logout", routes.Logout)

	// ✅ Core feature routes
	app.Get("/clubs", routes.GetClubs)
	app.Get("/events", routes.GetEvents)
	app.Get("/announcements", routes.GetAnnouncements)
	app.Post("/announcements/create", routes.CreateAnnouncement)

	// ✅ Event permit & submission
	app.Post("/event-permits/submit", routes.SubmitFullEventPermit)
	app.Get("/submissions", routes.GetUserSubmissions)

	// ✅ Bookings & club details
	routes.RegisterBookingRoutes(app)
	app.Get("/clubs/:id", routes.GetClubByID)
	app.Get("/clubs/:id/officers", routes.GetOfficersByClubID)

	log.Fatal(app.Listen(":8080"))
}
