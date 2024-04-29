const fs = require('fs');
const urllib = require('url');
const https = require('https');
 
function head(url, handler) {
    const siteurl = urllib.parse(url);
 
    const options = {
        hostname: siteurl.host,
        port: null,
        timeout: 30000,
        path: siteurl.pathname,
        method: 'GET',
        headers : {
            'User-Agent': 'curl/7.47.0'
        }
    };
 
    const request = https.request(options, handler);
    request.end();
    return request;
}
 
function trygrab(pubName, pubId, url, index, andThen) {
        return head(url, (resp) => {
            console.log(pubName + "," + pubId + "," + url + "," + resp.statusCode);
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
        const pubAccountId = data[i][0];
        const pubName = data[i][1];

        //checking for presence of domain,then checking for multiple domains (in which case, selecting the first one)
        if (data[i][2]) {
            if (data[i][2].indexOf(',') > -1) {
                var url = data[i][2].split(',')[0];
            } else {
                var url = data[i][2];
            }
        } else {
            var url = '';
        }

        //check for https, append /app-ads.txt
        if (url.indexOf('http') < 0) {
            url = 'https://' + url;
        }

        url += '/app-ads.txt'
        process.stderr.clearLine();
        process.stderr.cursorTo(0);
        process.stderr.write(url + " attempt: " + retries);
        if (url != 'https:///app-ads.txt') {
            trygrab(pubName, pubAccountId, url, i, grabNext).on('error', function(e) {
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