export DB_HOST=localhost
export DATABASE_URL=postgres://oraculo:oraculo123@localhost:5432/oraculo
npx sequelize-cli db:migrate --config src/Database/config/config.json
