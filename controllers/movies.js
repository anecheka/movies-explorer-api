const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const InternalServerError = require('../errors/internal-server-err');

module.exports.doesMovieExist = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с таким ID не существует');
      }
      next();
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  Movie.create({
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: ownerId,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные неполные или заполнены некорректно'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;

  Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (movie.owner.equals(ownerId)) {
        movie.deleteOne({ movieId: movie.movieId }, (err) => {
          if (err) {
            next(new InternalServerError('Проблема с удалением карточки фильма'));
          }
          res.send({ movie });
        });
      } else {
        next(new ForbiddenError('Недостаточно прав для удаления данной карточки фильма'));
      }
    })
    .catch(next);
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send({ movie });
    })
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $addToSet: { saved: req.user._id } },
    { new: true },
  )
    .then((movie) => res.send({ movie }))
    .catch(next);
};

module.exports.removeFromSavedMovies = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $pull: { saved: req.user._id } },
    { new: true },
  )
    .then((movie) => res.send({ movie }))
    .catch(next);
};
