import * as DiscordBot from 'discord.js';
import TelegramBot from 'node-telegram-bot-api';

export interface Options {
  polling?: boolean;
  // eslint-disable-next-line camelcase
  parse_mode?: string;
  // eslint-disable-next-line camelcase
  reply_markup?: string;
  files?: string[];
}

export interface Channel {
  send;
}

export interface Context {
  args: string[];
  reply: (message: string, context: Context) => Promise<string>;
  channel?: DiscordBot.TextChannel
    | DiscordBot.DMChannel
    | DiscordBot.NewsChannel
    | Channel;
  provider: string;
  prefix: string;
  chatId?: number;
  options?: Options;
  bot?: DiscordBot.Client | TelegramBot;
  photoUrl?: string;
}
