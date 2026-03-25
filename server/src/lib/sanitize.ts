// Input sanitization and validation utilities

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 2000); // Max 2000 characters
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate username format
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate message content
 */
export const isValidMessage = (content: string): boolean => {
  return typeof content === 'string' && 
         content.trim().length > 0 && 
         content.length <= 2000;
};

/**
 * Validate server/channel name
 */
export const isValidName = (name: string): boolean => {
  return typeof name === 'string' && 
         name.trim().length >= 1 && 
         name.length <= 100;
};

/**
 * Check for SQL injection patterns
 */
export const hasSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
    /(\bOR\b.*=.*|1=1|'=')/gi
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Rate limit check for user actions
 */
const userActionTimestamps = new Map<string, number[]>();

export const checkRateLimit = (
  userId: string, 
  action: string, 
  maxActions: number = 10, 
  windowMs: number = 60000
): boolean => {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const timestamps = userActionTimestamps.get(key) || [];
  
  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (recentTimestamps.length >= maxActions) {
    return false; // Rate limit exceeded
  }
  
  recentTimestamps.push(now);
  userActionTimestamps.set(key, recentTimestamps);
  
  return true;
};

/**
 * Validate and sanitize object with specific fields
 */
export const validateAndSanitize = (
  data: any,
  schema: Record<string, 'string' | 'number' | 'boolean' | 'email'>
): Record<string, any> | null => {
  const result: Record<string, any> = {};
  
  for (const [key, type] of Object.entries(schema)) {
    const value = data[key];
    
    if (value === undefined || value === null) {
      return null; // Required field missing
    }
    
    switch (type) {
      case 'string':
        if (typeof value !== 'string') return null;
        result[key] = sanitizeInput(value);
        break;
      case 'email':
        if (!isValidEmail(value)) return null;
        result[key] = value.toLowerCase().trim();
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) return null;
        result[key] = value;
        break;
      case 'boolean':
        if (typeof value !== 'boolean') return null;
        result[key] = value;
        break;
    }
  }
  
  return result;
};
