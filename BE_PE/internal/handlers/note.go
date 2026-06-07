package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/B1ZON-c0de/backend/internal/api"
	"github.com/B1ZON-c0de/backend/internal/models"
	"github.com/B1ZON-c0de/backend/internal/service"
	"github.com/go-chi/chi/v5"
)

var (
	ErrIdRequired = errors.New("id записи обязательно")
	ErrNotFoundId = errors.New("id пользователя не найдено в контексте")
)

const (
	userIdKey  = "user_id"
	chiRouteId = "id"
)

type NoteHandler struct {
	service service.NoteService
}

func NewNoteHandler(service service.NoteService) *NoteHandler {
	return &NoteHandler{
		service: service,
	}
}

func (nh *NoteHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(userIdKey).(string)
	if !ok {
		api.RespondWithError(w, api.CodeUnauthorized, http.StatusUnauthorized, ErrNotFoundId.Error())
		return
	}

	note, err := nh.service.Create(r.Context(), userID)
	if err != nil {
		api.RespondWithError(w, api.CodeUserNotFound, http.StatusNotFound, err.Error())
		return
	}

	api.RespondWithJSON(w, http.StatusCreated, note)
}

func (nh *NoteHandler) GetAllByUser(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(userIdKey).(string)
	if !ok {
		api.RespondWithError(w, api.CodeUnauthorized, http.StatusUnauthorized, ErrNotFoundId.Error())
		return
	}

	notes, err := nh.service.GetNotesByUserID(r.Context(), userID)
	if err != nil {
		api.RespondWithError(w, api.CodeUserNotFound, http.StatusNotFound, err.Error())
		return
	}

	api.RespondWithJSON(w, http.StatusOK, notes)
}

func (nh *NoteHandler) GetOneByUser(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(userIdKey).(string)
	if !ok {
		api.RespondWithError(w, api.CodeUnauthorized, http.StatusUnauthorized, ErrNotFoundId.Error())
		return
	}

	noteID := chi.URLParam(r, chiRouteId)
	if noteID == "" {
		api.RespondWithError(w, api.CodeBadRequest, http.StatusBadRequest, ErrIdRequired.Error())
		return
	}

	note, err := nh.service.GetNoteByUserID(r.Context(), noteID, userID)
	if err != nil {
		api.RespondWithError(w, api.CodeNoteNotFound, http.StatusNotFound, err.Error())
		return
	}

	api.RespondWithJSON(w, http.StatusOK, note)
}

func (nh *NoteHandler) Update(w http.ResponseWriter, r *http.Request) {
	var req models.NoteUpdateRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		api.RespondWithError(w, api.CodeBadRequest, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	noteID := chi.URLParam(r, chiRouteId)
	if noteID == "" {
		api.RespondWithError(w, api.CodeBadRequest, http.StatusBadRequest, ErrIdRequired.Error())
		return
	}

	userID, ok := r.Context().Value(userIdKey).(string)
	if !ok {
		api.RespondWithError(w, api.CodeUnauthorized, http.StatusUnauthorized, ErrNotFoundId.Error())
		return
	}

	note, err := nh.service.GetNoteByUserID(r.Context(), noteID, userID)
	if err != nil {
		api.RespondWithError(w, api.CodeNoteNotFound, http.StatusNotFound, err.Error())
		return
	}

	note.Title = req.Title
	note.Text = req.Text

	if err := nh.service.Update(r.Context(), note); err != nil {
		api.RespondWithError(w, api.CodeNoteNotFound, http.StatusBadRequest, err.Error())
		return
	}

	api.RespondWithJSON(w, http.StatusOK, note)
}

func (nh *NoteHandler) Delete(w http.ResponseWriter, r *http.Request) {
	noteID := chi.URLParam(r, chiRouteId)
	if noteID == "" {
		api.RespondWithError(w, api.CodeBadRequest, http.StatusBadRequest, ErrIdRequired.Error())
		return
	}

	if err := nh.service.Delete(r.Context(), noteID); err != nil {
		api.RespondWithError(w, api.CodeNoteNotFound, http.StatusBadRequest, err.Error())
		return
	}

	api.RespondWithJSON(w, http.StatusOK, nil)
}
