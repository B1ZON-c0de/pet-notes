FROM golang:1.26-alpine AS builder

WORKDIR /app

# COPY go.mod go.sum ./
COPY go.mod ./
# RUN go mod download

COPY . .

RUN go build -o backend ./cmd/main.go

FROM alpine:latest

COPY --from=builder /app/backend .

EXPOSE 8080

CMD ["./backend"]
