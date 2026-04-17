export const PASSWORD_REQUIREMENTS_HINT =
  'At least 6 characters, including 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character.';

export const getPasswordValidationError = (password = '') => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter.';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.';
  }

  if (!/\d/.test(password)) {
    return 'Password must include at least one digit.';
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character.';
  }

  return null;
};
