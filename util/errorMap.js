export default {
  user: {
    emailIsTaken: 'Электронный адрес зарегистрирован.',
    authorizationFailed: 'Неверный логин или пароль.',
    userNotFound: 'Пользователь не найден.',
    updateFailed: {
      userData: 'Не удалось обновить данные.',
      phone: 'Не удалось обновить номер телефона.',
      password: 'Не удалось обновить пароль.',
      email: 'Не удалось обновить электронный адрес.'
    },
  },
  userNotDeleted: 'Пользователь не удален.',
  getValidationErrorMessage(fieldName) {
    return `Поле "${fieldName}" не указано или имеет не верный формат.`
  }
}