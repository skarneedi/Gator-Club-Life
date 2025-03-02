package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"

	_ "backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors" // Import CORS middleware
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

func main() {
	fmt.Println("Running Gator-Club-Life Backend")
	database.InitDB()
	fmt.Println("Database Connection Successful!")

	app := fiber.New()

	// Enable CORS to allow requests from the Angular front-end.
	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Gator-Club-Life!")
	})

	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser)
	app.Post("/login", routes.Login)

	// Swagger endpoint: Access documentation at http://localhost:8080/swagger/index.html
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	log.Fatal(app.Listen(":8080"))
}
