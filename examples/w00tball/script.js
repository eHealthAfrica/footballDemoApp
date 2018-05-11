
var getFootballAPI = function(url) {
	return fetch('https://api.football-data.org/v1/' + url, { 
		mode: 'cors',
		headers: {
	      'X-Auth-Token': '<ADD AUTH TOKEN HERE>'
    	}
	});
}

var loadTable = function(id, tableName, dataKey, columnData) {
	console.log("loading comp...");

	getFootballAPI('competitions/' + id + '/' + tableName)
	.then(function(response) {
		return response.json()
	})
	.then(function(data) {
		// console.log(JSON.stringify(data, null, 4));
		var tableID = '#' + tableName + 'Table';

    	$(tableID).DataTable( {
	        data: data[dataKey],
	        columns: columnData
	    } );

	    $(tableID).show();
	})
	.catch(function(error) {
		console.log(error);
	});
}

$(document).ready(function(){
	$('#leagueDiv').hide();

	$('#backBtn').on('click', function() {
		$('#leagueDiv').hide();
		$('#compDiv').show()
		$('#leagueTableTable').DataTable().destroy();
		$('#fixturesTable').DataTable().destroy();
	});

	getFootballAPI('competitions')
	.then(function(response) {
		return response.json();
	})
	.then(function(comps) {
    	var compTable = $('#compTable').DataTable( {
	        data: comps,
	        columns: [
	            { data: "caption", title: "Competition Name" },
	            { data: "league", title: "Code" },
	            { data: "year", title: "Year" }
	        ]
	    } );

	    $('#compTable tbody').on( 'click', 'tr', function () {
	    	$('#compDiv').hide();

	    	var data = compTable.row(this).data();

	    	$('#leagueTableTable').hide();
	    	loadTable(data.id, 'leagueTable', 'standing', [
	            { data: "position", title: "Position" },
	            { data: "teamName", title: "Team" },
	            { data: "points", title: "Points" },
	            { data: "wins", title: "Wins" },
	            { data: "draws", title: "Draws" },
	            { data: "losses", title: "Losses" }
	        ]);

	    	$('#fixturesTable').hide();
	    	loadTable(data.id, 'fixtures', 'fixtures', [
	            { data: "homeTeamName", title: "Home Team" },
	            { data: "awayTeamName", title: "Away Team" },
	            { data: "date", title: "Date" },
	            { data: "status", title: "Status" }
	        ]);

	    	$('#leagueDiv').show();
	    } );

	})
	.catch(function(error) {
		console.log(error);
	});

});

