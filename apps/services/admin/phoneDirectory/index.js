const Joi = require('joi');
const truecallerjs = require('truecallerjs');
var MongoClient = require('mongodb').MongoClient;

module.exports = [{

    name: "phone|directory|demo",
    action: "list",
    auth: true,
    app: ["HRMS"],
    payload: Joi.object({
    }),
    handler: (data, client, db) => {
        return new Promise(async (resolve, reject) => {
            try{
                let phoneNumbers = '9723177440,9820238407';
                let countryCode = "IN";
                let installationId = 'a2i0U--bn7Z_xFskr8TOEzitPMG5KOSS_8t0XbsS3XPQ1-XufI7o2MJln6_L3j41';
                var url = "mongodb://localhost:27017/";
                MongoClient.connect(url, async function(err, db) {
                    if (err) throw err;
                    let dbo = db.db("admin");

                    let phoneNumbers = [
                    '9724119619',
                    '9712027943',
                    '9726354534',
                    '9574691154',
                    '9405917292',
                    '8460271803',
                    '8141817060',
                    '9173146846',
                    '8401549848',
                    '9425978884',
                    '6353528845',
                    '8511746247',
                    '7878535701',
                    '8238508200',
                    '8000919020',
                    '7984978375',
                    '9033346068',
                    '9054630008',
                    '6354462626',
                    '7435086997',
                    '9099995691',
                    '8780607706',
                    '9904771335',];

                    

                    for(let i in phoneNumbers){
                        setTimeout(async() => {
                            let exist = await dbo.collection("users").findOne({ phone : phoneNumbers[i]});
                            if(!exist){
                                var searchData = {
                                    number: phoneNumbers[i],
                                    countryCode: countryCode,
                                    installationId: installationId
                                }
                                var sn = truecallerjs.searchNumber(searchData);
                                sn.then(async function(response) {

                                    console.log(response);

                                    let name = (response?.data[0]?.name) ? response?.data[0]?.name.split(" ")  : '';

                                    let data = response?.data[0];
                                    if(data){
                                        let object = {
                                            firstName : name[0] || '-',
                                            lastName : name[1] || '-',
                                            phone : phoneNumbers[i],
                                            email : data?.internetAddresses[0]?.id || '',
                                            phoneNumber : data?.phones[0]?.e164Format,
                                            nationalFormat : data?.phones[0]?.nationalFormat,
                                            data : data,
                                        }
                                        await dbo.collection("users").insertOne(object, function(err, res) {
                                            if (err) throw err;
                                            console.log(i, "1 document inserted");
                                        });
                                    }


                                })
                            } else {
                                console.log("S", i, "phoneNumbers" , phoneNumbers)
                            }
                        }, 5000 * i)
                    }
                   
                });

                resolve({ result : "Success"})
            }
            catch(e){
                reject(e);
            }
        })
    },
}]