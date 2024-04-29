const fs = require('fs');
const parse = require('csv-parse');
const pubs = require('./sellers.json');

const filename = process.argv[2];

let checked = [];
let dupes = [];

const parser = parse({delimiter: ','}, function(err, data){
        for (let i=0; i<data.length; i++) {
            if (data[i][2] && data[i][4]<400) {
                pubs.sellers.push(
                    {
                        "seller_id": data[i][1],
                        "seller_type": "PUBLISHER",
                        "domain": data[i][2].indexOf(',') > 0 ? data[i][2].split(',')[0] : data[i][2],
                        "name": data[i][0]
                    }
                    )
                }
            }
            for (let w=0; w<pubs.sellers.length; w++) {
                if(checked[pubs.sellers[w].seller_id]) {
                    dupes.push(pubs.sellers[w].seller_id)
                }
                checked[pubs.sellers[w].seller_id] = 'added to list';
            }
            console.log(`Found duplicate IDs, please review before updating sellers.json: ${dupes}`);
            fs.writeFile("new_pubs.json", JSON.stringify(pubs), err => {if (err) throw err; console.log('all done');})
});
fs.createReadStream(filename).pipe(parser);

