import { useEffect, useState } from "react";

const CountUp = ({ end, duration = 1200, prefix = "", suffix = "", decimals = 0 }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const num = typeof end === "number" ? end : parseFloat(String(end).replace(/[^0-9.-]/g, "")) || 0;
        if (num === 0) { setCurrent(0); return; }
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(eased * num);
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [end, duration]);

    return `${prefix}${current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${suffix}`;
};

export default CountUp;
