import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Routes from './Routes';


const Desktop = () => {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  return isDesktop ? <Routes device={'desktop-wide'} /> : null
}
const Tablet = () => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
  return isTablet ? <Routes device={'desktop-normal'} /> : null
}
const Mobile = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  return isMobile ? <Routes device={'mobile'} /> : null
}

const Device = () => (
  <div>
    <Desktop />
    <Tablet />
    <Mobile />
  </div>
)

export default Device;