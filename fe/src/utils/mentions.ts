// Utility functions for handling user mentions

export const parseMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

export const validateMentions = (mentions: string[]): string[] => {
  // In a real app, you would validate against actual users
  // For now, we'll just return the mentions as-is
  return mentions.filter(mention => mention.length > 0);
};

export const formatMentions = (text: string): string => {
  return text.replace(/@(\w+)/g, '<span class="text-[#5865f2] font-semibold">@$1</span>');
}; 