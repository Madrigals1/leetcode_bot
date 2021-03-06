import { Context } from '../models';

// Change bold, italic and code from HTML to Markdown
export function formatMessage(message: string): string {
  return message
    .replace(/<b>|<\/b>/g, '**')
    .replace(/<i>|<\/i>/g, '*')
    .replace(/<code>|<\/code>/g, '`');
}

export function reply(message: string, context: Context): Promise<string> {
  // Get channel from context
  const { channel, photoUrl } = context;

  // Format message to Markdown style, requested by Discord
  const formattedMessage: string = formatMessage(message);

  // Send message back to channel
  return new Promise((resolve, reject) => {
    if (channel) {
      if (photoUrl) channel.send(formattedMessage, { files: [photoUrl] });
      else channel.send(formattedMessage);
      resolve('Success');
    } else {
      reject(Error('Channel is not provided in context'));
    }
  });
}
