var fs = require('fs');
var urllib = require('url');
 
var pendingGets = 0;
 
const https = require('https');
 
function head(url, handler) {
    var siteurl = urllib.parse(url);
 
    var options = {
        hostname: siteurl.host,
        port: null,
        timeout: 300000,
        path: siteurl.pathname,
        method: 'GET',
        headers : {
            'User-Agent': 'curl/7.47.0'
        }
    };
 
    var request = https.request(options, handler);
    request.end();
    return request;
}
 
function trygrab(pubId, url, index, andThen) {
 
 
    return head(url, (resp) => {
    //for entries with no domain listed, I'm instead populating it with my own website url as a flag
    if (url != 'https://bsharpcb.com/app-ads.txt') {
        console.log(pubId + "," + url + "," + resp.statusCode + "," + retries);
    }
    resp.destroy();
    retries = 1;
    andThen();
    });
 
}
 
var filename = process.argv[2];
 
var parse = require('csv-parse');
 
var i = -1;
var retries = 1;
var parser = parse({delimiter: ','}, function(err, data){
 
 
    function grabNext() {
        i++;
        if(i >= data.length) { return; }
        var pubAccountId = data[i][0];

        //checking for presence of domain,then checking for multiple domains (in which case, selecting the first one)
        if (data[i][2]) {
            if (data[i][2].indexOf(',') > -1) {
                var url = data[i][2].split(',')[0];
            } else {
                var url = data[i][2];
            }
        } else {
            var url = 'bsharpcb.com';
        }

        //check for https, append /app-ads.txt
        if (url.indexOf('http') < 0) {
            url = 'https://' + url;
        }

        url += '/app-ads.txt'

        process.stderr.clearLine();
        process.stderr.cursorTo(0);
        process.stderr.write(url + " attempt: " + retries);
        if (url != 'https://bsharpcb.com/app-ads.txt') {

            trygrab(pubAccountId, url, i, grabNext).on('error', function(e) {
                if (retries < 3) {
                    i--;
                }
                retries++;
                grabNext();
            });
        } else {
            grabNext();
        }
    }
 
    grabNext();
 
 
 
});
 
fs.createReadStream(filename).pipe(parser);