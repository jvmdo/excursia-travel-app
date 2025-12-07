import emojiRegex from "emoji-regex";

const regex = emojiRegex();

export function removeEmojis(text: string): string {
  return text.replaceAll(regex, "");
}
