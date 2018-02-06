import React from 'react'
import {SortableContainer} from 'react-sortable-hoc'
import SortableItem from './SortableItem.jsx'


const SortableList = SortableContainer(({
  listing,
  deleteSlide,
  load
}) => {
  let slides = listing.map(function (value, key) {
    return (<SortableItem
      index={key}
      key={key}
      slideKey={key}
      value={value}
      load={load}
      deleteSlide={deleteSlide}/>)
  })

  return (
    <ul>
      {slides}
    </ul>
  )
})


export default SortableList
