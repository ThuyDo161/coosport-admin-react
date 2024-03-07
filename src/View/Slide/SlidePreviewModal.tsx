import { ColorPicker } from "@mantine/core";
import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  getSlides,
  slideInterface,
} from "../../redux/reducer/hero-slide.slice";
import HeroSlider from "../../components/HeroSlide/HeroSlide";

type slideModalType = {
  open: boolean;
  handleClose: () => void;
  data?: slideInterface;
};

const SlideModal = ({ data, open, handleClose }: slideModalType) => {
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      size={"80vw"}
      title={"Preview Hero Slide"}
    >
      {data && <HeroSlider data={data} />}
    </Modal>
  );
};

export default React.memo(SlideModal);
