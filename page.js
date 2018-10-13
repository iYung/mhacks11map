var client = algoliasearch('WWH064LBS0', '0fb85dc186ad906ed95a01f12cceecfc');
var index = client.initIndex('users');

index.setSettings({
    customRanking: [
        "desc(score)"
    ]
});

var platform = new H.service.Platform({
    'app_id': 'hzNspoXnIKblIXoeiLz2',
    'app_code': 'mLZ0PvttGr5bErN72jLmtw'
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

navigator.geolocation.getCurrentPosition(populateMap);

function populateMap(pos) {

    var map = new H.Map(
    document.getElementById('map'),
    defaultLayers.normal.map,
    {
      zoom: 14,
      center: { lat: pos.coords.latitude, lng: pos.coords.longitude }
    });

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    var ui = H.ui.UI.createDefault(map, defaultLayers);

    index.search({
        aroundLatLngViaIP: true
      }).then(res => {
        console.log(res.hits);
        res.hits.forEach( (elem, idx) => {
            var scaled = (7 + Math.abs(elem.score)) / 40
            map.addObject(new H.map.Circle(
                // The central point of the circle
                {lat: elem["_geoloc"]["lat"], lng: elem["_geoloc"]["lng"]},
                // The radius of the circle in meters
                250,
                {
                  style: {
                    strokeColor: 'rgba(55, 85, 170, 0.6)', // Color of the perimeter
                    lineWidth: 0,
                    fillColor: elem.score >= 0 ? 'rgba(0, 0, 128, ' + scaled + ')' : 'rgba(128, 0, 0,' + scaled + ')'  // Color of the circle
                  }
                }
            ));
        });
      });

}
