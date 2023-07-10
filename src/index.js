import React from 'react'
import ReactDOM from 'react-dom'

import '../static/css/app.css'
import './main.scss'

import Catalog from './components/Catalog'
import Card from './components/Card'
import Wish from './components/Wish'

const catalogEl = document.getElementById('catalog')
const cardEl = document.getElementById('card')
const wishEl = document.getElementById('wish')

const rawItems = window.catalogData
  ? JSON.parse(window.catalogData.textContent).data
  : []
const houseTopFloorMap = rawItems.reduce((acc, cur) => {
  return {
    ...acc,
    [cur.house]:
      cur.house in acc && acc[cur.house] > cur.floor
        ? acc[cur.house]
        : cur.floor
  }
}, {})

const mapHouseDeadline = {}

rawItems.map((el) => {
  if (!(el.house in mapHouseDeadline)) {
    mapHouseDeadline[el.house] = el.deadline
  }
})

const availableItems = rawItems.filter((item) => item.status === 0)
const cardId = +new URLSearchParams(location.search).get('id')
const cardItem = rawItems.find(
  (item) => item.id === cardId && item.status === 0
)

if (catalogEl) {
  ReactDOM.render(
    <Catalog
      availableItems={availableItems}
      houseTopFloorMap={houseTopFloorMap}
      perPage={catalogEl.dataset.perPage}
      mapHouseDeadline={mapHouseDeadline}
    />,
    catalogEl
  )
}

if (cardEl && cardItem) {
  ReactDOM.render(
    <Card
      availableItems={availableItems}
      houseTopFloorMap={houseTopFloorMap}
      cardItem={cardItem}
    />,
    cardEl
  )
}

if (wishEl) {
  ReactDOM.render(
    <Wish
      availableItems={availableItems}
      houseTopFloorMap={houseTopFloorMap}
    />,
    wishEl
  )
}

;(() => {
  const wishCountEl = document.querySelector('.wish-count')
  const wishCount = JSON.parse(localStorage.getItem('wishList') || '[]').length
  wishCountEl.dataset.count = wishCount
  window.addEventListener('wish-list-changed', ({ detail }) => {
    wishCountEl.dataset.count = detail
  })
})()
