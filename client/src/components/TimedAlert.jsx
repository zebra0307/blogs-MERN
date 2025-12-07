import { Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';

export default function TimedAlert({ color, children, duration = 3000, onClose }) {
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                setVisible(false);
                if (onClose) onClose();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className='relative mt-5'>
            <Alert color={color} className='overflow-hidden'>
                {children}
                <div
                    className='absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all duration-100'
                    style={{ width: `${progress}%` }}
                />
            </Alert>
        </div>
    );
}
