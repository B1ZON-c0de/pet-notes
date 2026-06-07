package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/B1ZON-c0de/backend/internal/db"
	"github.com/B1ZON-c0de/backend/internal/handlers"
	"github.com/B1ZON-c0de/backend/internal/logger"
	"github.com/B1ZON-c0de/backend/internal/middleware"
	"github.com/B1ZON-c0de/backend/internal/repository"
	"github.com/B1ZON-c0de/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	// Инициализцаия переменнхы окружения
	frontendPort := os.Getenv("FRONT_PORT")
	backendPort := os.Getenv("BACKEND_PORT")
	jwtSecret := os.Getenv("JWT_SECRET")
	jwtExpire, err := strconv.Atoi(os.Getenv("JWT_EXPIRE"))
	if err != nil {
		logger.Error.Fatalf("Ошибка конвертации: %v", err)
	}

	// Инициализация бд
	postgreDB, err := initDB()
	if err != nil {
		logger.Error.Fatalf("Ошибка инициализации бд: %v", err)
	}
	defer postgreDB.Close()

	// Объявление репозиториев
	userRepo := repository.NewUserRepo(postgreDB)
	noteRepo := repository.NewNoteRepo(postgreDB)

	// Объявление сервисов
	userService := service.NewUserService(userRepo)
	noteService := service.NewNoteService(noteRepo)
	authService := service.NewAuthService(userRepo, jwtSecret, time.Duration(jwtExpire)*time.Hour)

	// Объявление хэндлеров
	userHandler := handlers.NewUserHandler(userService)
	noteHandler := handlers.NewNoteHandler(noteService)
	authHandler := handlers.NewAuthHandler(authService)

	// Регистрация роутера
	r := chi.NewRouter()

	// Регистрация общих промежуточных ПО
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			fmt.Sprintf("http://localhost:%s", frontendPort),
			fmt.Sprintf("http://frontend:%s", frontendPort),
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Accept", "Authorization", "Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	//Инициализцаия роутов
	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", authHandler.Login)
			r.Post("/register", authHandler.Register)
		})

		r.Group(func(r chi.Router) {

			r.Use(middleware.Auth(authService))

			r.Post("/notes", noteHandler.Create)
			r.Get("/notes", noteHandler.GetAllByUser)
			r.Get("/notes/{id}", noteHandler.GetOneByUser)
			r.Patch("/notes/{id}", noteHandler.Update)
			r.Delete("/notes/{id}", noteHandler.Delete)

			r.Get("/user", userHandler.GetUser)
		})
	})

	// Запуск сервера
	logger.Info.Printf("Сервер запущен на http://localhost:%s", backendPort)
	if err := http.ListenAndServe(":"+backendPort, r); err != nil {
		logger.Error.Fatalf("Ошибка сервера: %v", err)
	}
}

func initDB() (*sql.DB, error) {
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbSslMode := os.Getenv("DB_SSLMODE")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	dbConfig := db.NewConfigDB(dbUser, dbPassword, dbName, dbSslMode, dbHost, dbPort)
	postgresDB, err := dbConfig.ConnectDB()
	if err != nil {
		return nil, err
	}

	if err := db.Migrate(postgresDB); err != nil {
		return nil, err
	}

	return postgresDB, nil
}
