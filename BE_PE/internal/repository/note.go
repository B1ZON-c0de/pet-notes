package repository

import (
	"context"

	"github.com/B1ZON-c0de/backend/internal/models"
)

type NoteRepo interface {
	Create(ctx context.Context, note *models.Note) error
	GetAllByUserID(ctx context.Context, userId string) ([]models.Note, error)
	GetOneByUserID(ctx context.Context, userId, noteId string) (*models.Note, error)
	Update(ctx context.Context, note *models.Note) error
	Delete(ctx context.Context, noteId string) error
}
