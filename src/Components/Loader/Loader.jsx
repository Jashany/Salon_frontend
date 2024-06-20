import { TailSpin } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="loader" style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1000"
        }}>
        <TailSpin  visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass="" 
        />
        </div>
    );
};

export default Loader;
