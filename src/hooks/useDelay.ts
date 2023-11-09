import { useEffect, useState } from 'react';

const useDelay = (trigger: boolean, ms: number) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        setShow(false);

        if (trigger) {
            timer = setTimeout(() => setShow(true), ms);
        }

        return () => clearTimeout(timer);
    }, [trigger, ms]);

    return show;
};

export default useDelay;