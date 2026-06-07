package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/B1ZON-c0de/backend/internal/db"
	"github.com/B1ZON-c0de/backend/internal/logger"
)

func main() {
	db, err := initDB()
	if err != nil {
		logger.Error.Fatalf("Ошибка инициализации бд: %v", err)
	}
	defer db.Close()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello World")
	})

	logger.Info.Println("Сервер запущен на http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
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
