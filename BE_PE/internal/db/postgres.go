package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type configDB struct {
	username string
	password string
	dbName   string
	sslMode  string
}

func NewConfigDB(username, pasword, dbName, sslMode string) *configDB {
	return &configDB{
		username: username,
		password: pasword,
		dbName:   dbName,
		sslMode:  sslMode,
	}
}

func (c *configDB) ConnectDB() (*sql.DB, error) {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s", c.username, c.password, c.dbName, c.sslMode)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *sql.DB) error {
	queries := []string{
		`
		`,
		`CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE OR REPLACE FUNCTION update_updated_at_column()
		RETURNS TRIGGER AS $$
		BEGIN
			NEW.updated_at = CURRENT_TIMESTAMP;
			RETURN NEW;
		END;
		$$ LANGUAGE plpgsql;
		`,
		`CREATE TABLE IF NOT EXISTS notes (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			title VARCHAR(255) NOT NULL DEFAULT 'Новая заметка',
			text TEXT,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
			user_id UUID NOT NULL,

		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		)`,
		`
		DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
		`,
		`
		CREATE TRIGGER update_notes_updated_at
			BEFORE UPDATE ON notes
			FOR EACH ROW
			EXECUTE FUNCTION update_updated_at_column();
		`,
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	if _, err = db.Exec(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`); err != nil {
		return err
	}

	for _, query := range queries {
		_, err := tx.Exec(query)
		if err != nil {
			return err
		}
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	fmt.Println("Миграция прошлоа успеншно")

	return nil
}
