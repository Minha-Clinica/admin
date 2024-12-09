import { useEffect, useRef, useState } from "react"
import { Box } from "../../atoms"

export const ModalButton = ({ children }) => {
    const [showActions, setShowActions] = useState(false)
    const containerRef = useRef(null);

    useEffect(() => {
        if (!showActions) {

            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setShowActions(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);

    return (
        <div ref={containerRef}>
            <Box sx={{
                boxShadow: 'rgba(35, 32, 51, 0.27) 0px 6px 24px', width: 35, padding: '10px', borderRadius: 35, gap: 2,
                cursor: 'pointer'
            }}
                onClick={() => setShowActions(!showActions)}>
                <Box sx={styles.menuIcon} />

                {showActions && children}
            </Box>
        </div>
    )
}

const styles = {
    menuIcon: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: 16,
        height: 15,
        aspectRatio: '1/1',
        backgroundImage: `url('/icons/points.png')`,
        transition: '.3s',
    },
}
