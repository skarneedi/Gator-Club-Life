package routes_test

import (
	"backend/database"
	"backend/routes"
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

// Initialize the test database
func initTestDB(t *testing.T) {
	database.InitTestDB()

	// Migrate the necessary models for the test
	err := database.DB.AutoMigrate(&database.Event{}, &database.User{})
	if err != nil {
		t.Fatalf("Failed to migrate models: %v", err)
	}
}

// Test the GetEvents endpoint
func TestGetEvents(t *testing.T) {
	// Initialize the test database
	initTestDB(t)

	// Create some test events and users
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
	app := fiber.New()

	// Set up the routes
	app.Get("/events", routes.GetEvents)

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
	// Initialize the test database
	initTestDB(t)

	// Create a mock controller
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	// Create the mock email service
	mockEmailService := NewMockEmailService(ctrl)
	mockEmailService.EXPECT().SendEmail(gomock.Any(), gomock.Any(), gomock.Any()).Return(nil).Times(1)

	// Set the mock email service in the routes package
	routes.EmailService = mockEmailService

	// Initialize the app
	app := fiber.New()

	// Set up the routes
	app.Post("/events/send-confirmation", routes.SendRSVPConfirmation)

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

// Test the SendRSVPConfirmation with missing fields
func TestSendRSVPConfirmationMissingFields(t *testing.T) {
	// Initialize the test database
	initTestDB(t)

	// Initialize the app
	app := fiber.New()

	// Set up the routes
	app.Post("/events/send-confirmation", routes.SendRSVPConfirmation)

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

// Test the SendRSVPConfirmation with an invalid email
func TestSendRSVPConfirmationInvalidEmail(t *testing.T) {
	// Initialize the test database
	initTestDB(t)

	// Initialize the app
	app := fiber.New()

	// Set up the routes
	app.Post("/events/send-confirmation", routes.SendRSVPConfirmation)

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
