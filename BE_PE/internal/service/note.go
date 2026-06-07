package service

import (
	"context"
	"errors"

	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/B1ZON-c0de/backend/internal/repository"
)

var (
	ErrNotFindUserID = errors.New("не удалось найти пользователя с таким id чтобы добавить запись")
	ErrNotFindNoteID = errors.New("не удалось найти запись с таким id")
)

type NoteService interface {
	Create(ctx context.Context, userID string) (*models.Note, error)
	GetNotesByUserID(ctx context.Context, userID string) ([]models.Note, error)
	GetNoteByUserID(ctx context.Context, noteID, userID string) (*models.Note, error)
	Update(ctx context.Context, note *models.Note) error
	Delete(ctx context.Context, userID, noteID string) error
	Search(ctx context.Context, userID, search string) ([]models.Note, error)
}

type noteService struct {
	repo repository.NoteRepo
}

func NewNoteService(repo repository.NoteRepo) NoteService {
	return &noteService{repo: repo}
}

func (ns *noteService) Create(ctx context.Context, userID string) (*models.Note, error) {
	if userID == "" {
		return nil, ErrNotFindUserID
	}
	note := models.Note{
		UserID: userID,
	}

	if err := ns.repo.Create(ctx, &note); err != nil {
		return nil, err
	}

	return &note, nil
}

func (ns *noteService) GetNotesByUserID(ctx context.Context, userID string) ([]models.Note, error) {
	if userID == "" {
		return nil, ErrNotFindUserID
	}

	notes, err := ns.repo.GetAllByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return notes, nil
}

func (ns *noteService) GetNoteByUserID(ctx context.Context, noteID, userID string) (*models.Note, error) {
	if userID == "" {
		return nil, ErrNotFindUserID
	}
	if noteID == "" {
		return nil, ErrNotFindNoteID
	}

	note, err := ns.repo.GetOneByUserID(ctx, userID, noteID)
	if err != nil {
		if errors.Is(err, repository.ErrNoteNotFound) {
			return nil, ErrNotFindNoteID
		}

		return nil, err
	}

	return note, nil
}

func (ns *noteService) Update(ctx context.Context, note *models.Note) error {
	if note.UserID == "" {
		return ErrNotFindUserID
	}

	if err := ns.repo.Update(ctx, note); err != nil {
		if errors.Is(err, repository.ErrNoteNotFound) {
			return ErrNotFindNoteID
		}
		return err
	}

	return nil
}

func (ns *noteService) Delete(ctx context.Context, userID, noteID string) error {
	if noteID == "" {
		return ErrNotFindNoteID
	}

	if err := ns.repo.Delete(ctx, userID, noteID); err != nil {
		if errors.Is(err, repository.ErrNoteNotFound) {
			return ErrNotFindNoteID
		}
		return err
	}

	return nil
}

func (ns *noteService) Search(ctx context.Context, userID, search string) ([]models.Note, error) {
	if userID == "" {
		return nil, ErrNotFindUserID
	}

	notes, err := ns.repo.SearchByUserID(ctx, userID, search)
	if err != nil {
		return nil, err
	}

	return notes, nil

}
