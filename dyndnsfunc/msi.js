var rq = require('request')
var path = require('path')


function getClientCredentialsToken () {
    return new Promise ((resolve,reject) => {

        form = require('./client.json')
        var options = {
            json:true,
            headers:[{
            "content-type":"application/x-www-form-urlencoded" 
            }
            ],
            form
        }
        
            rq.post("https://login.microsoftonline.com/dewired.onmicrosoft.com/oauth2/token",options, (error,response) => {
            
                if (error) {
                    return reject (error)
                }

                Object.keys(response).map((key) => {
                    if (key == "body")  {
                        if (response.body.error) {return reject(response.body.error)} 
                        else if (response.body.access_token) {return resolve(response.body)} 
                        else {return resolve (response.body)}
                    }
                    
                })
               
             }

            )
    })

}

function getMsitoken2 () {
    return new Promise ((resolve,reject) => {

        var options = {
            json:true,
            uri: `${process.env['MSI_ENDPOINT']}?resource=https://vault.azure.net&api-version=2019-08-01`,
            headers:{
            "X-IDENTITY-HEADER":process.env['IDENTITY_HEADER']
            }
        }
        console.log(options)

        rq.get(options, (error,response) => {
            console.log(response.body)
            if (error) {
                return reject (error)
            }

            Object.keys(response).map((key) => {
                if (key == "body")  {
                    if (response.body.error) {return reject(response.body.error)} 
                    else if (response.body.access_token) {return resolve(response.body)} 
                    else {return resolve (response.body)}
                }
                
            })
            
        })

    })

}

function getMsitoken (apiversion,resource) {
    return new Promise ((resolve,reject) => {

        var options = {
            json:true,
            uri: `${process.env['MSI_ENDPOINT']}?resource=${resource}&${apiversion}`,
            headers:{
            "X-IDENTITY-HEADER":process.env['IDENTITY_HEADER']
            }
        }
        console.log(options)

        rq.get(options, (error,response) => {
            console.log(response.body)
            if (error) {
                return reject (error)
            }

            Object.keys(response).map((key) => {
                if (key == "body")  {
                    if (response.body.error) {return reject(response.body.error)} 
                    else if (response.body.access_token) {return resolve(response.body)} 
                    else {return resolve (response.body)}
                }
                
            })
            
            reject({
                msg:response.body,
                code:response.statusCode,
                s:response.statusMessage,
                options
                
            })

        })

        

    })

}

function secretsList (kvOpt) {

    return new Promise ((resolve,reject) => {

        rq.get(kvOpt,(error,response) => {
            console.log(response)
              if (error) {
                  console.log(error)
                    return reject(error)
                }

                Object.keys(response).map((key) => {
                    if (key == "body")  {
                        console.log('body object',JSON.stringify(response.body))
                        if (response.body.error) {return reject(response.body.error)} 
                        else if (response.body.access_token) {return resolve(response.body)}
                        else {return resolve (response.body)}
                    }
                    
                })
        })

     }
    
    )
   

}


function anyreq2(options, successKey) {

    return new Promise( (resolve, reject) => {

        rq(options, (error, response) => {
            //console.log(options)
                if (error) {
                    return reject(JSON.stringify(error))
                }
             
                console.log('statuscode:',response.statusCode)
                console.log('respo',response.body)

                Object.keys(response).forEach((key) => {
                   // console.log(key)
                    if (key == successKey) {
                        console.log('found', successKey)
                        if (response.body.error) {
                            //console.log(response.body.error)
                            return reject({
                                body:response.body,
                                error:response.body.error,
                                statuscode:response.statusCode
                            })
                        } else {
                            return resolve(response.body)
                        }

                    }
                    /* console.log((index + 1),array.length)
                    if ((index + 1) > array.length) {
                        console.log('no matching key found returning status code')
                        return (resolve(response.statusCode)) 
                    } */
                    // if (index )
                })

                resolve({
                    status:response.statusCode,
                    body:response.body
                })

            }

        )
    })

}

module.exports={getMsitoken,getClientCredentialsToken,secretsList, anyreq2,getMsitoken2}