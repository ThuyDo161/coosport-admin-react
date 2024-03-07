import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import "./hero-slide.css";
import { slideInterface } from "../../redux/reducer/hero-slide.slice";

type HeroSliderPropTypes = {
  data: slideInterface;
};

const HeroSlider = (props: HeroSliderPropTypes) => {
  const data = props.data;

  return (
    <div className="hero-slider">
      <HeroSliderItem item={data} active />

      <div className="hero-slider__control">
        <div className="hero-slider__control__item">
          <i className="bx bx-chevron-left"></i>
        </div>
        <div className="hero-slider__control__item">
          <div className="index">1/1</div>
        </div>
        <div className="hero-slider__control__item">
          <i className="bx bx-chevron-right"></i>
        </div>
      </div>
    </div>
  );
};

type HeroSliderItemPropTypes = {
  active: boolean;
  item: slideInterface;
};
const HeroSliderItem = (props: HeroSliderItemPropTypes) => (
  <div className={`hero-slider__item ${props.active ? "active" : ""}`}>
    <div className="hero-slider__item__info">
      <div
        className={`hero-slider__item__info__title color-${props.item.color}`}
      >
        <span>{props.item.title}</span>
      </div>
      <div className="hero-slider__item__info__description">
        <span>{props.item.description}</span>
      </div>
      <div className="hero-slider__item__info__btn">
        <Button
          backgroundColor={props.item.color}
          icon="bx bx-cart"
          animate={true}
          type="button"
        >
          xem chi tiết
        </Button>
      </div>
    </div>
    <div className="hero-slider__item__image">
      <div className={`shape bg-${props.item.color}`}></div>
      <img src={props.item.img} alt="" />
    </div>
  </div>
);

export default HeroSlider;
