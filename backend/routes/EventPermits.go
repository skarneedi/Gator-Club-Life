package routes

import (
	"backend/database"

	"github.com/gofiber/fiber/v2"
)

func SubmitFullEventPermit(c *fiber.Ctx) error {
	type FullPermitPayload struct {
		EventPermit database.EventPermit     `json:"event_permit"`
		Slots       []database.EventSlot     `json:"slots"`
		Documents   []database.EventDocument `json:"documents"`
	}

	var payload FullPermitPayload

	// Parse JSON body
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input data",
			"error":   err.Error(),
		})
	}

	// 🆕 Get submitted_by from session
	submittedBy := c.Locals("user_email")
	if submittedBy == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "User not logged in or session missing",
		})
	}
	payload.EventPermit.SubmittedBy = submittedBy.(string)

	// Insert Event Permit
	if err := database.DB.Create(&payload.EventPermit).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error saving permit",
			"error":   err.Error(),
		})
	}

	// Link EventID to slots and documents
	for i := range payload.Slots {
		payload.Slots[i].EventID = payload.EventPermit.EventPermitID
	}
	for i := range payload.Documents {
		payload.Documents[i].EventID = payload.EventPermit.EventPermitID
	}

	// Insert Slots & Documents
	if len(payload.Slots) > 0 {
		if err := database.DB.Create(&payload.Slots).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error saving slots",
				"error":   err.Error(),
			})
		}
	}
	if len(payload.Documents) > 0 {
		if err := database.DB.Create(&payload.Documents).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error saving documents",
				"error":   err.Error(),
			})
		}
	}

	// Success Response
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Event permit submitted successfully",
		"id":      payload.EventPermit.EventPermitID,
	})
}
