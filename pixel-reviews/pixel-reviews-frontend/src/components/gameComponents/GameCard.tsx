import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { dateFormatter } from "@/utils/dateFormatter";

// Interface for component props for type safety and reusability
interface GameCardProps {
  imageURL: string;
  title: string;
  released: string;
  description?: string;
  className?: string;
}

export const GameCard = ({
  imageURL,
  title,
  released,
  description,
  className,
}: GameCardProps) => {
  const [currentIndex] = useState(0);
  const [direction] = useState(0);

  // Animation variants for the carousel
  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  // Animation variants for staggering content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      variants={contentVariants}
      // --- NEW: Added hover animation ---
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 10px 30px -5px hsl(var(--foreground) / 0.1)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      // --- END NEW ---
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative group h-64">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={imageURL}
            alt={title}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <motion.div variants={contentVariants} className="p-5 space-y-4">
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-start"
        >
          <h3 className="text-xl font-orbitron font-bold">{title}</h3>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-m text-muted-foreground"
        >
          <span>Released</span> &bull; <span>{dateFormatter(released)}</span>
        </motion.div>

        {description && (
          <motion.p
            variants={itemVariants}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};
