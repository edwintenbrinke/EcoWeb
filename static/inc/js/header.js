// Get URL Parameters - Relative protocol, domain, port
const url = window.location.href
const arr = url.split('/')
const result = arr[0] + '//' + arr[2]
const APPIQUERYURL = result
const ACCOUNTAPPIQUERYURL = 'https://ecoauth.strangeloopgames.com/'

function getURLParameter (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null
}
