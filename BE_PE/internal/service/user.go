package service

import (
	"context"

	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/B1ZON-c0de/backend/internal/repository"
)

type UserService interface {
	GetUser(ctx context.Context, id string) (*models.User, error)
}

type userService struct {
	userRepo repository.UserRepo
}

func NewUserService(repo repository.UserRepo) UserService {
	return &userService{
		userRepo: repo,
	}
}

func (us *userService) GetUser(ctx context.Context, id string) (*models.User, error) {
	return us.userRepo.GetByID(ctx, id)
}
