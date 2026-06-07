package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/lib/pq"
)

var (
	ErrUserExists = errors.New("пользователь с таким email уже существует")
)

type UserRepo interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id string) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
}

type userRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) UserRepo {
	return &userRepo{db: db}
}

func (ur *userRepo) Create(ctx context.Context, user *models.User) error {
	query := "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,created_at"

	if err := ur.db.QueryRowContext(ctx, query, user.Name, user.Email, user.Password).Scan(&user.ID, &user.CreatedAt); err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return ErrUserExists
		}
		return err
	}

	return nil
}

func (ur *userRepo) GetByID(ctx context.Context, id string) (*models.User, error) {
	return nil, nil
}

func (ur *userRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	return nil, nil
}
