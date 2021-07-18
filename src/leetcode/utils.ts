import axios from 'axios';

import constants from '../utils/constants';
import dictionary from '../utils/dictionary';
import { error } from '../utils/helper';

export function getLeetcodeUsernameLink(username: string): string {
  return `${constants.LEETCODE_URL}/${username}`;
}

export function getLeetcodeProblemLink(title: string): string {
  return `${constants.LEETCODE_URL}/problems/${title}`;
}
