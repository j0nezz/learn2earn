import React from 'react';
import styled from 'styled-components';

const MyIcon = styled.svg<{move?: boolean; color: string; size?: number}>`
  &:hover {
    transform: ${props => (props.move ? 'translateY(2px)' : null)};
  }
  fill: ${props => props.color};
  transition: 0.25s all;
  vertical-align: middle;
  width: ${props => (props.size ? `${props.size}px` : 'inherit')};
  height: ${props => (props.size ? `${props.size}px` : 'inherit')};
`;

type IconProps = {
  name: IconTypes;
  color: string;
  move?: boolean;
  size?: number;
  className?: string;
  onClick?: () => void;
};

export enum IconTypes {
  WRONG = 'WRONG',
  LOGO = 'LOGO',
  NONE = 'NONE',
  CORRECT = 'CORRECT',
  ERROR = 'ERROR',
  CHECK = 'CHECK',
  LOGOUT = 'LOGOUT',
  CLOCK = 'CLOCK',
  SETTINGS = 'SETTINGS',
  COIN = 'COIN'
}

export const Icon = ({name, ...props}: IconProps) => {
  switch (name) {
    case IconTypes.CLOCK:
      return (
        <MyIcon
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          {...props}
        >
          <path
            fill="currentColor"
            d="M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z"
          />
        </MyIcon>
      );
    case IconTypes.WRONG:
      return (
        <MyIcon
          width="100%"
          height="100%"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          {...props}
        >
          <path
            fill="currentColor"
            d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"
          />
        </MyIcon>
      );
    case IconTypes.CORRECT:
      return (
        <MyIcon
          {...props}
          focusable="false"
          data-prefix="fas"
          className="svg-inline--fa fa-chart-line fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
          />
        </MyIcon>
      );
    case IconTypes.CHECK:
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="check"
          className="svg-inline--fa fa-check fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
          />
        </MyIcon>
      );
    case IconTypes.ERROR:
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          focusable="false"
          data-prefix="fad"
          data-icon="times"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 352 512"
        >
          <g className="fa-group">
            <path
              className="fa-secondary"
              fill="currentColor"
              d="M9.21,356.07a31.46,31.46,0,0,0,0,44.48l22.24,22.24a31.46,31.46,0,0,0,44.48,0L176,322.72,109.28,256ZM342.79,111.45,320.55,89.21a31.46,31.46,0,0,0-44.48,0L176,189.28,242.72,256,342.79,155.93a31.46,31.46,0,0,0,0-44.48Z"
              opacity="0.4"
            />
            <path
              className="fa-primary"
              fill="currentColor"
              d="M342.79,356.07a31.46,31.46,0,0,1,0,44.48l-22.24,22.24a31.46,31.46,0,0,1-44.48,0L9.21,155.93a31.46,31.46,0,0,1,0-44.48L31.45,89.21a31.46,31.46,0,0,1,44.48,0Z"
            />
          </g>
        </MyIcon>
      );
    case IconTypes.LOGOUT:
      return (
        <MyIcon
          {...props}
          focusable="false"
          data-prefix="fas"
          className="svg-inline--fa fa-sign-out-alt fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"
          />
        </MyIcon>
      );
    case IconTypes.SETTINGS:
      return (
        <MyIcon
          {...props}
          focusable="false"
          data-prefix="fas"
          className="svg-inline--fa fa-sync-alt fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"
          />
        </MyIcon>
      );
    case IconTypes.COIN:
      return (
        <MyIcon
          {...props}
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M256 136C344.4 136 416 164.7 416 200C416 235.3 344.4 264 256 264C167.6 264 96 235.3 96 200C96 164.7 167.6 136 256 136zM256 352C114.6 352 0 287.5 0 208C0 128.5 114.6 64 256 64C397.4 64 512 128.5 512 208C512 287.5 397.4 352 256 352zM130.1 274.1C164.6 288.4 208.8 296 255.1 296C303.2 296 347.4 288.4 381 274.1C397.7 268.3 413.4 259.5 425.4 248.2C437.5 236.7 448 220.5 448 200C448 179.5 437.5 163.3 425.4 151.8C413.4 140.5 397.7 131.7 381 125C347.4 111.6 303.2 104 255.1 104C208.8 104 164.6 111.6 130.1 125C114.3 131.7 98.6 140.5 86.59 151.8C74.5 163.3 63.1 179.5 63.1 200C63.1 220.5 74.5 236.7 86.59 248.2C98.6 259.5 114.3 268.3 130.1 274.1V274.1zM0 290.1C13.21 305.8 29.72 319.5 48 330.1V394.6C17.79 373.6 0 347.9 0 320V290.1zM80 412.1V348.3C108.4 361.4 140.9 371.3 176 377.3V441.6C139.8 435.7 107.1 425.8 80 412.1zM208 381.6C223.7 383.2 239.7 384 256 384C272.3 384 288.3 383.2 304 381.6V445.8C288.5 447.2 272.4 448 256 448C239.6 448 223.5 447.2 208 445.8V381.6zM336 441.6V377.3C371.1 371.3 403.6 361.4 432 348.3V412.1C404.9 425.8 372.2 435.7 336 441.6zM464 330.1C482.3 319.5 498.8 305.8 512 290.1V320C512 347.9 494.2 373.6 464 394.6V330.1z"
          />
        </MyIcon>
      );

    default:
      return null;
  }
};
