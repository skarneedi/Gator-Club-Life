package routes_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/database"
	"backend/routes"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// setupLoginApp initializes a new Fiber app with the login endpoint.
func setupLoginApp() *fiber.App {
	app := fiber.New()
	app.Post("/login", routes.Login)
	return app
}

// initTestDBForLogin initializes the database for login testing.
func initTestDBForLogin() {
	database.InitDB()
	err := database.DB.AutoMigrate(&database.User{})
	if err != nil {
		panic(fmt.Sprintf("Failed to migrate User table: %v", err))
	}
	database.DB.Exec("DELETE FROM users")
	fmt.Println("Test DB initialized and users table cleared.")
}

func TestLoginSuccess(t *testing.T) {
	t.Log("Starting TestLoginSuccess")
	initTestDBForLogin()
	app := setupLoginApp()

	// Create a test user with a known password.
	password := "password123"
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("Error hashing password: %v", err)
	}
	testUser := database.User{
		UserName:     "loginuser",
		UserEmail:    "loginuser@example.com",
		UserRole:     "member",
		UserPassword: string(hashed),
	}
	if err := database.DB.Create(&testUser).Error; err != nil {
		t.Fatalf("Error creating test user: %v", err)
	}
	t.Log("Test user for login created successfully.")

	loginPayload := map[string]string{
		"email":    "loginuser@example.com",
		"password": password,
	}
	body, _ := json.Marshal(loginPayload)
	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /login request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200 for login success, got %v", resp.StatusCode)
	}

	var loginResp map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&loginResp); err != nil {
		t.Fatalf("Error decoding login response: %v", err)
	}
	t.Logf("Login response: %+v", loginResp)
	if loginResp["message"] != "Login successful" {
		t.Errorf("Expected message 'Login successful', got '%s'", loginResp["message"])
	} else {
		t.Log("TestLoginSuccess passed.\n")
	}
}

func TestLoginFailure(t *testing.T) {
	t.Log("Starting TestLoginFailure")
	initTestDBForLogin()
	app := setupLoginApp()

	// Create a test user.
	password := "password123"
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("Error hashing password: %v", err)
	}
	testUser := database.User{
		UserName:     "failuser",
		UserEmail:    "failuser@example.com",
		UserRole:     "member",
		UserPassword: string(hashed),
	}
	if err := database.DB.Create(&testUser).Error; err != nil {
		t.Fatalf("Error creating test user: %v", err)
	}
	t.Log("Test user for login failure created successfully.")

	// Attempt login with an incorrect password.
	loginPayload := map[string]string{
		"email":    "failuser@example.com",
		"password": "wrongpassword",
	}
	body, _ := json.Marshal(loginPayload)
	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /login request: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("Expected status 401 for invalid login, got %v", resp.StatusCode)
	}

	var errorResp map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
		t.Fatalf("Error decoding error response: %v", err)
	}
	t.Logf("Login failure response: %+v", errorResp)
	if errorResp["error"] == "" {
		t.Error("Expected an error message in login failure response, but got an empty string")
	} else {
		t.Log("TestLoginFailure passed.\n")
	}
}

func TestLoginMissingFields(t *testing.T) {
	t.Log("Starting TestLoginMissingFields")
	initTestDBForLogin()
	app := setupLoginApp()

	// Provide a payload with missing password.
	loginPayload := map[string]string{
		"email": "test@example.com",
	}
	body, _ := json.Marshal(loginPayload)
	req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /login request: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("Expected status 400 for missing fields, got %v", resp.StatusCode)
	}

	var errorResp map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
		t.Fatalf("Error decoding error response: %v", err)
	}
	if errorMsg, ok := errorResp["error"]; !ok || errorMsg == "" {
		t.Error("Expected an error message for missing fields in login")
	} else {
		t.Logf("Received error message for missing fields: %s", errorMsg)
	}
	t.Log("TestLoginMissingFields passed.\n")
}
