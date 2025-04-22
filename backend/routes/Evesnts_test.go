package routes_test

import (
	"backend/database"
	"backend/routes"
	"backend/testutils"
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

// Setup the routes for events
func setupEventsApp() *fiber.App {
	app := fiber.New()
	app.Get("/events", routes.GetEvents)
	app.Post("/events/send-confirmation", routes.SendRSVPConfirmation)
	app.Post("/events/create", routes.CreateEvent) // Added for event creation test
	return app
}

// Test the GetEvents endpoint
func TestGetEvents(t *testing.T) {
	t.Log("Starting TestGetEvents")
	testutils.InitTestDB(t)

	// Insert some test events
	event := database.Event{
		EventName:        "Test Event",
		EventDescription: "A test event for unit testing.",
		EventLocation:    "Test Location",
		EventCategories:  "Test Category",
		EventDate:        1622541600, // Unix timestamp for testing
		ClubID:           1,
	}

	// Add the event to the test DB
	if err := database.DB.Create(&event).Error; err != nil {
		t.Fatalf("Failed to insert test event: %v", err)
	}

	// Initialize the app
	app := setupEventsApp()

	// Create the request
	req := httptest.NewRequest("GET", "/events", nil)

	// Execute the request
	resp, err := app.Test(req)

	// Ensure the request was successful
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}

	// Assert the status code is 200 OK
	assert.Equal(t, 200, resp.StatusCode, "Expected status 200")

	// Further assertions on the response body
	var events []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&events); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Ensure that at least 1 event is returned
	assert.Len(t, events, 1, "Expected 1 event to be returned")
}

// Test the SendRSVPConfirmation endpoint
func TestSendRSVPConfirmation(t *testing.T) {
	t.Log("Starting TestSendRSVPConfirmation")
	testutils.InitTestDB(t)

	// Create a mock controller
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	// Create the mock email service
	mockEmailService := routes.NewMockEmailService(ctrl)
	mockEmailService.EXPECT().SendEmail(gomock.Any(), gomock.Any(), gomock.Any()).Return(nil).Times(1)

	// Set the mock email service in the routes package
	routes.EmailService = mockEmailService

	// Initialize the app
	app := setupEventsApp()

	// Create request payload
	payload := map[string]string{
		"email": "user@example.com",
		"event": "Test Event",
	}
	body, _ := json.Marshal(payload)

	// Create the request
	req := httptest.NewRequest("POST", "/events/send-confirmation", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	resp, err := app.Test(req)

	// Ensure the request was successful
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}

	// Assert the status code is 200 OK
	assert.Equal(t, 200, resp.StatusCode, "Expected status 200")

	// Further assertions can be made based on response
	var response map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Ensure the message indicates the email was sent
	assert.Equal(t, "RSVP confirmed and email sent!", response["message"], "Expected confirmation message")
}

// Test SendRSVPConfirmation with missing fields
func TestSendRSVPConfirmationMissingFields(t *testing.T) {
	t.Log("Starting TestSendRSVPConfirmationMissingFields")
	testutils.InitTestDB(t)

	// Initialize the app
	app := setupEventsApp()

	// Create request payload with missing fields
	payload := map[string]string{}
	body, _ := json.Marshal(payload)

	// Create the request
	req := httptest.NewRequest("POST", "/events/send-confirmation", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	resp, err := app.Test(req)

	// Ensure the request was successful
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}

	// Assert the status code is 400 Bad Request
	assert.Equal(t, 400, resp.StatusCode, "Expected status 400 for missing fields")
}

// Test SendRSVPConfirmation with an invalid email
func TestSendRSVPConfirmationInvalidEmail(t *testing.T) {
	t.Log("Starting TestSendRSVPConfirmationInvalidEmail")
	testutils.InitTestDB(t)

	// Initialize the app
	app := setupEventsApp()

	// Create request payload with an invalid email
	payload := map[string]string{
		"email": "invalid-email",
		"event": "Test Event",
	}
	body, _ := json.Marshal(payload)

	// Create the request
	req := httptest.NewRequest("POST", "/events/send-confirmation", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	resp, err := app.Test(req)

	// Ensure the request was successful
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}

	// Assert the status code is 400 Bad Request for invalid email
	assert.Equal(t, 400, resp.StatusCode, "Expected status 400 for invalid email format")
}

// Test CreateEvent (POST /events/create)
func TestCreateEvent(t *testing.T) {
	t.Log("Starting TestCreateEvent")
	testutils.InitTestDB(t)

	// Create a new event payload
	payload := map[string]string{
		"event_name":        "New Event",
		"event_description": "A new test event",
		"event_location":    "Test Location",
		"event_categories":  "Category 1",
		"event_date":        "1622541600", // Unix timestamp for testing
		"club_id":           "1",
	}

	// Marshal the payload into JSON
	body, _ := json.Marshal(payload)

	// Initialize the app
	app := setupEventsApp()

	// Create the POST request to create an event
	req := httptest.NewRequest("POST", "/events/create", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	// Execute the request
	resp, err := app.Test(req)

	// Ensure the request was successful
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}

	// Assert the status code is 201 Created
	assert.Equal(t, 201, resp.StatusCode, "Expected status 201")

	// Further assertions on the response body (optional)
	var response map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Ensure the event was created successfully
	assert.NotNil(t, response["event_id"], "Expected event_id to be returned")
}
