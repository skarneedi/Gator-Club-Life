package routes

import (
	"backend/database"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetEvents retrieves all events or filters by club ID
func GetEvents(c *fiber.Ctx) error {
	clubID := c.Query("club_id")
	var events []database.Event
	var result *gorm.DB

	// Debugging: log the query and parameters
	if clubID != "" {
		fmt.Println("Fetching events for club_id:", clubID)
		// Use Debug() to log the SQL query
		result = database.DB.Where("club_id = ?", clubID).Debug().Find(&events)
	} else {
		fmt.Println("Fetching all events")
		// Use Debug() to log the SQL query
		result = database.DB.Debug().Find(&events)
	}

	// Check if result is nil
	if result == nil {
		fmt.Println("Error: Result is nil")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving events - result is nil",
		})
	}

	// Check if any error occurred during the query
	if result.Error != nil {
		fmt.Println("Database Error:", result.Error) // Prints the error if any
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving events",
		})
	}

	// Debugging: print events fetched
	fmt.Println("Fetched Events:", events)

	if len(events) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No events found",
		})
	}

	return c.JSON(events)
}

// CreateEvent adds a new event
func CreateEvent(c *fiber.Ctx) error {
	var event database.Event
	if err := c.BodyParser(&event); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	if err := database.DB.Create(&event).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating event",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(event)
}
