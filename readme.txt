SCOUTER - automatically validate seller domains and update sellers.json


1) Download/Installation:
    - Download/clone Scouter to your local machine
    - Open a new terminal window inside the Scouter repo/folder, and run "npm install"
    - This will install the necessary dependencies for Scouter (namely the CSV module)

2) Setup input file (the sellers/domains that need to be added to sellers.json)
    - The list of new seller domains must be saved within this folder as "seller_domains.csv"
    - Each entry must follow this format: SellerName,SellerID,Domain
    - If 'Domain' contains a comma separated list, please note that Scouter will only verify the first domain listed

3) Validating domains
    - Run the following command: "npm run scouter"
    - This will begin the process of requesting each of the domains listed in the seller_domains.csv
        - Each URL will have /app-ads.txt appended, and then Scouter will make a request to that URL
        - If the request is completed, Scouter will make an entry in results.csv indicating the status code (200s = successful, 300s = redirect, and 400s indicate error)
        - If the request is timed out, Scouter will try to repeat the request up to 4 times. 
        - If it continues to timeout, Scouter will give up and move onto the next URL, without making an entry in results.csv
        - The current URL in progress will be indicated in the terminal, along with the number of retries that have happened so far
        - Once the script has finished making requests, you can look at results.csv for more details, or simply run the updater script (senzu)

4) Updating Sellers.json
    - Make sure the most recent version of sellers.json is copied into this folder 
    - Also, make sure the Scouter script has finished running (you should see "results.csv" once it finishes)
    - Run the command: "npm run senzu"
    - This will update your local sellers.json file to include the entries found in results.csv
    - If there are any duplicate IDs in sellers.json, you'll see a message in your terminal listing which IDs are duplicates. These will need to be removed manually (copy the ID and ctrl+F, etc)