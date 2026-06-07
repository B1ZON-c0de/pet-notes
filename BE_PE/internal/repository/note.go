package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/B1ZON-c0de/backend/internal/models"
)

var (
	ErrNoteNotFound = errors.New("такой записи не существует")
)

type NoteRepo interface {
	Create(ctx context.Context, note *models.Note) error
	GetAllByUserID(ctx context.Context, userId string) ([]models.Note, error)
	GetOneByUserID(ctx context.Context, userId, noteId string) (*models.Note, error)
	Update(ctx context.Context, note *models.Note) error
	Delete(ctx context.Context, userId, noteId string) error
	SearchByUserID(ctx context.Context, userID, search string) ([]models.Note, error)
}

type noteRepo struct {
	db *sql.DB
}

func NewNoteRepo(db *sql.DB) NoteRepo {
	return &noteRepo{db: db}
}

func (nr *noteRepo) Create(ctx context.Context, note *models.Note) error {
	query := "INSERT INTO notes ( text, user_id) VALUES ($1,$2) RETURNING id,title, created_at, updated_at"

	if err := nr.db.QueryRowContext(ctx, query, note.Text, note.UserID).Scan(&note.ID, &note.Title, &note.CreatedAt, &note.UpdatedAt); err != nil {
		return err
	}

	return nil
}

func (nr *noteRepo) GetAllByUserID(ctx context.Context, userId string) ([]models.Note, error) {
	query := "SELECT id, title, text, user_id, created_at, updated_at FROM notes WHERE user_id=$1"

	rows, err := nr.db.QueryContext(ctx, query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []models.Note

	for rows.Next() {
		var note models.Note

		if err := rows.Scan(&note.ID, &note.Title, &note.Text, &note.UserID, &note.CreatedAt, &note.UpdatedAt); err != nil {
			return nil, err
		}

		notes = append(notes, note)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return notes, nil
}

func (nr *noteRepo) GetOneByUserID(ctx context.Context, userId, noteId string) (*models.Note, error) {
	query := "SELECT id,title, text, user_id, created_at, updated_at FROM notes WHERE user_id=$1 AND id=$2"

	var note models.Note

	if err := nr.db.QueryRowContext(ctx, query, userId, noteId).Scan(&note.ID, &note.Title, &note.Text, &note.UserID, &note.CreatedAt, &note.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoteNotFound
		}
		return nil, err
	}

	return &note, nil
}

func (nr *noteRepo) Update(ctx context.Context, note *models.Note) error {
	query := "UPDATE notes SET title=$1, text=$2 WHERE id=$3 AND user_id=$4 RETURNING updated_at"

	if err := nr.db.QueryRowContext(ctx, query, note.Title, note.Text, note.ID, note.UserID).Scan(&note.UpdatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrNoteNotFound
		}
		return err
	}

	return nil
}

func (nr *noteRepo) Delete(ctx context.Context, userId, noteId string) error {
	query := "DELETE FROM notes WHERE id=$1 AND user_id=$2"

	res, err := nr.db.ExecContext(ctx, query, noteId, userId)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrNoteNotFound
	}

	return nil
}

func (nr *noteRepo) SearchByUserID(ctx context.Context, userID, search string) ([]models.Note, error) {
	query := `SELECT id, title, text, user_id, created_at,updated_at FROM notes WHERE user_id=$1 AND ( title ILIKE '%' || $2 || '%' OR text ILIKE '%' || $2 || '%') ORDER BY updated_at DESC`

	rows, err := nr.db.QueryContext(ctx, query, userID, search)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []models.Note

	for rows.Next() {
		var note models.Note

		if err := rows.Scan(&note.ID, &note.Title, &note.Text, &note.UserID, &note.CreatedAt, &note.UpdatedAt); err != nil {
			return nil, err
		}

		notes = append(notes, note)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return notes, nil
}
