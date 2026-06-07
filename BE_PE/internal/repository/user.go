package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/lib/pq"
)

var (
	ErrUserExists   = errors.New("пользователь с таким email уже существует")
	ErrUserNotFound = errors.New("такого пользователя не существует")
)

const (
	UniqueViolationErr = "23505"
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
		// 23505 код ошибки postgres если уникальное знчение уже существует
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == UniqueViolationErr {
			return ErrUserExists
		}
		return err
	}

	return nil
}

func (ur *userRepo) GetByID(ctx context.Context, id string) (*models.User, error) {
	query := "SELECT id, name, email, created_at FROM users WHERE id=$1"
	var user models.User

	err := ur.db.QueryRowContext(ctx, query, id).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return &user, nil
}

func (ur *userRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	query := "SELECT id, name, email, password, created_at FROM users WHERE email=$1"
	var user models.User

	err := ur.db.QueryRowContext(ctx, query, email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.CreatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return &user, nil
}
