const jsforce = require("jsforce");

const SALESFORCE_API_VERSION = "43.0";

let conn = new jsforce.Connection({
    loginUrl: process.env.SALESFORCE_URL
});

// jsforce functions aren't marked async so you can't simply await them
async function list(conn, obj, folder) {
    return new Promise((resolve, reject) => {
        const types = [
            {
                type: obj.xmlName
            }
        ];
        if (folder) types[0].folder = folder;
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
                console.log('<?xml version="1.0" encoding="UTF-8"?>');
                console.log(
                    '<Package xmlns="http://soap.sforce.com/2006/04/metadata">'
                );

                // https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_report.htm
                // "Note that ReportFolder is not returned as a type in describeMetadata()."

                var reportFolders = await list(conn, {
                    xmlName: "ReportFolder"
                });
                console.log("<!-- Report -->\n<types><name>Report</name>");
                for (let i = 0; i < reportFolders.length; i++) {
                    console.log(
                        "<members>" + reportFolders[i].fullName + "</members>"
                    );
                    let reports = await list(
                        conn,
                        { xmlName: "Report" },
                        reportFolders[i].fullName
                    );
                    // if only one report, comes not as part of array... :|
                    if (reports && !Array.isArray(reports)) reports = [reports];
                    if (reports) {
                        reports.map(_ => {
                            console.log(
                                "<members>" + _.fullName + "</members>"
                            );
                        });
                    }
                }
                console.log("</types>");

                for (let i = 0; i < metadata.metadataObjects.length; i++) {
                    let obj = metadata.metadataObjects[i];
                    if (obj.xmlName == "StandardValueSetTranslation") continue; // gives 500 error

                    console.log("<!-- " + obj.xmlName + "-->");
                    let res = await list(conn, obj);
                    if (res && res.length > 0) {
                        console.log("<types><name>" + obj.xmlName + "</name>");
                        for (let j = 0; j < res.length; j++) {
                            // if (res[j].namespacePrefix) continue;
                            console.log(
                                "<members>" + res[j].fullName + "</members>"
                            );
                        }
                        console.log("</types>");
                    }
                }

                console.log("<version>43.0</version>");
                console.log("</Package>");
            })
            .then(console.log)
            .catch(console.error);
    })
    .catch(console.error);
