import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';

import constants from '../utils/constants';

import {
  UserProfile,
  GraphQLContext,
  GraphQLQuery,
  RecentSubmissionList,
  SubmissionDumpNode,
  LanguageNode,
  Contest,
  User,
  SubmissionData,
} from './models';
import { getLeetcodeUsernameLink, getLeetcodeProblemLink } from './utils';
import {
  userProfileGraphQLQuery,
  recentSubmissionListGraphQLQuery,
  contestRankingGraphQLQuery,
} from './graphql';
import gqlQuery from './graphql/utils';

dayjs.extend(duration);
dayjs.extend(relativeTime);

async function getLeetcodeDataFromUsername(username: string): Promise<User> {
  // Data for GraphQL Response
  const graphQLLink = `${constants.LEETCODE_URL}/graphql`;

  // Get User Profile Data from GraphQL
  const userProfileQuery: GraphQLQuery = userProfileGraphQLQuery(username);
  const userProfileContext: GraphQLContext = {
    link: graphQLLink,
    query: userProfileQuery,
    headers: {},
  };
  const userData: UserProfile = await gqlQuery<UserProfile>(userProfileContext);

  // Get User Recent Submissions Data from GraphQL
  const submissionsQuery: GraphQLQuery = (
    recentSubmissionListGraphQLQuery(username)
  );
  const submissionContext: GraphQLContext = {
    link: graphQLLink,
    query: submissionsQuery,
    headers: {},
  };
  const submissionData: RecentSubmissionList = (
    await gqlQuery<RecentSubmissionList>(submissionContext)
  );
  const now: number = dayjs().unix();
  const submissions: SubmissionData[] = submissionData.recentSubmissionList.map(
    (submission: SubmissionDumpNode) => {
      const unixTime: number = parseInt(submission.timestamp, 10);

      return {
        link: getLeetcodeProblemLink(submission.titleSlug),
        status: constants.STATUS_MAP[submission.statusDisplay],
        language: submissionData.languageList.find((language: LanguageNode) => (
          language.name === submission.lang
        )).verboseName,
        name: submission.title,
        time: dayjs.duration((unixTime - now) * 1000).humanize(true),
      };
    },
  );

  // Get Contest Data from GraphQL
  const contestQuery: GraphQLQuery = contestRankingGraphQLQuery(username);
  const contestContext: GraphQLContext = {
    link: graphQLLink,
    query: contestQuery,
    headers: {},
  };
  const contestData: Contest = await gqlQuery<Contest>(contestContext);

  return {
    name: userData.matchedUser.profile.realName,
    link: getLeetcodeUsernameLink(username),
    username,
    solved: userData.matchedUser.submitStats.acSubmissionNum[0].count,
    all: userData.allQuestionsCount[0].count,
    profile: userData.matchedUser.profile,
    contributions: userData.matchedUser.contributions,
    contestData,
    submitStats: userData.matchedUser.submitStats,
    submissions,
  };
}

export default getLeetcodeDataFromUsername;
