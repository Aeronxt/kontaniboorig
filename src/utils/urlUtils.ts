export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 60); // Limit length to 60 characters
};

export const generateArticleUrl = (id: number, title: string): string => {
  return `/news/${id}-${generateSlug(title)}`;
};

export const extractIdFromSlug = (slug: string): number => {
  const match = slug.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}; 