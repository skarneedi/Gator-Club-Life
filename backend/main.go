package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"

	_ "backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

func main() {
	fmt.Println("Running Gator-Club-Life Backend")
	database.InitDB()
	fmt.Println("Database Connection Successful!")

	app := fiber.New()
	app.Use(cors.New())

	// Initialize session store.
	store := session.New()
	routes.SetStore(store)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Gator-Club-Life!")
	})

	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser)
	app.Post("/login", routes.Login)
	app.Post("/logout", routes.Logout) // Added Logout endpoint.
	app.Get("/swagger/*", fiberSwagger.WrapHandler)
	app.Get("/clubs", routes.GetClubs)
	app.Get("/events", routes.GetEvents)
	app.Get("/bookings", routes.GetBookings)
	app.Post("/bookings/create", routes.CreateBooking)

	log.Fatal(app.Listen(":8080"))
}
