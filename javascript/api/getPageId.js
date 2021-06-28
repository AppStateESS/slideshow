export const getPageId = () => {
  let showId = window.sessionStorage.getItem('id')
  if (showId == null) {
    showId = window.location.href.replace(/.*\/(\d+)$/g, '$1')
    if (showId == null) {
      const params = new URLSearchParams(window.location.search)
      showId = params.get('id')
    }

    if (showId > 0) {
      window.sessionStorage.setItem('id', showId)
    } else {
      return 0
    }
  } else {
    return showId
  }
}
