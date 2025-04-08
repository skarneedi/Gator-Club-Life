package routes

import (
	"backend/database"

	"github.com/gofiber/fiber/v2"
)

// GetBookings retrieves bookings with optional filters
func GetBookings(c *fiber.Ctx) error {
	userID := c.Query("user_id")
	eventID := c.Query("event_id")
	bookingStatus := c.Query("booking_status")

	var bookings []database.Booking
	query := database.DB

	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}
	if eventID != "" {
		query = query.Where("event_id = ?", eventID)
	}
	if bookingStatus != "" {
		query = query.Where("booking_status = ?", bookingStatus)
	}

	if err := query.Find(&bookings).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving bookings",
			"error":   err.Error(),
		})
	}

	return c.JSON(bookings)
}

// CreateBooking creates a new booking
func CreateBooking(c *fiber.Ctx) error {
	var booking database.Booking

	if err := c.BodyParser(&booking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request data",
			"error":   err.Error(),
		})
	}

	if err := database.DB.Create(&booking).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating booking",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(booking)
}
