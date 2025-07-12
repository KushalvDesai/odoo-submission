// Utility function to parse @mentions from text
export function parseMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return [...new Set(mentions)]; // Remove duplicates
}

// Mock user database for mentions
export const mockUsers = [
  'alice', 'bob', 'charlie', 'dana', 'eve', 'frank', 'grace', 'henry', 'ivy', 'jack',
  'kate', 'lisa', 'mike', 'nina', 'oliver', 'pam', 'quinn', 'rachel', 'sam', 'tina'
];

export function validateMentions(mentions: string[]): string[] {
  return mentions.filter(mention => mockUsers.includes(mention.toLowerCase()));
} 