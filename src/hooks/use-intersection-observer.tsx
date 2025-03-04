import { useEffect, useRef, useState } from "react";

export const UseInteractionObserver = (options?: IntersectionObserverInit) => {
    const [isIntersect, setIsIntersect] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersect(entry.isIntersecting);
        }, options);

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => observer.disconnect(); 
    }, [options]);

    return { isIntersect, targetRef };
};