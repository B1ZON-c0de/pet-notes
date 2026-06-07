package models

import "time"

type Note struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Text      string    `json:"text"`
	UserID    string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type NoteUpdateRequest struct {
	Title *string `json:"title,omitempty"`
	Text  *string `json:"text,omitempty"`
}
