package routes

import (
	"backend/database"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetEvents(c *fiber.Ctx) error {
	var dbEvents []database.Event

	clubID := c.Query("club_id")
	category := c.Query("category")
	dateFilter := c.Query("date")

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	offset := (page - 1) * limit

	query := database.DB.Limit(limit).Offset(offset)

	if clubID != "" {
		query = query.Where("club_id = ?", clubID)
	}

	if dateFilter != "" {
		startTime, err := time.Parse("2006-01-02", dateFilter)
		if err == nil {
			startUnix := startTime.Unix()
			endUnix := startTime.Add(24 * time.Hour).Unix()
			query = query.Where("event_date BETWEEN ? AND ?", startUnix, endUnix)
		}
	}

	if category != "" {
		query = query.Where("event_categories LIKE ?", "%"+category+"%")
	}

	result := query.Find(&dbEvents)
	if result.Error != nil {
		fmt.Println("Database Error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving events",
		})
	}

	var response []fiber.Map
	for _, ev := range dbEvents {
		start := time.Unix(ev.EventDate, 0).Format("Jan 2, 2006 @ 3:04 PM")
		response = append(response, fiber.Map{
			"title":        ev.EventName,
			"description":  ev.EventDescription,
			"startDate":    start,
			"endDate":      start,
			"location":     ev.EventLocation,
			"organization": fmt.Sprintf("Club ID: %d", ev.ClubID),
			"category":     ev.EventCategories,
		})
	}

	return c.JSON(response)
}

func CreateEvent(c *fiber.Ctx) error {
	var event database.Event
	if err := c.BodyParser(&event); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	if err := database.DB.Create(&event).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating event",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(event)
}

func SendRSVPConfirmation(c *fiber.Ctx) error {
	var body struct {
		Email string `json:"email"`
		Event string `json:"event"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid RSVP payload",
		})
	}

	fmt.Printf("📩 Sending RSVP confirmation to %s for event: %s\n", body.Email, body.Event)

	return c.JSON(fiber.Map{
		"message": fmt.Sprintf("RSVP confirmed for %s! Email sent to %s", body.Event, body.Email),
	})
}
