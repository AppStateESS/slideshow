import React from 'react'
import {SortableElement} from 'react-sortable-hoc'
import SlideRow from './SlideRow.jsx'

const SortableItem = SortableElement(({slideKey, value, deleteSlide, load}) => {
  return (<SlideRow slideKey={slideKey} value={value} deleteSlide={deleteSlide} load={load}/>)
})

export default SortableItem
