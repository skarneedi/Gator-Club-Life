package routes

import (
	"backend/database"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetClubs(c *fiber.Ctx) error {
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
