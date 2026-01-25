import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScorecardData {
  goal: string;
  obstacle: string;
  stake: string;
  partner: string;
  frequency: string;
  name: string;
  email: string;
}

export default function WaitlistForm() {
  const [step, setStep] = useState<'scorecard' | 'result' | 'signup'>('scorecard');
  const [score, setScore] = useState(0);
  const [formData, setFormData] = useState<Partial<ScorecardData>>({});
  const [signupCount] = useState(157); // Would be dynamic in production

  const calculateScore = (data: Partial<ScorecardData>) => {
    let points = 5;
    if (data.goal && data.goal !== 'other') points += 2;
    if (data.stake === 'high') points += 2;
    if (data.partner === 'friend') points += 1;
    if (data.frequency === 'daily') points += 1;
    return points;
  };

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedScore = calculateScore(formData);
    setScore(calculatedScore);
    setStep('result');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to API
    alert(`Welcome to the waiting list! You're #${signupCount + 1}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'scorecard' && (
          <motion.div
            key="scorecard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Are You Ready for Accountability?</h2>
            <p className="text-white/80 mb-6">Take this 2-minute assessment to discover your accountability style</p>

            <form onSubmit={handleScorecardSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">1. What goal have you tried and failed to achieve?</label>
                <select
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white"
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                >
                  <option value="">Select one...</option>
                  <option value="fitness">Fitness / Exercise</option>
                  <option value="career">Career / Learning</option>
                  <option value="finance">Finance / Savings</option>
                  <option value="habits">Habits / Routines</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">2. What's your biggest obstacle?</label>
                <select
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white"
                  onChange={(e) => setFormData({...formData, obstacle: e.target.value})}
                >
                  <option value="">Select one...</option>
                  <option value="motivation">Motivation</option>
                  <option value="consistency">Consistency</option>
                  <option value="accountability">Accountability</option>
                  <option value="plan">Clear plan</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">3. How much would you stake on a goal?</label>
                <select
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white"
                  onChange={(e) => setFormData({...formData, stake: e.target.value})}
                >
                  <option value="">Select one...</option>
                  <option value="low">CHF 10-20</option>
                  <option value="medium">CHF 20-50</option>
                  <option value="high">CHF 50-100+</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">4. Who would be your accountability partner?</label>
                <select
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white"
                  onChange={(e) => setFormData({...formData, partner: e.target.value})}
                >
                  <option value="">Select one...</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="family">Family member</option>
                  <option value="none">Don't have one yet</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">5. How often do you check progress on goals?</label>
                <select
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white"
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                >
                  <option value="">Select one...</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="rarely">Rarely</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-purple-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Get My Accountability Score
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-7xl font-bold text-white mb-2"
              >
                {score}/10
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {score >= 8 ? 'High Achiever' : score >= 6 ? 'Motivated Starter' : 'Needs Support'}
              </h3>
              <p className="text-white/80">
                {score >= 8
                  ? "You're ready to tackle ambitious goals with financial accountability!"
                  : score >= 6
                  ? "You have ambition but need consistency. Perfect for accountability betting!"
                  : "You'd benefit greatly from structured accountability and partner support."}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div className="text-white/90">
                  <strong className="text-white">{formData.goal === 'fitness' ? 'Fitness' : 'Personal'} goals</strong> are your top priority
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div className="text-white/90">
                  You'd benefit from <strong className="text-white">weekly check-ins</strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div className="text-white/90">
                  Recommended stake: <strong className="text-white">CHF {formData.stake === 'high' ? '50-100' : '20-50'}</strong> per bet
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('signup')}
              className="w-full bg-white text-purple-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Join the Waiting List
            </motion.button>
          </motion.div>
        )}

        {step === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">You're Almost In!</h2>
              <p className="text-white/80">Join {signupCount} goal-getters on the waiting list</p>
              <div className="mt-4 inline-block bg-orange-500/20 border border-orange-500/50 rounded-full px-4 py-2">
                <span className="text-orange-200 font-semibold">🔥 Limited to first 500 users</span>
              </div>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder:text-white/50"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder:text-white/50"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-purple-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Secure My Spot
              </motion.button>

              <p className="text-white/60 text-sm text-center">
                Get early access perks + Swiss launch updates
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
