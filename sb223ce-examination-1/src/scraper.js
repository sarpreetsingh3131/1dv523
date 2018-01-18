import axios from 'axios'
import cheerio from 'cheerio'
import request from 'request'

export class Scraper {
  /**
   * @param {String} startUrl
   * First it goes to given url and scrape all the required urls from that page. Further it scrapes all the calendars urls. Then find
   * free days and based on that find the movies and at last reserve the booking.
   */
  start (startUrl) {
    this.scrapeUrls(startUrl, ['calendar', 'cinema', 'restaurant'])
      .then(urls => this.scrapeUrls(urls[0])
        .then(calendarUrls => this.scrapeCalendars(calendarUrls)
          .then(calendars => this.getFreeDays(calendars)
            .then(freeDays => this.scrapeMovies(freeDays, urls[1])
              .then(movies => this.fetchMoviesDetails(movies.movies, movies.days, movies.url)
                .then(availableMovies => this.loginForReservation(urls[2])
                  .then(data => this.bookReservation(data, availableMovies, freeDays))
              )
            )
          )
        )
      )
    )
    .catch(err => console.log(err))
  }

  /**
   * @param {String} url
   * @param {Array} identifiers
   * It scrapes all the urls from given url. If identifiers are provided then it only those urls that matches with identifiers.
   */
  scrapeUrls (url, identifiers) {
    return new Promise((resolve, reject) => {
      let result = []
      this.fetchPage(url)
        .then(response => {
          cheerio.load(response.data)('a').map((index, element) => {
            if (identifiers) {
              identifiers.forEach((identifier, index) => {
                if (element.firstChild.data.toLowerCase().includes(identifier) && element.attribs.href) {
                  result.splice(index, 0, element.attribs.href)
                }
              })
            } else { result.push(url + element.attribs.href) }
          })
        })
        .then(() => resolve(result))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} urls
   * It scrapes the calendar details from given url such as the name of the day and if the person is free on that day.
   */
  scrapeCalendars (urls) {
    return new Promise((resolve, reject) => {
      let calendars = []
      urls.forEach((url, index) => {
        this.fetchPage(url)
          .then(response => {
            let calendar = []
            cheerio.load(response.data)('th').map((index, element) => {
              calendar.push({
                day: element.firstChild.data,
                isFree: cheerio.load(response.data)('td')[index].firstChild.data !== '--'
              })
            })
            calendars.push(calendar)
            if (calendars.length === urls.length) { resolve(calendars) }
          })
          .catch(err => reject(err))
      })
    })
  }

  /**
   * @param {Array} days
   * @param {String} url
   * First it scrapes the values of given days from given url. Further it scrapes all the movies (names, values) which are going to
   * be play on the given days.
   */
  scrapeMovies (days, url) {
    return new Promise((resolve, reject) => {
      let movies = []
      this.fetchPage(url)
        .then(response => {
          cheerio.load(response.data)('#day option').map((index, element) => {
            days.forEach(day => {
              if (day.day === element.firstChild.data) { day.value = element.attribs.value }
            })
          })
          cheerio.load(response.data)('#movie option').map((index, element) => {
            if (element.attribs.value) {
              movies.push({
                name: element.firstChild.data,
                value: element.attribs.value
              })
            }
          })
        })
        .then(() => resolve({
          movies: movies,
          days: days,
          url: url
        }))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {Array} movies
   * @param {Array} days
   * @param {String} url
   * First it creates the promises based on given days and movies. Then it sends the promises, once they fulfilled it collects those
   * movies whose booking is open on given days.
   */
  fetchMoviesDetails (movies, days, url) {
    let promises = []
    days.forEach(day => movies.forEach(movie => promises.push(axios.get(url + '/check?day=' + day.value + '&movie=' + movie.value))))
    return new Promise((resolve, reject) => {
      let result = []
      Promise.all(promises)
        .then(responses => {
          responses.forEach((response, index) => {
            response.data.forEach(film => {
              if (film.status === 1) {
                movies.forEach(movie => {
                  if (movie.value === film.movie) {
                    result.push({
                      name: movie.name,
                      time: film.time
                    })
                  }
                })
              }
            })
          })
        })
        .then(() => resolve(result))
        .catch(err => reject(err))
    })
  }

  /**
   * @param {String} url
   * First it fetch the page from given url and then post the form data on given url + <form action> value in order to login. Later it
   * again fetch the html content from given url + <form action> value. It also handles the cookies on each request.
   */
  loginForReservation (url) {
    return new Promise((resolve, reject) => {
      this.fetchPage(url)
      .then(res1 => this.postForm(url.substring(0, url.lastIndexOf('/')) + cheerio.load(res1.data)('form').attr('action'),
        res1.headers['set-cookie'][0].split(';')[0], {
          username: 'zeke',
          password: 'coys',
          submit: 'login'
        })
      .then(res2 => this.fetchPage((url += '/' + res2.headers['location']), {
        'Cookie': res2.headers['set-cookie'][0].split(';')[0]
      })
      .then(res3 => resolve({
        html: res3.data,
        cookie: res2.headers['set-cookie'][0].split(';')[0],
        url: url
      }))
      )).catch(err => reject(err))
    })
  }

  /**
   * @param {Object} data
   * @param {Array} availableMovies
   * @param {Array} freeDays
   * It finds the booking based on the given free-days and available-movies. Once the reservation is found, it prints its details and
   * later book the reservation and prints the response from the server.
   */
  bookReservation (data, availableMovies, freeDays) {
    let form = {}
    cheerio.load(data.html)('input').map((index, element) => {
      if (element.next.firstChild) {
        freeDays.forEach(day => {
          if (element.attribs.value.startsWith(day.day.substring(0, 3).toLowerCase())) {
            availableMovies.forEach(movie => {
              let startTime = parseInt(element.next.firstChild.data.split('-')[0])
              let endTime = parseInt(element.next.firstChild.data.split('-')[1].split(' ')[0])
              if (parseInt(movie.time.split(':')[0]) + 2 === startTime) {
                console.log('On', day.day, 'there is a free table between', startTime, 'and', endTime, ',after you have seen', movie.name, 'which starts at', movie.time, '.')
                form.group1 = element.attribs.value
              }
            })
          }
        })
      } else if (element.attribs.name.startsWith('csrf_token')) { form.csrf_token = element.attribs.value }
    })
    this.postForm(data.url, data.cookie, form)
    .then(res => console.log(cheerio.load(res.body)('.center').text().trim()))
    .catch(err => console.log('Cannot book the reservation', err))
  }

  /**
   * @param {String} url
   * @param {String} cookie
   * @param {Object} form
   * It post the form on given url. In addition it includes given cookie and form in the request.
   */
  postForm (url, cookie, form) {
    return new Promise((resolve, reject) => {
      request.post(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookie
        },
        form: form
      },
      (err, success) => err ? reject(new Error('Cookie error')) : resolve(success))
    })
  }

  /**
   * @param {String} url
   * @param {Object} headers
   * It fetches the page from given url; it includes the headers with the request if its present.
   */
  fetchPage (url, headers = {}) {
    return new Promise((resolve, reject) => {
      axios({
        url: url,
        headers: headers
      })
      .then(response => resolve(response))
      .catch(() => reject(new Error('Cannot fetch from ' + url)))
    })
  }

  /**
   * @param {Array} calendars
   * It finds the common free day/s among the persons.
   */
  getFreeDays (calendars) {
    return new Promise((resolve, reject) => {
      let days = []
      calendars[0].forEach((day, index) => {
        if (day.isFree && calendars[1][index].isFree && calendars[2][index].isFree) { days.push(day) }
      })
      days.length === 0 ? reject(new Error('No common free day found in calendars.')) : resolve(days)
    })
  }
}
