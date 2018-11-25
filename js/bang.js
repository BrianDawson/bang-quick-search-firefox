browser.webRequest.onBeforeRequest.addListener(
  async details => {
    const requestedUrl = decodeURI(details.url).replace(' ', '+')
    const websiteFound = await hasValidBang(requestedUrl)

    if (websiteFound) {
      const search = await getSearchRequestFromRequestedUrl(requestedUrl)

      details.url = `https://www.duckduckgo.com/?q=${search}`

      return { redirectUrl: details.url }
    }
  },

  // Applies to following url patterns
  {urls: [
    '*://*.google.com/*',
    '*://*.bing.com/*'
  ]},

  // In request blocking mode
  ['blocking']
)

const getSearchRequestFromRequestedUrl = async requestedUrl => {
  let searchRequest = requestedUrl.substring(requestedUrl.indexOf('q=') + 2)
  searchRequest = searchRequest.substring(0, searchRequest.indexOf('&'))
  searchRequest = searchRequest.toLowerCase()

  return searchRequest
}

const hasValidBang = async requestedUrl => (/!([a-zA-Z]){1,}\+/.test(requestedUrl) || /!([a-zA-Z]){1,}&/.test(requestedUrl))
