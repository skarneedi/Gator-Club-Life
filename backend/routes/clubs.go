package routes

import (
	"backend/database"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetClubs(c *fiber.Ctx) error {
	fmt.Println("GetClubs API called")
	category := c.Query("category")
	var clubs []database.Club
	var result *gorm.DB

	if category != "" {
		normalizedCategory := "%" + strings.ToLower(category) + "%"
		fmt.Println("Filtering clubs by category:", normalizedCategory)
		result = database.DB.Where("LOWER(club_category) LIKE ?", normalizedCategory).Find(&clubs)
	} else {
		result = database.DB.Find(&clubs)
	}

	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving clubs",
		})
	}

	return c.JSON(clubs)
}

// GetClubByID handles GET /clubs/:id
func GetClubByID(c *fiber.Ctx) error {
	fmt.Println("GetClubByID API called")
	clubID := c.Params("id")
	var club database.Club

	if err := database.DB.First(&club, clubID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Club not found",
			"error":   err.Error(),
		})
	}

	return c.JSON(club)
}
