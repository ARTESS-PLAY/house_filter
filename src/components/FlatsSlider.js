import React, { useMemo, useRef, useState } from 'react'
import Flat from './Flat'
import { Swiper, SwiperSlide } from './Swiper'

export default function FlatsSlider({
  items,
  houseTopFloorMap,
  wishList,
  onToggleWish
}) {
  const prevRef = useRef()
  const nextRef = useRef()
  const paginationRef = useRef()
  const [currentSlide, setCurrentSlide] = useState(1)
  const swiperOptions = useMemo(
    () => ({
      spaceBetween: 30,
      // simulateTouch: false,
      loop: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      autoHeight: true,
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
      },
      breakpoints: {
        1100: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        }
      },
      on: {
        slideChange(swiper) {
          setCurrentSlide(swiper.realIndex + 1)
        }
      }
    }),
    []
  )

  return (
    <section className="slider slider_third slider_flats">
      <div className="slider__container container">
        <h2 className="slider__title">Похожие квартиры</h2>
        <Swiper className="slider__slider" options={swiperOptions}>
          {items.map((item, i) => (
            <SwiperSlide className="slider__slide swiper-slide" key={item.id}>
              <Flat
                {...item}
                topFloor={houseTopFloorMap[item.house]}
                wished={wishList.includes(item.id)}
                onToggleWish={() => onToggleWish(item.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="slider__footer">
        <div className="slider__footer-container container">
          <div className="pager">
            <div className="pager__current slider__count slider__count_current">
              {String(currentSlide).padStart(2, 0)}
            </div>
            <span className="pager__sep">/</span>
            <div className="pager__all slider__count slider__count_all">
              {String(items.length).padStart(2, 0)}
            </div>
          </div>
          <div className="progress slider__progress">
            <div
              className="progress__line slider__pagination"
              ref={paginationRef}
            ></div>
          </div>
          <div className="slider__controls">
            <button
              className="control control_prev slider__prev"
              ref={prevRef}
            ></button>
            <button
              className="control control_next slider__next"
              ref={nextRef}
            ></button>
          </div>
        </div>
      </div>
    </section>
  )
}
