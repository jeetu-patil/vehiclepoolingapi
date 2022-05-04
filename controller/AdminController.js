const Admin=require("../model/Admin");


exports.signin=(request,response) => {
    Admin.findOne({email:request.body.email,password:request.body.password})
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};