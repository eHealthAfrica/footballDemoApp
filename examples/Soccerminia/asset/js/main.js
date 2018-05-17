function getFootballData(url) {
  return $.ajax({
    headers: { 'X-Auth-Token': 'c945b36b673142b7ba2f4156dde6c881' },
    url: url,
    dataType: 'json',
    type: 'GET'
  })
};
$('document').ready(function () {
  console.log("Me");
  getFootballData('http://api.football-data.org/v1/competitions/').done(function(response) {
    // do something with the response, e.g. isolate the id of a linked resource        
        for (let i = 0; i < response.length; i++) {
            let element = response[i];
            let myCards = $('<div id="legueItem" class="card mb-4"><div class="card-body"><h5 class="card-title primary">' + element.caption + '</h5><p class="card-text"> # of Games: ' + element.numberOfGames + '</p><p class="card-text"> # of Matches: ' + element.numberOfMatchdays + '</p><p class="card-text"># of Teams: ' + element.numberOfTeams + '</p><p class="card-text"><small class="text-muted">Current Match Played: ' + element.currentMatchday + '</small></p><a href="' + element._links.fixtures.href + '" data-toggle="modal" data-target="#modelId" onclick="getFixtures(' + element._links.fixtures.href + ')" class="btn btn-outline-primary">Fixtures</a><a href="'+element._links.teams.href +'" data-toggle="modal" data-target="#modelId" class="btn btn-outline-secondary">Teams</a><a href="'+element._links.leagueTable.href +'" class="btn btn-outline-info" data-toggle="modal" data-target="#modelId">Tables</a></div></div>');
            myCards.appendTo('#legue-deck');
        }
        console.log(response)
    }); 
  });

  $('#modelId').on('show.bs.modal', event => {
    var button = $(event.relatedTarget).attr('href');
    var modal = $(this);
    console.log(button);
    // getFixtures(button);
  });


  function getFixtures (href) {
   getFootballData(href).done(function(response) {
        // $('show.bs.modal');
        $('#fixtures').DataTable().destroy();
          console.log(response.fixtures);
          
          var fixturesTable = $(`
          <table id="fixtures" class="display" style="width:100%">
            <thead>
              <tr>
                
  
              </tr>
            </thead>
          </table>`);
          fixturesTable.appendTo('#mainModal');
          $('#fixtures').DataTable( {
            data: response.fixtures,
            columns: [
              { data: 'homeTeamName', title: 'Home Team' },
              { data: 'awayTeamName', title: 'Away Team' },
              { data: 'result.goalsAwayTeam', title: 'Away Result'},
              { data: 'result.goalsHomeTeam', title: 'Home Result' },
              { data: 'status', title: 'Status' }
            ]
        } );
      }); 
  };

  function getTeams(href) {
    getFootballData(href).done(function(response) {
      // $('show.bs.modal');
        console.log(response.teams);
        $('#fixtures').DataTable().destroy();
        $('#fixtures').DataTable( {
          data: response.fixtures,
          columns: [
              { data: 'homeTeamName' },
              { data: 'awayTeamName' },
              { data: 'result.goalsAwayTeam' },
              { data: 'result.goalsHomeTeam' },
              { data: 'status' }
          ]
      } );
    }); 
  }