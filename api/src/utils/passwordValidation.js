export const PASSWORD_REQUIREMENTS_HINT =
  'Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character.';

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
