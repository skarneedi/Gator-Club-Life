# Sprint 3 Report

**Project:** Gator-Club-Life 

**Frontend Team:** Abhigna Nimmagadda, Deekshita Kommi

**Backend Team:** Sri Ashritha Appalchity, Sonali Karneedi

### Videos
[Frontend and Backend](https://drive.google.com/drive/folders/1e_sp0JCpbC-Cb4-Nle8uBoK-_TgdPbhU?usp=sharing)

# Backend Documentation for Sprint 3

## Authentication & Sessions
- Implemented login using bcrypt for password verification.
- Created a session system using `fiber/session`.
- Added logout functionality to destroy sessions securely.
- Fully tested login and logout APIs with valid and invalid input.

## Clubs API

- Built the `/clubs` endpoint to fetch all club data.
- Added filtering by category (e.g., Academic, Health & Wellness).
- Updated the database schema with strict category validation.
- Connected frontend to dynamically retrieve club data.
- Unit tested all retrieval and filtering logic.

## Announcements System

- Created a new database table for announcements.
- Built `GET` and `POST` endpoints for announcements.
- Restricted `POST` to admin users only.
- Integrated frontend with backend for dynamic display.
- Tested successful creation, missing fields, and unauthorized access.

## API Documentation

- Integrated Swagger using Swaggo.
- Generated live API docs for login, logout, announcements, and clubs.
- Documentation accessible at `/swagger/*`.
![Swagger Documentation](ResultScreenshots/SwaggerDocumentation.png)


## Testing
We wrote and executed unit tests for all major backend features.

### Announcements API
- `TestGetAnnouncements` — fetches all announcements.
- `TestCreateAnnouncementSuccess` — validates successful admin posting.
- `TestCreateAnnouncementMissingFields` — checks missing field handling.
- `TestCreateAnnouncementNonAdmin` — confirms role-based restriction.
![Unit Tests for Announcements API](ResultScreenshots/AnnouncementsAPI_UnitTestResults.png)


### Clubs API
- `TestGetClubsNoCategory` — fetches all clubs.
- `TestGetClubsWithCategory` — validates category filter logic.
![Unit Tests for Clubs API](ResultScreenshots/ClubsAPI_UnitTestResults.png)

### Logout API
- `TestLogoutSuccess` — tests session termination on logout.
![Unit Tests for Logout API](ResultScreenshots/LogoutAPI_UnitTestResults.png)

### Login API
- `TestLoginSuccess` — successful login with correct credentials.
- `TestLoginMissingFields` — login with missing fields returns error.
- `TestLoginNonExistingUser` — blocks login for nonexistent users.
- `TestLoginInvalidPassword` — invalid password is rejected.
![Unit Tests for Login API](ResultScreenshots/LoginAPI_UnitTestResults.png)

### Users API
- `TestGetUsers` — fetches all users and checks for expected records.
- `TestCreateUser` — registers a new user and confirms the response omits the password field.
- `TestCreateUserInvalidJSON` — ensures malformed JSON is caught and returns a 400 error.
- `TestCreateUserMissingFields` — checks for proper error handling when required fields are missing.
- `TestDuplicateUserRegistration` — verifies that registering with an existing email is blocked.
![Unit Tests for Users API](ResultScreenshots/UsersAPI_UnitTestResults.png)


