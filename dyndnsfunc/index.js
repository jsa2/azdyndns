
var {anyreq2,getMsitoken,getClientCredentialsToken} = require('./msi')

module.exports = async function (context, req) {
    var uri = "https://management.azure.com/subscriptions/3539c2a2-cd25-48c6-b295-14e59334ef1c/resourceGroups/dewired-rg/providers/Microsoft.Network/dnszones/dewi.red/A/dyn?api-version=2018-05-01"
    console.log(req.headers)

    
    if (process.env['MSI_ENDPOINT1']) {

        return context.res = {
            body:req.headers
        };
    }

    var incomingA = req.headers['x-forwarded-for'].split(':')[0]
    var apiversion = req.query.api
    var resource = req.query.resource

    if (process.env['MSI_ENDPOINT']) {
        console.log('running MSIVersion')
        console.log('using MSI version')
        var token = await getMsitoken(apiversion,resource)
        .catch((error) => {
            return context.res = {
                body:error
            };
        
        })

    
    } else {
        console.log('using local version')
        token = await getClientCredentialsToken()
        .catch((error) => {

            return context.res = {
                body:error
            };
        
        })
    }



    var options = {
        uri,
        headers:{
            authorization: 'bearer ' + token['access_token']
        },
        json:true
    }
    console.log(options)

    var dns = await anyreq2(options,'body',200).catch((error) => {
        console.log('returning error')
        context.res = {
            body: error
        };
        
    })

    console.log(dns)

    if (dns.properties.ARecords[0].ipv4Address !== incomingA) {
        console.log('current ipv4 ' +  dns.properties.ARecords[0].ipv4Address)
       dns.properties.ARecords[0].ipv4Address = incomingA
       dns.properties['TTL'] = 360
       options.body = dns
       options.method="patch"
       console.log('patching',incomingA,options.body)
      var dns2 = await anyreq2(options).catch((error) => console.log(error))

      
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            incomingA,
            dns: dns.properties.ARecords
        }
    };
    context.done()
        } 

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: dns,
        more: dns.properties.ARecords[0].ipv4Address = incomingA
    };
    context.done()
}