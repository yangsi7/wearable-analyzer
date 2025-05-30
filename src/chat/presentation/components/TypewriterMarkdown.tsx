import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const TypewriterMarkdown = ({
    text,
    speed = 50,
    delay = 0,
    onComplete = () => { }
}: {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        // Reset when text changes
        setDisplayedText('');
        setCurrentIndex(0);
        setStarted(false);
    }, [text]);

    useEffect(() => {
        // Initial delay before starting
        if (!started) {
            const startTimer = setTimeout(() => {
                setStarted(true);
            }, delay);

            return () => clearTimeout(startTimer);
        }

        // If we've finished
        if (started && currentIndex >= text.length) {
            onComplete();
            return;
        }

        // Typewriter effect
        if (started) {
            const timer = setTimeout(() => {
                setDisplayedText(text.substring(0, currentIndex + 1));
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, speed);

            return () => clearTimeout(timer);
        }
    }, [currentIndex, delay, onComplete, speed, started, text]);

    return (
        <div className="typewriter-markdown">
            <ReactMarkdown>{displayedText}</ReactMarkdown>
        </div>
    );
};

export default TypewriterMarkdown;