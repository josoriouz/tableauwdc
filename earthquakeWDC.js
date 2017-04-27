(function(){
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    var cols = [
        { id : "mag", alias : "magnitude", dataType : tableau.dataTypeEnum.float },
        { id : "title", alias : "title", dataType : tableau.dataTypeEnum.string },
        { id : "url", alias : "url", dataType : tableau.dataTypeEnum.string },
        { id : "lat", alias : "latitude", columnRole: "dimension", dataType : tableau.dataTypeEnum.float },
        { id : "lon", alias : "longitude",columnRole: "dimension", dataType : tableau.dataTypeEnum.float }
    ];

    var tableInfo = {
        id : "earthquakeFeed",
        alias : "Earthquakes with magnitude greater than 4.5 in the last seven days",
        columns : cols
    };

    schemaCallback([tableInfo]);
  };

  myConnector.getData = function (table, doneCallback) {
    // fetch('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
    // .then((resp) => resp.json())
    // .then(function(data) {
    //   var features = data.features;
    //   var tableData = [];
    //
    //   features.map(feature => {
    //     tableData.push({
    //       "id": feature.id,
    //       "mag": feature.properties.mag,
    //       "title": feature.properties.title,
    //       "url": feature.properties.url,
    //       "lon": feature.geometry.coordinates[0],
    //       "lat": feature.geometry.coordinates[1]
    //     })
    //   });
    //
    //   table.appendRows(tableData);
    //   doneCallback();
    // });
    $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
        var feat = resp.features,
            tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = feat.length; i < len; i++) {
            tableData.push({
                "id": feat[i].id,
                "mag": feat[i].properties.mag,
                "title": feat[i].properties.title,
                "lon": feat[i].geometry.coordinates[0],
                "lat": feat[i].geometry.coordinates[1]
            });
        }

        table.appendRows(tableData);
        doneCallback();
    });
  };

  tableau.registerConnector(myConnector);

  btnSubmit = document.getElementById('submitButton');

  btnSubmit.addEventListener('click', function() {
    tableau.connectionName = "USGS Earthquake Feed Super Test";
    tableau.submit();
  });
})();
