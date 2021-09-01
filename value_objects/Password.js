import validator from "validator";

class Password {
  constructor(password) {
    this.password = password
  }

  get isValid() {
    return !!this.password && validator.isLength(this.password, { min: 5, max: 16 })
  }
}

export default Password;
