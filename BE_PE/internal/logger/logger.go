package logger

import (
	"log"
	"os"
)

const (
	Reset = "\033[0m"
	Red   = "\033[31m"
	Blue  = "\033[34m"
)

var (
	Info  = log.New(os.Stdout, Blue+"[INFO] "+Reset, log.LstdFlags)
	Error = log.New(os.Stdout, Red+"[ERROR] "+Reset, log.LstdFlags|log.Lshortfile)
	Debug = log.New(os.Stdout, "[DEBUG] ", 0)
)
