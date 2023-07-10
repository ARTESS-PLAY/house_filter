import React, { useEffect, useMemo, useRef, useState } from 'react'
import { formatPrice } from '../utils'
import FlatsSlider from './FlatsSlider'
import { Swiper, SwiperSlide } from './Swiper'

export default function Card({ availableItems, houseTopFloorMap, cardItem }) {
  const [wishList, setWishList] = useState(
    JSON.parse(localStorage.getItem('wishList') || '[]')
  )
  const [section, setSection] = useState('section-1')
  const prevRef = useRef()
  const nextRef = useRef()
  const paginationRef = useRef()
  const similarItems = useMemo(
    () =>
      availableItems.filter(
        (item) =>
          (cardItem.is_studio === 1 && item.is_studio === 1) ||
          cardItem.rooms === item.rooms
      ),
    [cardItem, availableItems]
  )
  const pageTitle = useMemo(
    () =>
      `${
        cardItem.is_studio === 1
          ? 'Студия'
          : `${cardItem.rooms}-комнатная квартира`
      }, ${cardItem.area} м2`,
    [cardItem]
  )
  const swiperOptions = useMemo(
    () => ({
      spaceBetween: 30,
      centeredSlides: true,
      // simulateTouch: false,
      loop: false,
      autoHeight: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      slidesPerView: 1,
      speed: 700,
      navigation: {
        get prevEl() {
          return prevRef.current
        },
        get nextEl() {
          return nextRef.current
        }
      },
      pagination: {
        get el() {
          return paginationRef.current
        },
        type: 'progressbar'
      }
    }),
    []
  )

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.card__previews-section'))
    els.forEach((el) => {
      const gallery = lightGallery(el, {
        download: false,
        zoom: true,
        actualSize: false,
        selector: '.card__preview-image'
      })
    })
  }, [section, setSection])

  useEffect(() => {
    localStorage.setItem('wishList', JSON.stringify(wishList))
    window.dispatchEvent(
      new CustomEvent('wish-list-changed', { detail: wishList.length })
    )
  }, [wishList])

  useEffect(() => {
    document.title = pageTitle

    window.dispatchEvent(
      new CustomEvent('page-title-change', { detail: pageTitle })
    )
  }, [pageTitle])

  function onToggleWish(id) {
    const set = new Set(wishList)
    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }
    setWishList([...set])
  }

  function onSectionChange(e) {
    setSection(e.target.value)
  }

  function onClickRequest(e) {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('open-request-modal'))
  }

  return (
    <>
      <section className="card">
        <div className="card__container container">
          <div className="card__holder">
            <div className="card__previews">
              {section === 'section-1' && (
                <div
                  className="card__previews-section card__previews-section_active"
                  data-content="section-1"
                >
                  <Swiper options={swiperOptions}>
                    {[...new Set(cardItem.images.map((m) => m.src))].map(
                      (src, i) => (
                        <SwiperSlide className="card__preview-slide" key={i}>
                          <a href={src} className="card__preview-image">
                            <img src={src} alt="" />
                          </a>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                  <div className="progress card__previews-progress">
                    <div
                      className="progress__line card__previews-pagination"
                      ref={paginationRef}
                    ></div>
                  </div>
                  <div className="card__previews-controls">
                    <button
                      className="control control_prev card__previews-prev"
                      ref={prevRef}
                    ></button>
                    <button
                      className="control control_next card__previews-next"
                      ref={nextRef}
                    ></button>
                  </div>
                </div>
              )}
              {section === 'section-2' && (
                <div
                  className="card__previews-section"
                  data-content="section-2"
                >
                  <a
                    href={cardItem.section_info.src}
                    className="card__preview-image"
                  >
                    <img src={cardItem.section_info.src} alt="" />
                  </a>
                </div>
              )}
            </div>
            <div className="card__controls">
              <label className="check card__control">
                <input
                  className="check__input"
                  type="radio"
                  name="changePlan"
                  value="section-1"
                  onChange={onSectionChange}
                  checked={section === 'section-1'}
                />
                <span className="check__box">Планировка</span>
              </label>
              {cardItem.section_info && (
                <label className="check card__control">
                  <input
                    className="check__input"
                    type="radio"
                    name="changePlan"
                    value="section-2"
                    onChange={onSectionChange}
                    checked={section === 'section-2'}
                  />
                  <span className="check__box">План этажа</span>
                </label>
              )}
            </div>
            <div className="card__details">
              <div className="card__info">
                <div className="card__title h2">
                  {cardItem.is_studio === 1
                    ? 'Студия'
                    : `${cardItem.rooms}-комнатная квартира`}
                  , {cardItem.area} м2
                </div>
                <div className="card__tags">
                  <div className="card__tag">
                    {formatPrice(Math.round(cardItem.price / cardItem.area))}{' '}
                    ₽/м2
                  </div>
                  <div className="card__tag">
                    <span className="card__tag-floor">{cardItem.floor}</span>{' '}
                    этаж из {houseTopFloorMap[cardItem.house]}
                  </div>
                </div>
                {/*<div className="card__legend">Сдача 4 квартал 2022 г.</div>*/}
                <div className="card__price-wrap">
                  <div className="card__price">
                    {formatPrice(cardItem.price)} ₽
                  </div>
                  {/*<div className="card__discount">— 10% до конца декабря</div>*/}
                </div>
                <div className="card__buttons">
                  <a
                    className="button button_full open-modal"
                    href="#request"
                    onClick={onClickRequest}
                  >
                    Оставить заявку
                  </a>
                  <button
                    className={`card__wish ${
                      wishList.includes(cardItem.id) ? 'card__wish_active' : ''
                    }`}
                    type="button"
                    onClick={() => onToggleWish(cardItem.id)}
                  ></button>
                </div>
              </div>
              <div className="card__social card__social_desktop">
                <div className="card__social-title">Поделиться:</div>
                <div className="card__social-links">
                  <a
                    className="card__social-link card__social-link_ok"
                    href={`https://connect.ok.ru/offer?url=${window.location.href}&title=${pageTitle}&imageUrl=${cardItem.images[0].src}`}
                    target="_blank"
                  ></a>
                  <a
                    className="card__social-link card__social-link_telegram"
                    href={`https://t.me/share/url?url=${window.location.href}&text=${pageTitle}`}
                    target="_blank"
                  ></a>
                  <a
                    className="card__social-link card__social-link_vk"
                    href={`https://vk.com/share.php?url=${window.location.href}`}
                    target="_blank"
                  ></a>
                  <a
                    className="card__social-link card__social-link_viber"
                    href="#"
                    target="_blank"
                  ></a>
                  <a
                    className="card__social-link card__social-link_whatsapp"
                    href="#"
                    target="_blank"
                  ></a>
                </div>
              </div>
            </div>
          </div>
          <div className="card__features">
            {Object.keys(cardItem.tags).map((key, index) => {
              return (
                <div
                  className="card__feature"
                  data-title={cardItem.tags[key]}
                  key={index}
                ></div>
              )
            })}
          </div>
          <div className="card__social card__social_mobile">
            <div className="card__social-title">Поделиться:</div>
            <div className="card__social-links">
              <a
                className="card__social-link card__social-link_ok"
                href={`https://connect.ok.ru/offer?url=${window.location.href}&title=${pageTitle}&imageUrl=${cardItem.images[0].src}`}
                target="_blank"
              ></a>
              <a
                className="card__social-link card__social-link_telegram"
                href={`https://t.me/share/url?url=${window.location.href}&text=${pageTitle}`}
                target="_blank"
              ></a>
              <a
                className="card__social-link card__social-link_vk"
                href={`https://vk.com/share.php?url=${window.location.href}`}
                target="_blank"
              ></a>
              <a
                className="card__social-link card__social-link_viber"
                href="#"
                target="_blank"
              ></a>
              <a
                className="card__social-link card__social-link_whatsapp"
                href="#"
                target="_blank"
              ></a>
            </div>
          </div>
          <div className="card__desc">
            <h2>Описание</h2>
            <p>{cardItem.description}</p>
          </div>
        </div>
      </section>

      <FlatsSlider
        items={similarItems}
        houseTopFloorMap={houseTopFloorMap}
        wishList={wishList}
        onToggleWish={onToggleWish}
      />
    </>
  )
}
