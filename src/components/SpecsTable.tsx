import { motion } from "framer-motion";

export interface Spec {
  name: string;
  value: string;
}

interface SpecsTableProps {
  specs: Spec[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const SpecsTable = ({ specs }: SpecsTableProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
    >
      {specs.map((spec, index) => (
        <motion.div
          key={index}
          variants={rowVariants}
          className={`flex items-center px-4 py-3 ${
            index !== specs.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          <div className="w-1/3">
            <p className="font-semibold text-gray-900">{spec.name}</p>
          </div>
          <div className="w-2/3">
            <p className="text-gray-700">{spec.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SpecsTable;
