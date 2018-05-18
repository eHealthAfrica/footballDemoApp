let BASE_URL = 'http://api.football-data.org/v1/'

$(document).ready(function () {
  loadCompetitions()
})

function loadCompetitions () {
  getData('competitions/?season=2017', 'data').then(function (items) {
    createCardsList(createCompetitionInfoCard, items, 'competitions')
  })
}

function showTeams (id, name) {
  $('#modal').modal('show')
  $('#modalTitle').html(`${name} teams`)

  getData(`competitions/${id}/teams`, 'teams').then(function (items) {
    createCardsList(createTeamInfoCard, items, 'items')
  })
}

function showLeagueTable (id, name) {
  $('#modal').modal('show')
  $('#modalTitle').html(`${name} table`)
  let columnData = [
    { data: 'position', title: 'Pos' },
    { data: 'teamName', title: 'Team' },
    { data: 'points', title: 'Points' },
    { data: 'wins', title: 'Wins' },
    { data: 'draws', title: 'Draws' },
    { data: 'losses', title: 'Losses' }
  ]

  getData(`/competitions/${id}/leagueTable`, 'standing').then(function (items) {
    createTableWithData(columnData, items)
  })
}

function showFixtures () {
  $('#modal').modal('show')
  $('#modalTitle').html(`Fixtures`)
  let columnData = [
    { data: 'homeTeamName', title: 'Home Team' },
    { data: 'awayTeamName', title: 'Away Team' },
    { data: 'date', title: 'Date' },
    { data: 'status', title: 'Status' }
  ]

  getData('fixtures/', 'fixtues').then(function (items) {
    createTableWithData(columnData, items)
  })
}

function getData (endpoint, property) {
  clearModal()
  showLoadingIndicator()

  return request(endpoint).then((response) => {
    let items = response[property] !== undefined ? response[property] : response.data[property]
    hideLoadingIndicator()
    return items
  }).catch((error) => handleError(error))
}

function createCardsList (createFn, items, parentId) {
  let list = $(`#${parentId}`)

  for (let item of items) {
    let itemElement = $('<div>').html(createFn(item))
    list.append(itemElement)
  }
}

function createTableWithData (columnData, data) {
  let table = $('<table>').attr('id', 'table')
  $('#modalBody').append(table)

  $('#table').DataTable({
    data: data,
    columns: columnData
  })
}

function createCompetitionInfoCard (competition) {
  return `
    <div class="col-sm-3">
      <div class="card" style="width: 18rem; margin-bottom: 10px;">
        <div class="card-body">
          <h5 class="card-title">${competition.caption}</h5>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-secondary" onClick="return showLeagueTable(${competition.id}, '${competition.caption}')">View table</button>
            <button type="button" class="btn btn-secondary" onClick="showTeams(${competition.id}, '${competition.caption}')">View Teams</button>
          </div>
        </div>
      </div>
    </div>`
}

function createTeamInfoCard (team) {
  return `
    <div class="col-sm-3">
      <div class="card" style="width: 18rem; margin-bottom: 10px;">
        <div class="card-body">
          <img src="${team.crestUrl}" style="height: 200px; width: 200px" alt="${team.name}">
          <h5 class="card-title">${team.name}</h5>
        </div>
      </div>
    </div>`
}

function clearModal () {
  $('#items').empty()
  $('#table').empty()
  if ($.fn.DataTable.isDataTable('#table')) {
    $('#table').DataTable().destroy(true)
  }
}

function hideLoadingIndicator () {
  $('#modalLoadingIndicator').hide()
  $('#progressBar').hide()
}

function showLoadingIndicator () {
  $('#modalLoadingIndicator').show()
}

function request (endpoint) {
  return axios({
    url: BASE_URL + endpoint,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'X-Auth-Token': '<INSERT-TOKEN-HERE>'
    }
  })
}

function handleError (error) {
  $('#modal').modal('hide')
  $('#progressBar').hide()
  console.log(error)
  alert('Oops something went wrong. Please try again later :(')
}
