import {z} from "zod";

function validate(schema){
    return function(req, res, next){
        try {
           schema.parse(req.body)
            next();
        } catch (error) {
            if(error instanceof z.ZodError){
                const parsedErrorMessage = JSON.parse(error.message);
                const errors = parsedErrorMessage.map((err) => ({
                    field: err.path.join("-"),
                    message: err.message
                }))

                res.status(400).json({
                    error: true,
                    message: "Zod Validation failed!",
                    errors: errors
                })
            }

            // console.error(error)
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
}

export {validate};