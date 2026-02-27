import { z } from 'zod';

// Create item validation schema
const createItemSchema = z.object({
    name: z.string({
        required_error: 'Item name is required'
    }).min(1, 'Item name cannot be empty')
        .max(100, 'Item name must not exceed 100 characters')
        .trim(),

    category: z.string({
        required_error: 'Category is required'
    }).min(1, 'Category cannot be empty')
        .trim(),

    quantity: z.number({
        required_error: 'Quantity is required'
    }).min(1, 'Quantity must be at least 1'),

    purchaseDate: z.string({
        required_error: 'Purchase date is required'
    }),

    expiryDate: z.string({
        required_error: 'Expiry date is required'
    })
});

export { createItemSchema };
