import { motion, AnimatePresence } from "framer-motion";
import { usePosts } from "../query/usePosts";
import CreatePostForm from "../components/Posts/CreatePostForm";
import PostCard from "../components/Posts/PostCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/FollowModel";

export default function Home({ token }) {
  const { data, isLoading } = usePosts();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto flex">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Navbar />
        </motion.div>

        <main className="flex-1 border-x border-gray-200 min-h-screen max-w-2xl">
          <motion.div 
            className="sticky top-0 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-200 p-4"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-xl font-bold text-gray-900">Home</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CreatePostForm token={token} />
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                className="flex items-center justify-center py-8"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key="loading"
              >
                <motion.div 
                  className="rounded-full h-8 w-8 border-b-2 border-blue-500"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key="posts"
              >
                {data?.data.map((post, index) => (
                  <motion.div
                    key={post.posts_id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="transform-gpu" 
                  >
                    <PostCard post={post} token={token} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Sidebar />
        </motion.div>
      </div>
    </motion.div>
  );
}