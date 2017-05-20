const ping = require('ping')
const parseString = require('xml2js').parseString
const axios = require('axios')

const NYAA_PANTSU_URI = 'https://nyaa.pantsu.cat/feed?c=_&s=0&max=99999&userID=0&q='
const NYAA_SI_URI = 'https://nyaa.si/?page=rss&c=1_0&f=0&q='

const searchPantsu = (term, n = null) => {
  return new Promise((resolve, reject) => {
    ping.sys.probe('nyaa.pantsu.cat', (isAlive) => {
      if (!isAlive) reject(new Error('Nyaa.pantsu.cat is down.'))

      axios.get(`${NYAA_PANTSU_URI}${term.split(' ').join('+')}`).then(({data}) => {
        parseString(data, (err, result) => {
          if (err) reject(err)

          const results = result.rss.channel[0].item

          results === undefined
            ? reject(new Error('[Nyaa]: No result found...'))
            : n
            ? resolve(results.slice(0, n))
            : resolve(results)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

const searchSi = (term, n = null) => {
  return new Promise((resolve, reject) => {
    ping.sys.probe('nyaa.si', (isAlive) => {
      if (!isAlive) reject(new Error('Nyaa.si is down.'))

      axios.get(`${NYAA_SI_URI}${term.split(' ').join('+')}`).then(({data}) => {
        parseString(data, (err, result) => {
          if (err) reject(err)

          const results = result.rss.channel[0].item

          results === undefined
            ? reject(new Error('[Nyaa]: No result found...'))
            : n
            ? resolve(results.slice(0, n))
            : resolve(results)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

module.exports = {
  searchPantsu,
  searchSi
}
