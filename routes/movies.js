const router = require('express').Router();
const { createMovieValidator, movieIdValidator } = require('../validators/movies');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', createMovieValidator, createMovie);

router.delete('/:movieId', movieIdValidator, deleteMovieById);

module.exports = router;
