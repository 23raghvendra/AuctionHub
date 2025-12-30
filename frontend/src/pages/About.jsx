import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const values = [
    {
      id: 1,
      title: "Integrity",
      description:
        "We prioritize honesty and transparency in all our dealings, ensuring a fair and ethical auction experience for everyone.",
    },
    {
      id: 2,
      title: "Innovation",
      description:
        "We continually enhance our platform with cutting-edge technology and features to provide users with a seamless and efficient auction process.",
    },
    {
      id: 3,
      title: "Community",
      description:
        "We foster a vibrant community of buyers and sellers who share a passion for finding and offering exceptional items.",
    },
    {
      id: 4,
      title: "Customer Focus",
      description:
        "We are committed to providing exceptional customer support and resources to help users navigate the auction process with ease.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-50 lg:pl-[280px] py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-zinc-900">About PrimeBid</h1>
          <p className="text-xl text-zinc-600 leading-relaxed">
            Welcome to PrimeBid, the ultimate destination for online auctions
            and bidding excitement. Founded in 2024, we are dedicated to
            providing a dynamic and user-friendly platform for buyers and
            sellers to connect, explore, and transact in a secure and seamless
            environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Our Mission</h3>
            <p className="text-zinc-600 leading-relaxed">
              At PrimeBid, our mission is to revolutionize the way people buy and
              sell items online. We strive to create an engaging and trustworthy
              marketplace that empowers individuals and businesses to discover
              unique products, make informed decisions, and enjoy the thrill of
              competitive bidding.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl text-white">
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-zinc-300 leading-relaxed">
              Founded by CodeWithZeeshu, PrimeBid was born out of a passion for
              connecting people with unique and valuable items. With years of
              experience in the auction industry, our team is committed to
              creating a platform that offers an unparalleled auction experience
              for users worldwide.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-8">Our Core Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((element) => (
              <div key={element.id} className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-primary/30 transition-colors">
                <h4 className="text-lg font-bold text-zinc-900 mb-2">{element.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{element.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 text-center">
          <h3 className="text-2xl font-bold text-zinc-900 mb-4">Join Our Community</h3>
          <p className="text-zinc-600 mb-6 max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or simply explore, PrimeBid
            invites you to join our growing community of auction enthusiasts.
            Discover new opportunities, uncover hidden gems, and experience the
            thrill of winning your next great find.
          </p>
          <p className="text-primary font-bold text-lg">
            Thank you for choosing PrimeBid. We look forward to being a part of
            your auction journey!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
