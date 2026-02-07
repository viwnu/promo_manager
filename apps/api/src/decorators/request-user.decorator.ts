import { RequestProp } from 'libs/shared/decorators/param';
import { REQUEST_PROP_NAMES } from '../const';
import { UserSelfView } from '../features/users/dto/view';

export function RequestUser() {
  return RequestProp<{ [REQUEST_PROP_NAMES.USER]: UserSelfView }>(REQUEST_PROP_NAMES.USER);
}
