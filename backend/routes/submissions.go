package routes

import (
	"backend/database"

	"github.com/gofiber/fiber/v2"
)

// Summary struct for My Permits table
type PermitSummary struct {
	ID          uint   `json:"id"`
	EventName   string `json:"event_name"`
	SubmittedBy string `json:"submitted_by"`
	Status      string `json:"status"`
	SlotCount   int    `json:"slot_count"`
}

func GetUserSubmissions(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing email query parameter",
		})
	}

	var permits []database.EventPermit
	err := database.DB.Preload("Slots").Where("submitted_by = ?", email).Find(&permits).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch submissions",
		})
	}

	var summaries []PermitSummary
	for _, p := range permits {
		summary := PermitSummary{
			ID:          p.EventPermitID,
			EventName:   p.EventName,
			SubmittedBy: p.SubmittedBy,
			Status:      p.Status,
			SlotCount:   len(p.Slots),
		}
		summaries = append(summaries, summary)
	}

	return c.JSON(summaries)
}
