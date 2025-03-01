package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	fmt.Println("Running Gator-Club-Life Backend")
	database.InitDB()
	fmt.Println("Database Connection Successful!")

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Gator-Club-Life!")
	})

	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser)
	app.Post("/login", routes.Login)

	log.Fatal(app.Listen(":8080"))
}
