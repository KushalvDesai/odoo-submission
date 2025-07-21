import Fuse, { IFuseOptions } from 'fuse.js';

type Question = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
};

// Fuse.js configuration for questions search
const fuseOptions: IFuseOptions<Question> = {
  keys: [
    {
      name: 'title',
      weight: 0.7, // Title has highest weight for search relevance
    },
    {
      name: 'desc',
      weight: 0.3, // Description has lower weight
    },
    {
      name: 'tags',
      weight: 0.5, // Tags have medium weight
    },
    {
      name: 'author',
      weight: 0.2, // Author has lowest weight
    }
  ],
  threshold: 0.3, // How strict the search is (0.0 = exact match, 1.0 = match anything)
  distance: 100, // Maximum distance for a match
  minMatchCharLength: 2, // Minimum character length for a match
  includeScore: true, // Include relevance score in results
  includeMatches: true, // Include which parts matched
  ignoreLocation: true, // Don't consider location of match in string
  findAllMatches: true, // Find all matches, not just the first one
};

/**
 * Performs fuzzy search on questions using Fuse.js
 * @param questions Array of questions to search through
 * @param searchTerm The search term to match against
 * @returns Array of questions sorted by relevance, or original array if no search term
 */
export const fuzzySearchQuestions = (questions: Question[], searchTerm: string): Question[] => {
  // If no search term, return all questions
  if (!searchTerm || searchTerm.trim().length === 0) {
    return questions;
  }

  // Create Fuse instance with the questions
  const fuse = new Fuse(questions, fuseOptions);
  
  // Perform the search
  const results = fuse.search(searchTerm.trim());
  
  // Extract the items from the search results (already sorted by relevance)
  return results.map(result => result.item);
};

/**
 * Enhanced filter function that uses fuzzy search
 * @param questions Array of questions to filter
 * @param filter Sort filter (Newest, Oldest, etc.)
 * @param search Search term for fuzzy search
 * @param selectedTags Array of tags to filter by
 * @returns Filtered and sorted array of questions
 */
export const filterQuestionsWithFuzzySearch = (
  questions: Question[], 
  filter: string, 
  search: string, 
  selectedTags?: string[]
): Question[] => {
  let filtered = questions;
  
  // Apply fuzzy search first
  if (search && search.trim().length > 0) {
    filtered = fuzzySearchQuestions(filtered, search);
  }
  
  // Filter by tags
  if (selectedTags && selectedTags.length > 0) {
    filtered = filtered.filter(q => selectedTags.every(tag => q.tags.includes(tag)));
  }
  
  // Sort by filter (only if no search term, as fuzzy search already sorts by relevance)
  if (!search || search.trim().length === 0) {
    switch (filter) {
      case "Newest":
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "Oldest":
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "MostAnswers":
        // This would require additional data, keeping original order for now
        break;
      case "FewestAnswers":
        // This would require additional data, keeping original order for now
        break;
      case "Answered":
        // This would require additional data, keeping original order for now
        break;
      case "Unanswered":
        // This would require additional data, keeping original order for now
        break;
      case "Alphabetical":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Default to newest
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }
  
  return filtered;
};

/**
 * Get search suggestions based on partial input
 * @param questions Array of questions to search through
 * @param partialSearch Partial search term
 * @param limit Maximum number of suggestions to return
 * @returns Array of suggested search terms
 */
export const getSearchSuggestions = (questions: Question[], partialSearch: string, limit: number = 5): string[] => {
  if (!partialSearch || partialSearch.trim().length < 2) {
    return [];
  }

  const searchTerm = partialSearch.trim().toLowerCase();
  const suggestions = new Set<string>();

  // Extract suggestions from titles, descriptions, and tags
  questions.forEach(question => {
    // From title
    const titleWords = question.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.includes(searchTerm) && word.length > 2) {
        suggestions.add(word);
      }
    });

    // From tags
    question.tags.forEach(tag => {
      if (tag.toLowerCase().includes(searchTerm)) {
        suggestions.add(tag);
      }
    });

    // From description (first few words only to keep relevant)
    const descWords = question.desc.toLowerCase().split(/\s+/).slice(0, 20);
    descWords.forEach(word => {
      if (word.includes(searchTerm) && word.length > 3) {
        suggestions.add(word);
      }
    });
  });

  return Array.from(suggestions).slice(0, limit).sort();
};
