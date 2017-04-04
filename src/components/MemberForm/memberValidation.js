import { createValidator, required, email, oneOf } from 'utils/validation';
import { roles } from '../../../constants';

export const userRoles = [...roles];

const memberValidation = createValidator({
  email: [required, email],
  role: [required, oneOf(roles)],
});

export default memberValidation;
