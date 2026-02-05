import { z } from 'zod';

// Create user validation schema
const createUserSchema = z.object({
    username: z.string({
      required_error: 'Username is required'
    }).min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .trim(),
    
    mobile: z.string({
      required_error: 'Mobile number is required'
    }).regex(/^\+?[1-9]\d{9,14}$/, 'Invalid mobile number format'),
    
    email: z.string({
      required_error: 'Email is required'
    }).email('Invalid email format')
      .toLowerCase()
      .trim(),
    
    displayName: z.string({
      required_error: 'Display name is required'
    }).min(1, 'Display name cannot be empty')
      .max(100, 'Display name must not exceed 100 characters')
      .trim(),
    
    role: z.enum(['student'], {
      invalid_type_error: 'Role must be only student'
    }).optional(),
    password : z.string()
});


export {createUserSchema};