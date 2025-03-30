package routes

import (
	"backend/database"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetAnnouncements(c *fiber.Ctx) error {
	fmt.Println("GetAnnouncements API called")

	var announcements []database.Announcement
	result := database.DB.Order("announcement_created_at desc").Find(&announcements)
	if result.Error != nil {
		fmt.Println("Error fetching announcements:", result.Error)
		return c.Status(fiber.StatusInternalServerError).SendString("Error retrieving announcements")
	}

	return c.JSON(announcements)
}

func CreateAnnouncement(c *fiber.Ctx) error {
	fmt.Println("CreateAnnouncement API called")

	var ann database.Announcement
	if err := c.BodyParser(&ann); err != nil {
		fmt.Println("Error parsing body:", err)
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}

	// Basic field validation
	if ann.AnnouncementTitle == "" || ann.AnnouncementMessage == "" || ann.AnnouncementCreatedBy == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("Missing required fields")
	}

	// Role validation: only admins can post
	var user database.User
	result := database.DB.First(&user, ann.AnnouncementCreatedBy)
	if result.Error != nil {
		fmt.Println("Error finding user:", result.Error)
		return c.Status(fiber.StatusBadRequest).SendString("User not found")
	}
	if user.UserRole != "admin" {
		fmt.Println("Unauthorized attempt to post announcement by:", user.UserRole)
		return c.Status(fiber.StatusUnauthorized).SendString("Only admins can post announcements")
	}

	// Set timestamp
	ann.AnnouncementCreatedAt = time.Now()

	// Save to DB
	if err := database.DB.Create(&ann).Error; err != nil {
		fmt.Println("Error saving announcement:", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Error saving announcement")
	}

	return c.JSON(ann)
}
