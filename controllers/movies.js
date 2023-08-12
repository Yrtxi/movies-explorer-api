const { constants } = require('http2');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  // Находим все фильмы пользователя
  Movie.find({ owner })
    // Вернем записанные в базу данные
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие фильмы');
      } else {
        return movie.deleteOne();
      }
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные для фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  // Создаем документ на основе пришедших данных
  Movie.create({
    ...req.body,
    owner,
  })
    // Вернем записанные в базу данные
    .then((movie) => {
      res.status(constants.HTTP_STATUS_CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные для фильма'));
      } else {
        next(err);
      }
    });
};
