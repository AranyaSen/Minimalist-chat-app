import React from "react";
import Nav from "../../components/Nav/Nav";
import { ArrowRight, MessageSquare, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../images/hero.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-primary text-white overflow-x-hidden">
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left z-10">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in">
            Connect. Chat. <br />
            <span className="text-secondary">Collaborate.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0">
            Experience the next generation of minimalist messaging. Fast, secure, and designed for
            clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/signup"
              className="px-8 py-4 bg-secondary text-primary font-bold rounded-full hover:bg-orange-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link
              to="/signin"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="flex-1 relative animate-float">
          <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={heroImage}
              alt="Chat Hero"
              className="rounded-2xl w-full h-auto shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/5 backdrop-blur-sm py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
            <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="text-secondary" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">
              Real-time messaging with ultra-low latency. Stay connected without the lag.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
            <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="text-secondary" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Secure & Private</h3>
            <p className="text-gray-400 text-sm">
              Privacy by design. Your conversations are yours alone, protected with modern security.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
            <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="text-secondary" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Minimalist UI</h3>
            <p className="text-gray-400 text-sm">
              A clutter-free interface that lets you focus on what matters: the conversation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to join the conversation?</h2>
          <p className="text-gray-400 mb-10">
            Join thousands of users who simplified their daily communication.
          </p>
          <Link
            to="/signup"
            className="inline-block px-12 py-5 bg-secondary text-primary font-black text-xl rounded-full hover:shadow-[0_0_50px_rgba(239,169,133,0.3)] transition-all duration-500"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Custom Styles Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `,
        }}
      />
    </div>
  );
};

export default LandingPage;
