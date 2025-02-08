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
	UserPassword  string `gorm:"column:user_password;not null" json:"user_password"`
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

func (User) TableName() string {
	return "users"
}
func (Club) TableName() string {
	return "clubs"
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
