package routes

import (
	"backend/database"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetBookings retrieves all bookings or filters by user_id
func GetBookings(c *fiber.Ctx) error {
	userID := c.Query("user_id")
	var bookings []database.Booking
	var result *gorm.DB

	// If user_id is provided, filter the bookings
	if userID != "" {
		result = database.DB.Where("user_id = ?", userID).Find(&bookings)
	} else {
		result = database.DB.Find(&bookings)
	}

	// If there's an error retrieving bookings
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving bookings",
		})
	}

	return c.JSON(bookings)
}

// CreateBooking creates a new booking in the system
func CreateBooking(c *fiber.Ctx) error {
	var booking database.Booking

	// Parse the request body into the booking struct
	if err := c.BodyParser(&booking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request data",
			"error":   err.Error(),
		})
	}

	// Save the booking to the database
	if err := database.DB.Create(&booking).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating booking",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(booking)
}
