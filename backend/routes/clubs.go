package routes

import (
	"backend/database"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetClubs godoc
// @Summary      Retrieve clubs
// @Description  Retrieves all clubs or filters by category (case-insensitive) if a query parameter is provided
// @Tags         Clubs
// @Produce      json
// @Param        category  query     string  false  "Filter clubs by category"
// @Success      200  {array}   database.Club  "List of clubs"
// @Failure      500  {object}  map[string]string "Error retrieving clubs"
// @Router       /clubs [get]
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
