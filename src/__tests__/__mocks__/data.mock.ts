import {
  getLeetcodeProblemLink, getLeetcodeUsernameLink,
} from '../../leetcode/utils';
import constants from '../../utils/constants';
import { User } from '../../leetcode/models';

import { MockDatabaseInterface } from './models/mockData.model';

export const users: User[] = [
  {
    name: 'Random User Name',
    link: getLeetcodeUsernameLink('random_username'),
    username: 'random_username',
    solved: 124,
    all: 1700,
    profile: {
      userAvatar: 'https://example.com/random_link',
      aboutMe: 'Random info About Me!',
      company: 'Good Company',
      countryName: 'Good Country',
      ranking: 123,
      realName: 'John Doe',
      reputation: 100,
      school: 'Good School',
      skillTags: ['Skill 1', 'Skill 2'],
      starRating: 4.5,
      websites: ['https://example.com/random_website'],
    },
    submissions: [
      {
        link: getLeetcodeProblemLink('random_problem_slug'),
        status: constants.STATUS_MAP.Accepted,
        language: 'cpp',
        name: 'Random Problem Name',
        time: '10 minutes ago',
      },
      {
        link: getLeetcodeProblemLink('random_problem_slug_2'),
        status: constants.STATUS_MAP['Runtime Error'],
        language: 'python',
        name: 'Random Problem Name 2',
        time: '2 weeks ago',
      },
    ],
    contributions: {
      points: 1000,
      questionCount: 123,
      testcaseCount: 23,
    },
    contestData: {
      userContestRanking: {
        attendedContestsCount: 123,
        globalRanking: 123,
        rating: 123,
      },
      userContestRankingHistory: [
        {
          contest: {
            startTime: 123123131,
            title: 'Contest Name',
          },
          ranking: 123,
          rating: 123,
        },
      ],
    },
    submitStats: {
      acSubmissionNum: [
        {
          count: 12312,
          difficulty: 'Easy',
          submissions: 123,
        },
      ],
      totalSubmissionNum: [
        {
          count: 12312,
          difficulty: 'Easy',
          submissions: 123,
        },
      ],
    },
  },
  {
    name: 'Random User Name 2',
    link: getLeetcodeUsernameLink('random_username_2'),
    username: 'random_username_2',
    solved: 752,
    all: 1700,
    profile: {
      userAvatar: 'https://example.com/random_link_2',
      aboutMe: 'Random info About Me!',
      company: 'Good Company',
      countryName: 'Good Country',
      ranking: 123,
      realName: 'John Doe',
      reputation: 100,
      school: 'Good School',
      skillTags: ['Skill 1', 'Skill 2'],
      starRating: 4.5,
      websites: ['https://example.com/random_website'],
    },
    submissions: [
      {
        link: getLeetcodeProblemLink('random_problem_slug_3'),
        status: constants.STATUS_MAP.Accepted,
        language: 'java',
        name: 'Random Problem Name 3',
        time: '2 hours ago',
      },
      {
        link: getLeetcodeProblemLink('random_problem_slug_4'),
        status: constants.STATUS_MAP['Runtime Error'],
        language: 'javascript',
        name: 'Random Problem Name 4',
        time: '9 hours ago',
      },
    ],
    contributions: {
      points: 1000,
      questionCount: 123,
      testcaseCount: 23,
    },
    contestData: {
      userContestRanking: {
        attendedContestsCount: 123,
        globalRanking: 123,
        rating: 123,
      },
      userContestRankingHistory: [
        {
          contest: {
            startTime: 123123131,
            title: 'Contest Name',
          },
          ranking: 123,
          rating: 123,
        },
      ],
    },
    submitStats: {
      acSubmissionNum: [
        {
          count: 12312,
          difficulty: 'Easy',
          submissions: 123,
        },
      ],
      totalSubmissionNum: [
        {
          count: 12312,
          difficulty: 'Easy',
          submissions: 123,
        },
      ],
    },
  },
];

export const mockDatabaseData: MockDatabaseInterface = {
  users: [],
  mockUser1() { return this.users[0]; },
  savedUsers() {
    return this.users.map((user: User) => (
      { ...this.mockUser1(), username: user.username }
    ));
  },
  fakeResult: true,
};

export default users;
