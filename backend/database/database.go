package database

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	UserID        uint   `gorm:"column:user_id;primaryKey;autoIncrement" json:"user_id"`
	UserName      string `gorm:"column:user_name;not null" json:"user_name"`
	UserEmail     string `gorm:"column:user_email;unique;not null" json:"user_email"`
	UserRole      string `gorm:"column:user_role;not null;check:(user_role IN ('admin', 'member', 'organizer'))" json:"user_role"`
	UserCreatedAt int64  `gorm:"column:user_created_at;default:(strftime('%s', 'now'))" json:"user_created_at"`
}

type Club struct {
	ClubID          uint   `gorm:"column:club_id;primaryKey;autoIncrement" json:"club_id"`
	ClubName        string `gorm:"column:club_name;not null" json:"club_name"`
	ClubDescription string `gorm:"column:club_description;not null" json:"club_description"`
	ClubCreatedBy   *uint  `gorm:"column:club_created_by" json:"club_created_by"`
	ClubCreatedAt   int64  `gorm:"column:club_created_at;default:(strftime('%s', 'now'))" json:"club_created_at"`
}

type Event struct {
	EventID          uint   `gorm:"column:event_id;primaryKey;autoIncrement" json:"event_id"`
	EventName        string `gorm:"column:event_name;not null" json:"event_name"`
	EventDescription string `gorm:"column:event_description;not null" json:"event_description"`
	EventDate        int64  `gorm:"column:event_date;not null" json:"event_date"` // Stored as UNIX timestamp
	EventLocation    string `gorm:"column:event_location;not null" json:"event_location"`
	OrganizedBy      *uint  `gorm:"column:organized_by" json:"organized_by"`
	ClubID           *uint  `gorm:"column:club_id" json:"club_id"`
	CreatedAt        int64  `gorm:"column:created_at;default:(strftime('%s', 'now'))" json:"created_at"`
}

type Booking struct {
	BookingID uint   `gorm:"column:booking_id;primaryKey;autoIncrement" json:"booking_id"`
	UserID    uint   `gorm:"column:user_id" json:"user_id"`
	EventID   uint   `gorm:"column:event_id" json:"event_id"`
	Status    string `gorm:"column:booking_status;not null;check:(booking_status IN ('confirmed', 'pending', 'cancelled'))" json:"booking_status"`
	BookedAt  int64  `gorm:"column:booked_at;default:(strftime('%s', 'now'))" json:"booked_at"`
}

func (User) TableName() string {
	return "users"
}
func (Club) TableName() string {
	return "clubs"
}
func (Event) TableName() string {
	return "events"
}
func (Booking) TableName() string {
	return "bookings"
}

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("../gator_club_life.db"), &gorm.Config{})
	if err != nil {
		fmt.Println("error while connecting to the database:", err)
		return
	}
	fmt.Println("connected successfully")

}
