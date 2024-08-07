// function AppLoading({ wrapperStyle = {} }) {
//     return <img src={loadingimg} style={wrapperStyle} />;
// }

function AppLoading() {
  return (
    <svg
      style={{
        margin: 'auto',
        display: 'block',
        shapeRendering: 'auto',
      }}
      width="211px"
      height="211px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle cx="80" cy="50" r="5" fill="#1d3f72">
        <animate
          attributeName="cx"
          values="80;50"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cy"
          values="50;80"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill"
          values="#1d3f72;#5699d2"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="50" cy="80" r="5" fill="#5699d2">
        <animate
          attributeName="cx"
          values="50;20"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cy"
          values="80;50.00000000000001"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill"
          values="#5699d2;#d8ebf9"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="20" cy="50.00000000000001" r="5" fill="#d8ebf9">
        <animate
          attributeName="cx"
          values="20;49.99999999999999"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cy"
          values="50.00000000000001;20"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill"
          values="#d8ebf9;#71c2cc"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="49.99999999999999" cy="20" r="5" fill="#71c2cc">
        <animate
          attributeName="cx"
          values="49.99999999999999;80"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cy"
          values="20;49.99999999999999"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill"
          values="#71c2cc;#1d3f72"
          keyTimes="0;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default AppLoading;
