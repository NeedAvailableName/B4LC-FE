import loadingimg from '../assets/svgs/Loading.svg';

function AppLoading({ wrapperStyle = {} }) {
    return <img src={loadingimg} style={wrapperStyle} />;
}

export default AppLoading;
