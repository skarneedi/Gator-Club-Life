package routes

import (
	"backend/database"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetAnnouncements godoc
// @Summary      Retrieve all announcements
// @Description  Retrieves all announcements in descending order by creation date
// @Tags         Announcements
// @Produce      json
// @Success      200  {array}   database.Announcement  "List of announcements"
// @Failure      500  {string}  string                 "Error retrieving announcements"
// @Router       /announcements [get]
func GetAnnouncements(c *fiber.Ctx) error {
	fmt.Println("GetAnnouncements API called")

	clubID := c.Query("club_id")
	var announcements []database.Announcement

	var result *gorm.DB
	if clubID != "" {
		// Filter by club_id if query param exists
		result = database.DB.Where("club_id = ?", clubID).Order("announcement_created_at desc").Find(&announcements)
	} else {
		result = database.DB.Order("announcement_created_at desc").Find(&announcements)
	}

	if result.Error != nil {
		fmt.Println("Error fetching announcements:", result.Error)
		return c.Status(fiber.StatusInternalServerError).SendString("Error retrieving announcements")
	}

	return c.JSON(announcements)
}

// CreateAnnouncement godoc
// @Summary      Create a new announcement
// @Description  Allows an admin user to create a new announcement
// @Tags         Announcements
// @Accept       json
// @Produce      json
// @Param        announcement  body      database.Announcement  true  "Announcement data"
// @Success      200  {object} database.Announcement "Successfully created announcement"
// @Failure      400  {string} string   "Invalid request body or missing required fields"
// @Failure      401  {string} string   "Only admins can post announcements"
// @Failure      500  {string} string   "Error saving announcement"
// @Router       /announcements/create [post]
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
