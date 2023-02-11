const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const Joi = require('joi');
const { Console } = require('console');

const SCOPES = ['https://www.googleapis.com/auth/contacts'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const payload = Joi.object({});

const handler = (data, client, db) => 
    new Promise(async (resolve, reject) => {
        try{
            const auth = await authorize();
            const service = google.people({version: 'v1', auth});

            let skip = 0;
            let limit = 50;
            let contacts = await Mongo.find({
              db : masterDB,
              collection : 'users',
              project : 'prefix firstName middleName lastName email phoneNumber',
            })
            
            
            
            for(let i in contacts){
                
                let requestBody = {
                    requestBody: {
                        emailAddresses: [
                            {
                                value: contacts[i]?.email || ''
                            }
                        ],
                        names: [
                            {
                                givenName: contacts[i]?.firstName.toUpperCase()  || '', // FirstName
                                middleName : contacts[i]?.middleName.toUpperCase()  || '', // Middle Name
                                familyName: contacts[i]?.lastName.toUpperCase()  || '', // Last Name
                                honorificPrefix : contacts[i]?.prefix.toUpperCase()  || '' // Prefix
                            },
                        ],
                        phoneNumbers: [
                            {
                                value: contacts[i]?.phoneNumber || '',
                                type: "mobile",
                            },
                        ],
                    },
                }
                setTimeout(async function(y) {    
                    let con = await service.people.createContact(requestBody);
                    console.log("%d = >>>>>>>>>>>>>>>>>>> ", y, contacts[i].firstName +' '+ contacts[i].lastName);
                }, i * 10000, i);
            }

            resolve({result : 'success'});
        } catch(e){
            console.log("Error",e);
        }
    })

module.exports = [{
    name: "system/contact/copy",
    action: "list",
    auth: true,
    app: ["HRMS"],
    payload,
    handler
}]

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    console.log(client);

    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
}
