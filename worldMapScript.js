(function() {
  var worldMap = new Datamap({
    element: document.getElementById('events_map'),
    scope: 'world',
    fills: {
      defaultFill: '#777672'
    },
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false
    }
  });

  function sum( obj ) {
    return Object.keys( obj )
      .reduce( function( sum, key ){
        return sum + parseFloat( obj[key] );
      }, 0 );
  }

  function convert(percent) {
    if (percent > 0.50){
      return '#CC0814'
    } else if (percent > 0.20) {
      return '#FC282F'
    } else if (percent > 0.075) {
      return '#FD9899'
    } else if (percent > 0.03) {
      return '#FECCCD'
    } else if (percent > 0.0000){
      return '#FECCCD'
    }
  }

  var seenCountries = {}
  var eventCounter = 0
  channel.bind('my_event', function(data){
    var lat = data.latitude
    var lon = data.longitude
    var country = data.country
    var bombs = [{
      radius: 12,
      latitude: lat,
      longitude: lon
    }]
    if (country != "USA") {
      seenCountries[country] ? seenCountries[country] += 1 : seenCountries[country] = 1
    }

    worldMap.bubbles(bombs, {});
    eventCounter += 1
    if (eventCounter > 25) {
      total = sum(seenCountries)
      updateHash = {}
      $.each(seenCountries, function(key, value) {
        updateHash[key] = convert(value/total)
      });
      worldMap.updateChoropleth(updateHash);
      eventCounter = 0
    }
  })
})()
