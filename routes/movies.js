const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  doesMovieExist, createMovie, getAllMovies, saveMovie, removeFromSavedMovies, deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().integer().min(1895).max(2021),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    trailer: Joi.string().uri().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().uri().required(),
  }),
}),
createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number(),
  }),
}),
doesMovieExist, deleteMovie);

router.put('/:movieId/saved', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number(),
  }),
}),
doesMovieExist, saveMovie);

router.delete('/:movieId/saved', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number(),
  }),
}),
doesMovieExist, removeFromSavedMovies);

module.exports = router;
