import {useEffect, useState} from "react";

const useVisiblityChange = () => {
    const [isVisible, setIsVisible] = useState(true);

    const onVisibilityChange = (e) => {
        //console.log(e)
        setIsVisible(v => !v);
    };

    useEffect(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => document.removeEventListener("visibilitychange", onVisibilityChange);

    }, []);

    return isVisible;
}

export default useVisiblityChange;
