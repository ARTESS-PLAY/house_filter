import React from 'react'
import { formatPrice } from '../utils'

export default function Flat({
  id,
  images,
  is_studio,
  rooms,
  price,
  floor,
  area,
  topFloor,
  wished,
  onToggleWish
}) {
  return (
    <div data-id={id} className="flat">
      <a className="flat__link" href={`/flat?id=${id}`}>
        <div className="flat__top">
          <div className="flat__header">
            <div className="flat__title">
              {is_studio === 1 ? 'Студия' : `${rooms}-комнатная квартира`}
            </div>
            <div className="flat__area">{area} м2</div>
          </div>
          {/* <div className="flat__desc">Сдача 4 квартал 2022 г.</div> */}
        </div>
        <div className="flat__preview">
          <img src={images[0].src} />
          <div className="flat__button-wrap">
            <div className="button flat__button">
              <span>Подробнее</span>
            </div>
          </div>
        </div>
        <div className="flat__tags flat__tags_row">
          <div className="flat__tag">48 м2</div>
          <div className="flat__tag">
            {formatPrice(Math.round(price / area))} ₽/м2
          </div>
          <div className="flat__tag">
            {floor} этаж из {topFloor}
          </div>
        </div>
        <div className="flat__price-wrap">
          {/*<div className="flat__discount">— 10% до конца декабря</div>*/}
          <div className="flat__price">{formatPrice(price)} ₽</div>
        </div>
      </a>
      <div className="flat__footer">
        <div className="flat__tags flat__tags_grid">
          <div className="flat__tag">
            {formatPrice(Math.round(price / area))} ₽/м2
          </div>
          <div className="flat__tag">
            {floor} этаж из {topFloor}
          </div>
        </div>
        <button
          className={`flat__wish ${wished ? 'flat__wish_active' : ''}`}
          type="button"
          onClick={onToggleWish}
        ></button>
      </div>
    </div>
  )
}
