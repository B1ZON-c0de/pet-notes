package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/B1ZON-c0de/backend/internal/api"
	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/B1ZON-c0de/backend/internal/service"
)

type AuthHandler struct {
	service service.AuthService
}

func NewAuthHandler(service service.AuthService) *AuthHandler {
	return &AuthHandler{
		service: service,
	}
}

func (ah *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.UserRequestRegister

	err := json.NewDecoder(r.Body).Decode(&req)
	defer r.Body.Close()
	if err != nil {
		api.RespondWithError(w, api.CodeInternalServerError, http.StatusInternalServerError, err.Error())
		return
	}

	token, err := ah.service.Register(r.Context(), req.Name, req.Email, req.Password)
	if err != nil {
		api.RespondWithError(w, api.CodeInvalidCredentials, http.StatusBadRequest, err.Error())
		return
	}

	setTokenInCookie(w, token)

	api.RespondWithJSON(w, http.StatusCreated, nil)
}

func (ah *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.UserRequestLogin

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		api.RespondWithError(w, api.CodeInternalServerError, http.StatusInternalServerError, err.Error())
		return
	}

	token, err := ah.service.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		api.RespondWithError(w, api.CodeUnauthorized, http.StatusUnauthorized, err.Error())
		return
	}

	setTokenInCookie(w, token)

	api.RespondWithJSON(w, http.StatusOK, nil)
}

func setTokenInCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		// TODO поменять потом
		Secure: false,
		MaxAge: 60 * 60 * 24,
	})
}
