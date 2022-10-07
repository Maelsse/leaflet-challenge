// Creating Inital Map Object
var myMap = L.map("quakemap", {
    center: [37.7749, -122.4194],
    zoom: 5
});


// Adding a tile Layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);;

var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(quakeUrl).then(function (quakeData) {
    // Marker size by magnitude
    function markerSize(magnitude) {
        return magnitude * 4;
    };

    // different color per magnitude
    function getColor(depth) {
        switch(true) {
          case depth > 90:
            return "red";
          case depth > 70:
            return "orangered";
          case depth > 50:
            return "orange";
          case depth > 30:
            return "gold";
          case depth > 10:
            return "yellow";
          default:
            return "lightgreen";
        }
    }
    // GeoJSON Layer
    L.geoJson(quakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng,
                // Set the style based on properties.mag
                {
                    radius: markerSize(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    fillOpacity: 0.7,
                    color: "black",
                    stroke: true,
                    weight: 0.5
                }
            );
    },
        onEachFeature: function (feature, layer) {
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
                mouseout: function(event){
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
            });
            layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
                + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
        }).addTo(myMap);

// Legend

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];
  
  div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
for (var i =0; i < depth.length; i++) {
  div.innerHTML += 
  '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
      depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
  return div;
};
legend.addTo(myMap);
});