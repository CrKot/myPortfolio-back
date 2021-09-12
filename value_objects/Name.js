import validator from "validator";

class Name {
	constructor(name) {
		this.name = name
	}

	get isValid() {
		return !!this.name && validator.isLength(this.name, { min: 3, max: 10 });
	}
}

export default Name;