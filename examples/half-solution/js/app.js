// let BASE_URL = 'https://api.football-data.org/v1/'
let BASE_URL = '/data/'

$(document).ready(function () {
    request('competitions')
      .then((response) => {
        var competitions = response.data

        for (let competition of competitions) {
          let itemElement = $('<div>').html(createCompetitionInfoCard(competition))
          $(`#competitions`).append(itemElement)
        }

      })
      .catch((error) => handleError(error))
})

function createCompetitionInfoCard (competition) {
  return `
    <div class="col-sm-3">
      <div class="card" style="width: 18rem; margin-bottom: 10px;">
        <div class="card-body">
          <h5 class="card-title">${competition.caption}</h5>
        </div>
      </div>
    </div>`
}

function request (endpoint) {
  return axios({
    url: BASE_URL + endpoint,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'X-Auth-Token': '<INSERT_TOKEN_HERE>'
    }
  })
}

function handleError (error) {
  console.log(error)
  alert('Oops something went wrong. Please try again later :(')
}
