const excelJS = require('exceljs');
const Joi = require('joi');

const payload = Joi.object({});

const handler = (data, client, db) => 
    new Promise(async (resolve, reject) => {
        try{
            
            const workbook = new excelJS.Workbook();

            const worksheet = workbook.addWorksheet("My Contact"); // New Worksheet

            const path = "public"; 

            // Column for data in excel. key must match data key
            worksheet.columns = [
                { header: "S no.", key: "s_no", width: 10 }, 
                { header: "Prefix", key: "prefix", width: 10 },
                { header: "First Name", key: "firstName", width: 10 },
                { header: "Middle Name", key: "middleName", width: 10 },
                { header: "Last Name", key: "lastName", width: 10 },
                { header: "Email", key: "email", width: 10 },
                { header: "Mobile Number", key: "phoneNumber", width: 10 },
            ];

           

            let contacts = await Mongo.find({
                db : masterDB,
                collection : 'users',
                project : 'prefix firstName middleName lastName email phoneNumber'
            })
            
            let counter = 1;
            contacts.forEach((contact) => {
                let con = {
                    s_no : counter,
                    prefix : contact?.prefix?.toUpperCase() || '',
                    firstName : contact.firstName.toUpperCase(),
                    middleName : contact?.middleName?.toUpperCase() || '',
                    lastName : contact.lastName.toUpperCase(),
                    email : contact?.email || '',
                    phoneNumber :  contact?.phoneNumber
                }
                worksheet.addRow(con); 
                counter ++;
            });

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });

            try{
                const data = await workbook.xlsx.writeFile(`${path}/contact1.xls`).then(()=>{
                    resolve({
                        status: "success",
                        message: "file successfully downloaded",
                        path: `${path}/users.xlsx`,
                       })
                })
            }
            catch(e){
                console.log(e);
                reject({
                    status: "error",
                    message: "Something went wrong",
                  })
            }
        }
        catch(e){
            console.log(e);
            reject(e);
        }
    })

module.exports = [{
    name: "system/contact/exports",
    action: "list",
    auth: true,
    app: ["HRMS"],
    payload,
    handler
}]