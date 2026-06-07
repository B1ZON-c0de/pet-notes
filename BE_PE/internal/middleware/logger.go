package middleware

import (
	"net/http"

	"github.com/B1ZON-c0de/backend/internal/logger"
)

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		rw := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		next.ServeHTTP(rw, r)

		logger.Info.Printf("%s%s%s %s %d ", logger.Bold, r.Method, logger.Reset, r.URL.Path, rw.statusCode)
	})
}
