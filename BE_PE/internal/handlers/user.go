package handlers

import (
	"net/http"

	"github.com/B1ZON-c0de/backend/internal/api"
	"github.com/B1ZON-c0de/backend/internal/service"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(service service.UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
}

func (uh *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		api.RespondWithError(w, api.CodeUnauthorized, http.StatusUnauthorized, "id пользователя не найдено в контексте")
	}

	user, err := uh.service.GetUser(r.Context(), userID)
	if err != nil {
		api.RespondWithError(w, api.CodeUserNotFound, http.StatusNotFound, err.Error())
		return
	}

	api.RespondWithJSON(w, http.StatusOK, user)
}
