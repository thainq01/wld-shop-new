import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

const SUPPORT_URL = "https://t.me/worldeesupport";

export function DraggableSupport() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const dragStartTime = useRef<number>(0);
  const hasMovedRef = useRef(false);

  // Calculate initial position and drag constraints
  useEffect(() => {
    const updateConstraints = () => {
      const buttonSize = 56; // 14 * 4 = 56px (w-14 h-14)
      const padding = 20; // 1rem padding from edges

      const constraints = {
        left: -window.innerWidth / 2 + buttonSize / 2 + padding,
        right: window.innerWidth / 2 - buttonSize / 2 - padding,
        top: -window.innerHeight / 2 + buttonSize / 2 + padding,
        bottom: window.innerHeight / 2 - buttonSize / 2 - padding - 90, // Extra space for bottom nav
      };

      setDragConstraints(constraints);

      // Set default position: bottom-right corner
      setPosition({
        x: constraints.right - 20, // 20px from right edge
        y: constraints.bottom - 20, // 20px from bottom (above nav)
      });
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
    dragStartTime.current = Date.now();
    hasMovedRef.current = false;
  };

  // Handle drag end
  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number; y: number }; point: { x: number; y: number } }
  ) => {
    setIsDragging(false);
    const dragDuration = Date.now() - dragStartTime.current;
    const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);

    // Consider it a drag if it moved more than 5px or took longer than 200ms
    hasMovedRef.current = dragDistance > 5 || dragDuration > 200;

    // Update position
    const newPosition = {
      x: info.point.x - window.innerWidth / 2,
      y: info.point.y - window.innerHeight / 2,
    };
    setPosition(newPosition);
  };

  // Handle click (only if not dragged)
  const handleClick = () => {
    // Small delay to ensure drag end has processed
    setTimeout(() => {
      if (!hasMovedRef.current) {
        window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
      }
    }, 10);
  };

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      animate={{ x: position.x, y: position.y }}
      initial={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        fixed w-14 h-14 rounded-full shadow-lg cursor-pointer z-40
        flex items-center justify-center
        bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
        text-white
        transition-colors duration-200 bg-opacity-80
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        select-none
      `}
      style={{
        left: "50%",
        top: "50%",
        touchAction: "none", // Prevent scrolling while dragging on mobile
      }}
      aria-label="Contact Support"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(SUPPORT_URL, "_blank", "noopener,noreferrer");
        }
      }}
    >
      <MessageCircle className="w-6 h-6" />

      {/* Subtle pulse animation when not dragging */}
      {!isDragging && (
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-500 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}
