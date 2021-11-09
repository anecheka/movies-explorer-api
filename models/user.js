const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user, next) => {
      if (!user) {
        next(new UnauthorizedError('Не получилось залогиниться. Попробуйте снова.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Не получилось залогиниться. Попробуйте снова.'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
