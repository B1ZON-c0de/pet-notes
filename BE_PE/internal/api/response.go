package api

import (
	"encoding/json"
	"net/http"
)

const (
	CodeUserNotFound        = "USER_NOT_FOUND"
	CodeNoteNotFound        = "NOTE_NOT_FOUND"
	CodeUserExists          = "USER_ALREADY_EXISTS"
	CodeInvalidCredentials  = "INVALID_CREDENTIALS"
	CodeInvalidToken        = "INVALID_TOKEN"
	CodeBadRequest          = "BAD_REQUEST"
	CodeInternalServerError = "INTERNAL_SERVER_ERROR"
	CodeUnauthorized        = "UNAUTHORIZED"
)

type Response struct {
	Success bool      `json:"success"`
	Data    any       `json:"data,omitempty"`
	Error   *APIError `json:"error,omitempty"`
}

type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func RespondWithJSON(w http.ResponseWriter, code int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(Response{Success: true, Data: data})
}

func RespondWithError(w http.ResponseWriter, status string, code int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(Response{Success: false, Error: &APIError{Code: status, Message: message}})
}
