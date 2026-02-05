import { date, success } from "zod";

function demoFunction(req,res){
    try{
        res.status(200).json({
           message : "Demo Api has sucessfully hit the endpoint"
        })
    }catch(error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
}
function demoHealth(req,res){
     try{
        res.status(200).json({
           message : "Demo Api has sucessfully hit the endpoint"
        })
    }catch(error){
        res.status(500).json({
            error : true,
            message : error.message
        })
    }
}
function createDemo(req, res) {
  try {
    const { name, email } = req.body;

    // simple validation
    if (!name || !email) {
      return res.status(400).json({
        error: true,
        message: "Name and Email are required",
      });
    }

    res.status(201).json({
      success: true,
      message: "Demo data received successfully",
      data: {
        name,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}



export  { demoFunction,demoHealth,createDemo};