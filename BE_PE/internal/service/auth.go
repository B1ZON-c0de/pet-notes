package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/B1ZON-c0de/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const (
	lenPassword = 6
)

var (
	ErrEmailExists   = errors.New("пользователь с такми email уже существует")
	ErrEmailNotFound = errors.New("пользователя с таким email не существует")
	ErrPassword      = errors.New("неверный пароль")
	ErrInvalidToken  = errors.New("неверный токен")
	ErrEmailEmpty    = errors.New("поле email не может быть пустое")
	ErrNameEmpty     = errors.New("поле name не может быть пустое")
	ErrPassEmpty     = errors.New("поле password не может быть пустое")
	ErrLenPassword   = errors.New("поле password  должно содеожать более 6 символов")
)

type AuthService interface {
	Register(ctx context.Context, name, email, password string) (string, error)
	Login(ctx context.Context, email, password string) (string, error)
	ValidateToken(ctx context.Context, tokenString string) (string, error)
}

type authService struct {
	repo      repository.UserRepo
	jwtSecret string
	jwtExpire time.Duration
}

func NewAuthService(repo repository.UserRepo, jwtSecret string, jwtExpire time.Duration) AuthService {
	return &authService{
		repo:      repo,
		jwtSecret: jwtSecret,
		jwtExpire: jwtExpire,
	}
}

func (as *authService) Register(ctx context.Context, name, email, password string) (string, error) {
	// Валидация кредов
	if err := as.validateCred(&name, email, password); err != nil {
		return "", err
	}

	// Хэширование пароля
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	user := models.User{
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
	}

	//Создаем пользователя
	if err := as.repo.Create(ctx, &user); err != nil {
		if errors.Is(err, repository.ErrUserExists) {
			return "", ErrEmailExists
		}
		return "", err
	}

	token, err := as.generateToken(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (as *authService) Login(ctx context.Context, email, password string) (string, error) {
	//Валидация кредов
	if err := as.validateCred(nil, email, password); err != nil {
		return "", err
	}

	user, err := as.repo.GetByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return "", ErrEmailNotFound
		}
		return "", err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", ErrPassword
	}
	token, err := as.generateToken(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (as *authService) ValidateToken(ctx context.Context, tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("неизвестный метод подписи: %v", token.Header["alg"])
		}
		return []byte(as.jwtSecret), nil
	})

	if err != nil {
		return "", ErrInvalidToken
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["user_id"].(string)
		if !ok {
			return "", ErrInvalidToken
		}
		return userID, nil
	}

	return "", ErrInvalidToken
}

func (as *authService) validateCred(name *string, email, password string) error {
	if email == "" {
		return ErrEmailEmpty
	}
	if name != nil && *name == "" {
		return ErrNameEmpty
	}
	if password == "" {
		return ErrPassEmpty
	}
	if len(password) < lenPassword {
		return ErrLenPassword
	}

	return nil
}

func (as *authService) generateToken(userId string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userId,
		"exp":     time.Now().Add(as.jwtExpire).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(as.jwtSecret))
}
