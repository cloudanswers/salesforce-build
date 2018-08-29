const jsforce = require("jsforce");

const SALESFORCE_API_VERSION = "43.0";

let conn = new jsforce.Connection({
    loginUrl: process.env.SALESFORCE_URL
});

// jsforce functions aren't marked async so you can't simply await them
async function list(conn, obj) {
    return new Promise((resolve, reject) => {
        const types = [
            {
                type: obj.xmlName
            }
        ];
        conn.metadata
            .list(types, SALESFORCE_API_VERSION)
            .then(resolve)
            .catch(reject);
    });
}

conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD)
    .then(x => {
        conn.metadata
            .describe(SALESFORCE_API_VERSION)
            .then(async metadata => {
                // TODO chunks of 3 allows by api
                for (let i = 0; i < metadata.metadataObjects.length; i++) {
                    let obj = metadata.metadataObjects[i];
                    if (obj.xmlName == "StandardValueSetTranslation") continue; // gives 500 error
                    console.log("<!-- " + obj.xmlName + "-->");
                    let res = await list(conn, obj);
                    if (res && res.length > 0) {
                        console.log("<types><name>" + obj.xmlName + "</name>");
                        for (let j = 0; j < res.length; j++) {
                            if (res[j].namespacePrefix) continue;
                            console.log(
                                "<members>" + res[j].fullName + "</members>"
                            );
                        }
                        console.log("</types>");
                    }
                }
            })
            .then(console.log)
            .catch(console.error);
    })
    .catch(console.error);
