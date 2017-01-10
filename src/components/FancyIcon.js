import React, { PropTypes } from "react";

const FancyIcon = ({ icon, color }) => {
  let path = <noscript />;

  switch (icon) {
    case "checked":
      path = (
        <g>
          <path fill="#222" d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0
          21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
        </g>
      );
      break;
    case "close":
      path = (
        <polygon fill={color} points="20.707,4.707 19.293,3.293 12,10.586 4.707,3.293 3.293,
        4.707 10.586,12 3.293,19.293 4.707,20.707 12,13.414 19.293,20.707 20.707,19.293 13.414,12" />
      );
      break;
    case "left-arrow":
      path = (
        <path fill={color} d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
      );
      break;
    case "list":
      path = (
        <g>
          <polygon fill={color} points="21.5,14 23,15.5 16,22.5 11.5,18 13,16.5 16,19.5 "/>
          <path fill={color} d="M10,19H5V5h2v1c0,0.6,0.4,1,1,1s1-0.4,1-1V5h2v1c0,0.6,0.4,1,1,1s1-0.4,1-1V5h2v1c0,0.6,0.4,1,1,1s1-0.4,1-1V5
	h2l0,7h2V5c0-1.1-0.9-2-2-2h-2V2c0-0.6-0.4-1-1-1s-1,0.4-1,1v1h-2V2c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H9V2c0-0.6-0.4-1-1-1S7,1.4,7,2v1
	H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h5V19z"/>
          <polyline fill={color} points="17,13 10,13 10,15 17,15 "/>
          <polyline fill={color} points="10,9 10,11 17,11 17,9 "/>
          <polyline fill={color} points="9,13 7,13 7,15 9,15 "/>
          <polyline fill={color} points="7,9 7,11 9,11 9,9 "/>
        </g>
      );
      break;
    case "note":
      path = (
        <g>
          <path fill={color} d="M16.4,2H5C3.9,2,3,2.9,3,4v15c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.6L16.4,2z M19,19H5V4h10v4h4L19,19z"/>
          <polyline fill={color} points="15,10 7,10 7,12 15,12 15,10 "/>
          <polyline fill={color} points="17,14 7,14 7,16 17,16 17,14 "/>
        </g>
      );
      break;
    case "pencil":
      path = (
        <path fill={color} d="M20.821,3.18c-0.761-0.76-1.771-1.178-2.847-1.178c-1.074,0-2.086,0.418-2.846,1.179L3.72,14.59
		c-0.128,0.128-0.22,0.289-0.263,0.464l-1.427,5.705c-0.084,0.34,0.016,0.702,0.264,0.948c0.247,0.249,0.608,0.349,0.949,0.264
		l5.705-1.427c0.175-0.043,0.336-0.135,0.464-0.263L20.82,8.872c0.76-0.76,1.178-1.772,1.179-2.846c0-1.076-0.418-2.087-1.179-2.847
		L20.821,3.18z M9.077,16.338l7.471-7.471l0.727,0.725l-7.955,7.955L9.077,16.338z M7.663,14.923l-1.209-0.241l7.956-7.955
		l0.725,0.726L7.663,14.923z M5.166,16.464l1.976,0.395l0.396,1.977l-3.163,0.791L5.166,16.464z M15.823,5.313l0.72-0.718
		c0.766-0.764,2.1-0.764,2.864,0l-0.002-0.001c0.765,0.765,0.765,2.099,0,2.864l-0.718,0.72L15.823,5.313z"/>
      );
      break;
    case "pin":
      path = (
        <path fill={color} d="M22,12l-9.9-9.9l-1.4,1.4l1.4,1.4v0l-5,4.9v0L5.7,8.5L4.3,9.9l4.2,4.2l-5.7,5.7l1.4,1.4l5.7-5.7l4.2,4.2
		l1.4-1.4L14.2,17l0,0l5-4.9l0,0l1.4,1.4L22,12z"/>
      );
      break;
    case "trash":
      path = (
        <g>
          <path fill={color} d="M5,20c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8H5V20z M7,10h10l0.001,10H7V10z"/>
          <polygon fill={color} points="15,5 15,3 9,3 9,5 3,5 3,7 21,7 21,5" />
          <rect x="9" y="12" fill={color} width="2" height="6"/>
          <rect x="13" y="12" fill={color} width="2" height="6"/>
        </g>
      );
      break;
    case "unchecked":
      path = (
        <path fill="#222" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
      );
      break;
    case "vertical-ellipsis":
      path = (
        <path fill={color} d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,
        16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,
        6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
      );
      break;
    default:
      break;
  }

  return (
    <svg style={{ display: "block" }} x={0} y={0} width={24} height={24} viewBox="0 0 24 24" >
      <g><rect fill="none" width={24} height={24} /></g>
      {path}
    </svg>
  )
};

FancyIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
};

FancyIcon.defaultProps = {
  color: "#ffffff",
};

export default FancyIcon;
