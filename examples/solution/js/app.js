let BASE_URL = 'http://api.football-data.org/v1/'
let ACTIONS = Object.freeze({
  'SHOW_COMPETITIONS': 1,
  'SHOW_TEAMS': 2,
  'SHOW_FIXTURES': 3
})

$(document).ready(function () {
  initCard('competitionsCard', 'Competitions', ACTIONS.SHOW_COMPETITIONS)
  initCard('fixturesCard', 'Fixtures', ACTIONS.SHOW_FIXTURES)
})

function initCard (id, title, action) {
  let card = document.getElementById(id)
  card.addEventListener('click', () => openModal(title, action))
}

function openModal (title, action) {
  $('#modal').modal('toggle')
  $('#modalTitle').html(title)
  handleAction(action)
}

function handleAction (action) {
  switch (action) {
    case ACTIONS.SHOW_COMPETITIONS:
      showCompetitions()
      break
    case ACTIONS.SHOW_TEAMS:
      showTeams()
      break
    case ACTIONS.SHOW_FIXTURES:
      showFixtures()
      break
    default:
      alert('Action not supported')
  }
}

function showCompetitions () {
  showData('competitions/?season=2017', 'data', createCardsList(createCompetitionInfoCard))
}

function showTeams (id, name) {
  $('#modalTitle').html(`${name} teams`)
  showData(`competitions/${id}/teams`, 'teams', createCardsList(createTeamInfoCard))
}

function showLeagueTable (id, name) {
  $('#modalTitle').html(`${name} table`)
  let columnData = [
    { data: 'position', title: 'Pos' },
    { data: 'teamName', title: 'Team' },
    { data: 'points', title: 'Points' },
    { data: 'wins', title: 'Wins' },
    { data: 'draws', title: 'Draws' },
    { data: 'losses', title: 'Losses' }
  ]
  showData(`/competitions/${id}/leagueTable`, 'standing', createTableWithData(columnData))
}

function showFixtures () {
  let columnData = [
    { data: 'homeTeamName', title: 'Home Team' },
    { data: 'awayTeamName', title: 'Away Team' },
    { data: 'date', title: 'Date' },
    { data: 'status', title: 'Status' }
  ]
  showData('fixtures/', 'fixtures', createTableWithData(columnData))
}

function showData (endpoint, property, createFn) {
  clearModal()
  showLoadingIndicator()

  request(endpoint)
  .then(function (response) {
    let items = response[property] !== undefined ? response[property] : response.data[property]
    createFn(items)

    hideLoadingIndicator()
  }).catch((error) => handleError(error))
}

function createCardsList (createFn) {
  return function (items) {
    let list = document.getElementById('items')

    for (let item of items) {
      let itemElement = document.createElement('div')
      itemElement.innerHTML = createFn(item)

      list.appendChild(itemElement)
    }
  }
}

function createTableWithData (columnData) {
  return function (data) {
    let table = document.createElement('table')
    table.setAttribute('id', 'table')
    document.getElementById('modalBody').appendChild(table)

    $('#table').DataTable({
      data: data,
      columns: columnData
    })
  }
}

function createCompetitionInfoCard (competition) {
  return `
    <div class="col-sm-3">
      <div class="card" style="width: 18rem; margin-bottom: 10px;">
        <div class="card-body">
          <h5 class="card-title">${competition.caption}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${competition.league}</h6>
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
  let indicator = document.getElementById('modalLoadingIndicator')
  indicator.style.display = 'none'
}

function showLoadingIndicator () {
  let indicator = document.getElementById('modalLoadingIndicator')
  indicator.style.display = 'block'
}

function request (endpoint) {
  return axios({
    url: BASE_URL + endpoint,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'X-Auth-Token': 'd3de6ad724294f7782c57f2e9fda5aab'
    }
  })
}

function handleError (error) {
  $('#modal').modal('hide')
  console.log(error)
  alert('Oops something went wrong. Please try again later :(')
}
