import validator from "validator";

class EmailAddress {
  constructor(email) {
    this.email = email
  }

  get isValid() {
    return !!this.email && validator.isEmail(this.email);
  }
}

export default EmailAddress;