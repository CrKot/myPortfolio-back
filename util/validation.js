import errorMap from './errorMap.js';

const validateFields = (fields) => {
  const errors = fields.reduce((errors, field) => {
    if (!new field.valueObject(field.value).isValid) {
      errors.push({ message: errorMap.getValidationErrorMessage(field.name) });
    }
    return errors;
  }, [])

  return errors;
}

export default validateFields;