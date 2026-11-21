import { ConvexError } from "convex/values";

export const POST_TITLE_MAX = 100;
export const POST_BODY_MIN = 4;
export const POST_BODY_MAX = 10000;
export const COMMENT_BODY_MIN = 2;
export const COMMENT_BODY_MAX = 1000;
export const SEARCH_LIMIT_MAX = 20;

export function requireText(
  value: string,
  field: string,
  min: number,
  max: number,
) {
  const text = value.trim();
  if (text.length < min || text.length > max) {
    throw new ConvexError(`${field} must be between ${min} and ${max} characters`);
  }
  return text;
}
