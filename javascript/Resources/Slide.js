export default class SlideObj {
  constructor(slideId = 0) {
    this.id = slideId
    this.delay = 0
    this.showId = 0
    this.sorting = 1
    this.title = 'Untitled slide'
    this.content = '<p>Content here...</p>'
    this.backgroundImage = ''
  }
}
