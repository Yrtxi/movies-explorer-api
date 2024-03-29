require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_URI = 'mongodb://localhost/bitfilmsdb' } = process.env;
const app = express();

// Обрабатываем cors
app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI);

// Подключаем логгер запросов
app.use(requestLogger);

// Подключаем роуты
app.use(routes);

// Подключаем логгер ошибок
app.use(errorLogger);

// Обработчик ошибок валидации celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

app.listen(PORT);
