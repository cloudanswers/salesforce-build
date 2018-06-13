var jsforce = require("jsforce");
var conn = new jsforce.Connection({});

const submitPackage = async packageId => {
  const url = "/services/data/v41.0/tooling/sobjects/PackageUploadRequest";
  const params = {
    MetadataPackageId: packageId,
    VersionName: "Automatic Build",
    IsReleaseVersion: false
  };
  return conn.requestPost(url, params);
};

const getPackageId = async packageName => {
  return conn.tooling
    .query(`select Id from MetadataPackage where Name = '${packageName}'`)
    .then(res => res.records[0].Id);
};

conn.login(process.env.USERNAME, process.env.PASSWORD, function(err, userInfo) {
  if (err) {
    return console.error(err);
  }
  getPackageId(process.env.PACKAGE).then(submitPackage);
});
