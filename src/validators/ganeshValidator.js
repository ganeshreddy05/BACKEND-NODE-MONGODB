import {z} from "zod"

const createBookSchema = z.object({
    title : z.string().min(4,"titlr should cinaton min 4 letters").max(1000,"title should not exceed"),
    author : z.string().min(4,"author should contain min 4 letters").max(1000,"author should not exceed"),
    pages : z.number().min(1).positive("pages must be positive"),
    PublishedYear : z.number().min(1000,"published year must be after 1000").max(2030,"published year should not be in future"),
    genre : z.string().min(4,"genre should contain min 4 letters").max(1000,"genre should not exceed"),
})
export {createBookSchema}