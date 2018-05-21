export default class SlideObj {
  constructor(slideId = 0) {
    this.id = slideId
    this.delay = 0
    this.showId = 0
    this.slideNum = 1
    this.title = 'Untitled slide'
    this.content = '<p>Content here...</p>'
    this.backgroundImage = ''
  }
}
