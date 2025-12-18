"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Star,
  Users,
  ArrowRight,
  Heart,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useEffect } from "react";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/feed");
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center md:pt-30 md:pb-32 lg:pt-38 lg:pb-40">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="z-10 max-w-5xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
              The Next Gen of Game Reviews
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-orbitron"
          >
            Discover & Share <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 animate-text-gradient bg-300%">
              Your Gaming Journey
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-xl text-muted-foreground font-exo leading-relaxed"
          >
            Join the ultimate community for gamers. Track your collection, write
            detailed reviews, and connect with friends who share your passion
            for pixels.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="h-auto px-8 py-4 text-lg shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
              >
                Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button
                variant="secondary"
                size="lg"
                className="h-auto px-8 py-4 text-lg  border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:border-white/20"
              >
                Explore Reviews
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">
              Why Pixel Reviews?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage your gaming life in one beautiful
              place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Star className="w-8 h-8 text-yellow-400" />}
              title="Rate & Review"
              description="Share your detailed thoughts on games you've played. Rate graphics, gameplay, and story."
              delay={0.1}
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-red-400" />}
              title="Curate Wishlists"
              description="Keep track of games you want to play. Get notified when they go on sale or release."
              delay={0.2}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-400" />}
              title="Connect with Friends"
              description="Follow other gamers, see what they're playing, and discuss your favorite titles."
              delay={0.3}
            />
            <FeatureCard
              icon={<Gamepad2 className="w-8 h-8 text-purple-400" />}
              title="Game Discovery"
              description="Find your next favorite game with our advanced search and recommendation engine."
              delay={0.4}
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-green-400" />}
              title="Engage in Discussions"
              description="Comment on reviews, start debates, and share your gaming tips and tricks."
              delay={0.5}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-orange-400" />}
              title="Fast & Modern"
              description="Experience a lightning-fast interface built with the latest web technologies."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-orbitron mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of gamers who are already sharing their experiences
              on Pixel Reviews.
            </p>
            <Link href="/signup">
              <Button
                size="sm"
                className="h-auto px-10 py-5 text-xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 mx-auto"
              >
                Create Free Account
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Free forever for gamers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Beta & Contact Section */}
      <section className="py-12 px-4 border-t relative border-white/5">
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Beta Access
          </div>
          <h3 className="text-2xl font-bold font-orbitron mb-4">
            Help Us Shape the Future
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Pixel Reviews is currently in public beta. You might encounter some
            bugs or rough edges as we polish the experience. Your feedback is
            incredibly valuable to us.
          </p>
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <p>Found a bug or have a suggestion?</p>
            <a
              href="mailto:yisusocanto1984@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-2"
            >
              yisusocanto1984@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:bg-card hover:border-blue-500/30 transition-all duration-300 group"
    >
      <div className="mb-4 p-3 rounded-xl bg-background/50 w-fit group-hover:scale-110 transition-transform duration-300 border border-border/50">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 font-orbitron group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default LandingPage;
