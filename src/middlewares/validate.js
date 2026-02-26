import { z } from "zod";

function validate(schema) {

return function(req, res, next){

try {

schema.parse(req.body);

next();

} catch (error) {

if (error instanceof z.ZodError) {

const errors = error.errors.map((err)=>({

field: err.path.join("."),
message: err.message

}));

return res.status(400).json({

error: true,
message: "Zod Validation Failed",
errors

});

}

return res.status(500).json({

error:true,
message:"Internal Server Error"

});

}

}

}

export { validate };