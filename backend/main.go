package main

import (
	"backend/database"
	"backend/routes"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Running Gator-Club-Life Backend")
	database.InitDB()
	fmt.Println("Database Connection Successful!")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Welcome to Gator-Club-Life!")
	})
	http.HandleFunc("/users", routes.GetUsers)
	http.HandleFunc("/users/create", routes.CreateUser)
	http.HandleFunc("/login", routes.Login)

	fmt.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
