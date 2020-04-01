'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
  Joi,
  buildErrorObject,
  csrfTokenSchema
} = require('./validator');

const schemaDefaults = {
  name: {
    minLength: 1,
    maxLength: 50
  },
  password: {
    minLength: 10,
    maxLength: 100
  },
  role: {
    values: ['admin', 'shopkeeper', 'normal'],
    defaultValue: 'normal'
  }
};

const inputSchema = {
  name: Joi.string()
    .trim()
    .normalize()
    .min(schemaDefaults.name.minLength)
    .max(schemaDefaults.name.maxLength)
    .regex(/^((?!\$).)*$/)
    .error(() => {
      return `Name is required, it must be ${schemaDefaults.name.minLength} - ${schemaDefaults.name.maxLength} chars.`;
    }),
  email: Joi.string()
    .trim()
    .normalize()
    .email()
    .error(() => {
      return 'Email is required and it must right format';
    }),
  password: Joi.string()
    .max(schemaDefaults.password.maxLength)
    .error(() => {
      return `Password must be at least ${schemaDefaults.password.minLength} chars.`;
    }),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref('password'))
    .error(() => {
      return 'Confirmation does not equal to a password';
    }),
  role: Joi.string()
    .trim()
    .lowercase()
    .valid(schemaDefaults.role.values)
    .default(schemaDefaults.role.defaultValue)
    .error(() => {
      return `Role must be one of: "${schemaDefaults.role.values.join(
        '", "'
      )}"`;
    }),
  _csrf: csrfTokenSchema
};


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: schemaDefaults.name.minLength,
    maxlength: schemaDefaults.name.maxLength
  },
  email: {
    type: String,
    required: true,
    unique: true, // NOTE: this is not a validator (see mongoose documentation)
    trim: true,
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    required: true,
    // minimum length defined just to make sure that an empty string is not allowed
    // do not save plain text passwords to database
    minlength: 1,
    set: (password) => {
      if (!password || password.length === 0) return password;
      // transparently encrypt password when setting it using:
      // user.password = plainTextPassword;
      // setter must be synchronous or errors will happen
      return bcrypt.hashSync(password, 10);
    }
  },
  role: {
    type: String,
    trim: true,
    lowercase: true,
    enum: schemaDefaults.role.values,
    default: schemaDefaults.role.defaultValue
  },
  creditcard: {
    type: Schema.Types.ObjectId,
    ref: 'CreditCard'
  }
});

userSchema.virtual('isAdmin').get(function () {
  // eslint-disable-next-line babel/no-invalid-this
  return this.role === 'admin';
});

userSchema.virtual('isShopkeeper').get(function () {
  // eslint-disable-next-line babel/no-invalid-this
  return this.role === 'admin' || this.role === 'shopkeeper';
});

userSchema.virtual('isRegistered').get(function () {
  // eslint-disable-next-line babel/no-invalid-this
  return this.role === 'admin' || this.role === 'shopkeeper' || this.role === 'normal';
});

userSchema.virtual('links').get(function () {
  return { 'self': `/api/users/${this._id}` }
});

// don't return hashed password
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
  }
})

userSchema.statics.getAvailableRoles = function () {
  // FIXME: Do not hard code! Construct this automatically
  return [{
    name: 'Normal',
    value: 'normal'
  },
  {
    name: 'Shopkeeper',
    value: 'shopkeeper'
  },
  {
    name: 'Admin',
    value: 'admin'
  }];
};

userSchema.statics.validateRole = function (data) {
  // validate user input for role
  const { _csrf, role } = inputSchema;
  const roleValidationSchema = {
    role: role.required(),
    _csrf: _csrf
  };
  const result = Joi.validate(data, roleValidationSchema);
  if (result.error) result.error = buildErrorObject(result.error.details);
  return result;
};

userSchema.statics.validateLogin = function (data) {
  // validate user input for login
  const { email, password } = inputSchema;
  const loginValidationSchema = {
    email: email.required(),
    password: password.min(1).required()
  };
  const result = Joi.validate(data, loginValidationSchema);
  if (result.error) result.error = buildErrorObject(result.error.details);
  return result;
};

userSchema.statics.validateRegistration = function (data) {
  // validate user input for registration
  // eslint-disable-next-line no-shadow
  const { name, email, password, passwordConfirmation } = inputSchema;
  const registerValidationSchema = {
    name: name.required(),
    email: email.required(),
    password: password.min(schemaDefaults.password.minLength).required(),
    passwordConfirmation: passwordConfirmation.required()
  };

  const result = Joi.validate(data, registerValidationSchema, {
    abortEarly: false
  });

  if (result.error) result.error = buildErrorObject(result.error.details);
  return result;
};

userSchema.statics.validateUpdate = function (data) {
  // validate user input for update
  // eslint-disable-next-line no-shadow
  const { _csrf, name, email, password } = inputSchema;
  const updateValidationSchema = {
    name: name.required(),
    email: email.required(),
    password: password.min(1).required(),
    _csrf: _csrf
  };
  const result = Joi.validate(data, updateValidationSchema, {
    abortEarly: false
  });

  if (result.error) result.error = buildErrorObject(result.error.details);
  return result;
};

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = new mongoose.model('User', userSchema);
module.exports = User;
