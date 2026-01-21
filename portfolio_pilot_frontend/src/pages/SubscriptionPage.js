import React from 'react';
import Sidebar from '../components/Sidebar';
import TickerTape from '../components/TickerTape';
import { Check, Zap, Crown, Building } from 'lucide-react';

const SubscriptionPage = () => {
    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            icon: <Zap className="text-gray-400" />,
            features: ['Real-time Quotes', 'Basic Portfolio Tracking', 'Standard Ticker Tape'],
            button: 'Current Plan',
            current: true
        },
        {
            name: 'Pro',
            price: '$19.99/mo',
            icon: <Crown className="text-yellow-500" />,
            features: ['Advanced Analytics', 'Unlimited Portfolios', 'Ad-free Experience', 'AI Insights'],
            button: 'Upgrade to Pro',
            current: false,
            highlight: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            icon: <Building className="text-blue-500" />,
            features: ['API Access', 'Multi-user Support', 'Dedicated Account Manager', 'Custom Reports'],
            button: 'Contact Sales',
            current: false
        }
    ];

    return (
        <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col relative min-w-0 overflow-x-hidden">
                <TickerTape />
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 w-full text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
                    <p className="text-gray-400 mb-12">Select the perfect plan for your investment needs.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, idx) => (
                            <div key={idx} className={`bg-dashboard-card rounded-3xl p-8 border ${plan.highlight ? 'border-blue-500 shadow-2xl shadow-blue-500/10' : 'border-gray-800'} relative transition-transform hover:scale-105`}>
                                {plan.highlight && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">Most Popular</span>}
                                <div className="mb-6 flex justify-center">{plan.icon}</div>
                                <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                                <div className="text-3xl font-black text-white mb-6">{plan.price}</div>
                                <ul className="text-left space-y-4 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-3 text-sm text-gray-400">
                                            <Check size={16} className="text-blue-500" /> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-3 rounded-xl font-bold transition ${plan.current ? 'bg-gray-800 text-gray-400 cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20'}`}>
                                    {plan.button}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubscriptionPage;