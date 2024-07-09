import React from "react";

type ErrorProps = {
    type: string;
    message: string;
};

const ErrorMessage:React.FunctionComponent<ErrorProps> = (props) => {
    const {type, message} = props;

    return(
        <>
            <div id={type+"Error"}>
                {message}
            </div>
        </>
    );
}

export default ErrorMessage;