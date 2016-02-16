(function() {
  var usaMap = new Datamap({
      element: document.getElementById('usa'),
      scope: 'usa',
      fills: {
        defaultFill: '#777672'
      },
  });

  function sum( obj ) {
    return Object.keys( obj )
      .reduce( function( sum, key ){
        return sum + parseFloat( obj[key] );
      }, 0 );
  }

  function convert(percent) {
    if (percent > 0.18){
      return '#CC0814'
    } else if (percent > 0.12) {
      return '#FC282F'
    } else if (percent > 0.075) {
      return '#FD9899'
    } else if (percent > 0.01) {
      return '#FECCCD'
    } else if(percent > 0){
      return '#777672'
    }
  }

  var seenStates = {}
  var stateEventCounter = 0
  channel.bind('my_event', function(data){
    var lat = data.latitude;
    var lon = data.longitude;
    var state = data.state;
    var bombs = [{
      radius: 25,
      latitude: lat,
      longitude: lon
    }]

    if (state.match(/[A-Za-z]/i)) {
      seenStates[state] ? seenStates[state] += 1 : seenStates[state] = 1
    }

    usaMap.bubbles(bombs, {});
    stateEventCounter += 1
    // if (stateEventCounter > 25) {
      console.log('***************updating color*****************')
      var total = sum(seenStates)
      var updateHash = {}
      $.each(seenStates, function(key, value) {
        updateHash[key] = convert(value/total)
      });
      console.log(updateHash)
      usaMap.updateChoropleth(updateHash);
      stateEventCounter = 0
    // }
  })
})()
