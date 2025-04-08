package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// RegisterBookingRoutes registers the routes for bookings
func RegisterBookingRoutes(app *fiber.App, db *gorm.DB) {
	// Register booking-related endpoints
	app.Post("/bookings", CreateBooking)
	app.Get("/bookings", GetBookings)
}
