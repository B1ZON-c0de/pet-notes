package middleware

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/B1ZON-c0de/backend/internal/api"
	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/B1ZON-c0de/backend/internal/service"
)

var (
	ErrMissingHeaderAuth = errors.New("отсутсвует заголвок авторизации")
	ErrInvalidAuthFormat = errors.New("невереный форрмат авторизации")
)

func Auth(service service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				api.RespondWithError(w, api.CodeUnauthorized, http.StatusUnauthorized, ErrMissingHeaderAuth.Error())
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				api.RespondWithError(w, api.CodeInvalidToken, http.StatusUnauthorized, ErrInvalidAuthFormat.Error())
				return
			}

			userID, err := service.ValidateToken(r.Context(), parts[1])
			if err != nil {
				api.RespondWithError(w, api.CodeInvalidToken, http.StatusUnauthorized, err.Error())
				return
			}

			ctx := context.WithValue(r.Context(), models.UserIdKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))

		})
	}
}
