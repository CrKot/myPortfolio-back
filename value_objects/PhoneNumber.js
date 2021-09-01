class PhoneNumber {
  constructor(phoneNumber) {
    this.phoneNumber = phoneNumber
  }

  get isValid() {
    return !!this.phoneNumber && /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/.test(this.phoneNumber);
  }
}
  
 export default PhoneNumber;