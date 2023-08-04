
const useVisiblityChange = () => {
    const [isVisible, setIsVisible] = useState(true);

    const onVisibilityChange = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => document.removeEventListener("visibilitychange", onVisibilityChange);

    }, []);

    return isVisible;
}
