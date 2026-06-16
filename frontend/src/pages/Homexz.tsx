// // Landing.jsx

// import {
//   Leaf,
//   Sparkles,
//   Briefcase,
//   Users,
//   BarChart3,
//   ArrowRight,
//   Bot,
//   Bell,
//   FileSearch,
// } from "lucide-react";

// export default function Landing() {
//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
//         <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
//           <a href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
//               <Leaf className="w-4 h-4 text-primary-foreground" />
//             </div>
//             <span className="font-semibold tracking-tight">
//               Hireloop
//             </span>
//           </a>

//           <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
//             <a href="#features">Features</a>
//             <a href="#roles">For teams</a>
//             <a href="#how">How it works</a>
//           </nav>

//           <div className="flex gap-2">
//             <a href="/login">Sign In</a>
//             <a
//               href="/signup"
//               className="bg-primary text-primary-foreground px-4 py-2 rounded-xl"
//             >
//               Get Started
//             </a>
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="max-w-6xl mx-auto px-5 py-24 text-center">
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent">
//           <Sparkles size={14} />
//           AI-powered resume analysis
//         </div>

//         <h1 className="text-6xl font-semibold mt-6">
//           Hiring, with a little more{" "}
//           <span className="text-primary">calm</span>.
//         </h1>
// <a href="/demo" className="inline-block bg-[#5c4738] text-white px-6 py-3 rounded-full font-medium transition-colors hover:bg-[#4a392d]">
//   View demo
// </a>
//         <p className="mt-6 text-muted-foreground">
//           An end-to-end applicant tracking system with AI resume analysis,
//           real-time interview updates, and dashboards for every role.
//         </p>
//       </section>

//       {/* Features */}
//       <section id="features" className="max-w-6xl mx-auto py-20">
//         <div className="grid md:grid-cols-3 gap-4">
//           {[
//             {
//               icon: Bot,
//               title: "AI Resume Analysis",
//               desc: "Skills extracted automatically.",
//             },
//             {
//               icon: Bell,
//               title: "Real-time Updates",
//               desc: "Interview scheduling notifications.",
//             },
//             {
//               icon: FileSearch,
//               title: "Smart Search",
//               desc: "Find candidates quickly.",
//             },
//             {
//               icon: Briefcase,
//               title: "Job Posting",
//               desc: "Manage job openings.",
//             },
//             {
//               icon: Users,
//               title: "Applicant Tracking",
//               desc: "Track every candidate.",
//             },
//             {
//               icon: BarChart3,
//               title: "Admin Analytics",
//               desc: "Visual hiring insights.",
//             },
//           ].map((item, index) => {
//             const Icon = item.icon;

//             return (
//               <div
//                 key={index}
//                 className="border rounded-2xl p-6"
//               >
//                 <Icon className="mb-4" />
//                 <h3 className="font-semibold">{item.title}</h3>
//                 <p>{item.desc}</p>
//               </div>
//             );
//           })}
//         </div>
//       </section>
      
//     </div>
//   );
// }