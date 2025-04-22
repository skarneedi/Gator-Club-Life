package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"

	_ "backend/docs" // Swagger docs

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

// Initialize the database and migrations
func init() {
	// Initialize the database connection
	database.InitDB()
	fmt.Println("Database connection established.")

	// Migrate the necessary models for the application
	if err := database.DB.AutoMigrate(&database.Event{}, &database.User{}, &database.Announcement{}); err != nil {
		fmt.Println("Failed to migrate models:", err)
	}
}

// main function to set up the Fiber app and routes
func main() {
	// Create a new Fiber app
	app := fiber.New()

	// Enable CORS to allow cross-origin requests (useful for frontend and testing)
	app.Use(cors.New())

	// Enable logger middleware (optional but useful for debugging)
	app.Use(logger.New())

	// Set up the routes
	setupRoutes(app)

	// Set up Swagger documentation (optional, if using Swagger for API docs)
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	// Start the server on port 8080
	log.Fatal(app.Listen(":8080"))
}

// setupRoutes sets up the routes for the app, including those for events and RSVP confirmation
func setupRoutes(app *fiber.App) {
	// Events routes
	app.Get("/events", routes.GetEvents)                               // Get all events
	app.Post("/events/send-confirmation", routes.SendRSVPConfirmation) // Send RSVP confirmation
	app.Post("/announcements/create", routes.CreateAnnouncement)       // Create an announcement

	// Other potential routes (e.g., for user management, etc.)
	// app.Get("/users", routes.GetUsers)
	// app.Post("/users", routes.CreateUser)
}
