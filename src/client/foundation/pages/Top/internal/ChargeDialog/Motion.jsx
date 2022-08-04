import { motion } from "framer-motion";
import React from "react";

const Motion = ({ children }) => {
  return (
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
      {children}
    </motion.div>
  );
};

Motion.displayName = "Motion";
export default Motion;
