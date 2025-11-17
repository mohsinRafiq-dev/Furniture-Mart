import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Award,
  Users,
  Zap,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const About: React.FC = () => {
  const stats = [
    { label: "Years in Business", value: "15+", icon: Award },
    { label: "Happy Customers", value: "5000+", icon: Heart },
    { label: "Product Varieties", value: "500+", icon: Zap },
    { label: "Team Members", value: "50+", icon: Users },
  ];

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "We source only the finest materials and craftsmanship from trusted manufacturers.",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description:
        "Quick and reliable shipping directly to your doorstep within 5-7 business days.",
    },
    {
      icon: Heart,
      title: "Customer Care",
      description:
        "Our dedicated support team is available 24/7 to assist with any queries.",
    },
    {
      icon: Users,
      title: "Expert Staff",
      description:
        "Professional interior design consultants to help you choose the perfect furniture.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About Furniture Mart
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your one-stop destination for premium quality furniture and home
              decor solutions since 2008.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2008, Furniture Mart began as a small family business
                with a vision to make premium furniture accessible to everyone.
                What started as a modest showroom has grown into a trusted name
                across the region.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We believe that your home is a reflection of your personality.
                That's why we curate every piece in our collection with care,
                ensuring quality, comfort, and style in every product.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, with multiple showrooms and an online presence, we
                continue our mission to transform houses into beautiful homes
                while maintaining the personal touch that defines us.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-96 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"
            >
              <span className="text-8xl">🛋️</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600">
              Excellence in every aspect of our service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow hover:bg-amber-50"
                >
                  <Icon className="w-12 h-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-amber-50">
              We'd love to hear from you. Contact us today!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <MapPin className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Address</h3>
              <p className="text-amber-50 text-sm">
                123 Furniture Street
                <br />
                City, State 12345
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <Phone className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Phone</h3>
              <p className="text-amber-50 text-sm">+1 (555) 123-4567</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <Mail className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-amber-50 text-sm">info@furnituremart.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Clock className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Hours</h3>
              <p className="text-amber-50 text-sm">
                Mon-Sat: 9AM-6PM
                <br />
                Sunday: 10AM-4PM
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to Transform Your Home?
          </h2>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/categories"
            className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
          >
            Explore Our Collection
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
