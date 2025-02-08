package main

import (
	"backend/database"
	"fmt"
	"log"
)

func main() {
	fmt.Println("Running Gator-Club-Life Backend")
	database.InitDB()
	fmt.Println("Database Connection Successful!")
	log.Fatal()
}
