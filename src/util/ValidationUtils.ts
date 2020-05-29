type ValidationConstraint = () => string | undefined;

const validate = (
  ...constraints: ValidationConstraint[]
): string | undefined => {
  for (const constraint of constraints) {
    const result = constraint();
    if (result) {
      return result;
    }
  }
};

const stringLength = (
  value: string,
  variableName: string,
  minLength?: number,
  maxLength?: number
): ValidationConstraint => {
  return () => {
    if (minLength && minLength > value.length) {
      return variableName + " ist zu kurz!";
    }

    if (maxLength && maxLength < value.length) {
      return variableName + " ist zu lang!";
    }
  };
};

const defined = (
  value: any | undefined,
  message: string
): ValidationConstraint => {
  return () => (value === undefined ? message : undefined);
};

const matches = (
  value1: any,
  value2: any,
  message: string
): ValidationConstraint => {
  return () => (value1 === value2 ? undefined : message);
};

const pattern = (value: string, message: string, pattern: RegExp) => {
  return () => (pattern.test(value) ? undefined : message);
};

const numberSize = (
  value: number,
  variableName: string,
  min?: number,
  max?: number
): ValidationConstraint => {
  return () => {
    if (min && min > value) {
      return variableName + " ist zu klein!";
    }

    if (max && max < value) {
      return variableName + " ist zu groß!";
    }
  };
};

export { validate, defined, matches, pattern, stringLength, numberSize };
