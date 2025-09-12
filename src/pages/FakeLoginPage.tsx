import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const FakeLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'lostPassword'>('login');
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: 'ERROR',
            description: `The password you entered for the username ${username} is incorrect. Lost your password?`,
            variant: 'destructive',
        });

        setLoading(false);
        setPassword('');
    };

    const handleLostPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: 'Check your email',
            description: `If an account with the email ${username} exists, you will receive an email with a password reset link.`,
            variant: 'default',
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f0f0f1] flex flex-col justify-center items-center font-sans text-[#444]">
            <div className="mb-8">
                <svg height="80" viewBox="0 0 100 100" width="80">
                    <path d="M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M79.6,49.4c-0.2,3.9-0.5,7.2-1,9.9
                    c-2.1,11.4-8.3,20.5-18.3,25.3c-1.4,0.7-3,1.2-4.5,1.7c-4.7,1.4-9.5,2.1-14.5,2.1c-5.4,0-10.6-0.8-15.4-2.5
                    c-1.9-0.7-3.8-1.5-5.5-2.4c-9.1-4.8-15.2-12.8-17.5-22.9c-0.4-1.8-0.7-3.7-0.9-5.7c-0.5-4.5-0.5-9,0-13.5
                    c0.3-2.5,0.7-5,1.2-7.4c2.8-12.1,9.9-21.6,20.5-26.8c2.2-1.1,4.5-2,6.9-2.8c4.5-1.5,9.2-2.2,14-2.2c5.1,0,10,0.8,14.6,2.4
                    c2.1,0.7,4.2,1.6,6.1,2.6c10.1,5.1,16.8,13.6,19.3,24.4c0.5,2,0.8,4,1.1,6.1C80,43.1,80,46.2,79.6,49.4z M26.3,43.8
                    c0,0.2,0,0.4,0,0.6c0.2,3.3,0.5,6.5,1,9.6c1.6,9.3,6.8,16.8,15.2,21.2c1.3,0.7,2.6,1.2,4,1.6c4.3,1.3,8.7,1.9,13.2,1.9
                    c4.8,0,9.5-0.7,13.9-2.2c1.7-0.6,3.4-1.2,5-2c7.9-4.1,13.2-10.8,15.2-19.2c0.4-1.7,0.7-3.4,0.9-5.2c0.4-3.8,0.4-7.6,0-11.4
                    c-0.2-2.1-0.6-4.2-1-6.2c-2.2-9.9-8.2-17.8-17.5-22.3c-1.9-0.9-3.9-1.7-5.9-2.3c-4-1.2-8.2-1.8-12.5-1.8
                    c-4.6,0-9.1,0.7-13.3,2.1c-1.9,0.6-3.8,1.3-5.6,2.1c-8.6,4.3-14.5,11.5-16.8,20.6c-0.5,1.8-0.8,3.7-1.1,5.6
                    C26.4,38.3,26.3,41,26.3,43.8z M61.9,42.3c0-4.4-3.6-8-8-8s-8,3.6-8,8c0,4.4,3.6,8,8,8S61.9,46.7,61.9,42.3z M38.1,42.3
                    c0-4.4,3.6-8,8-8s8,3.6,8,8c0,4.4-3.6,8-8,8S38.1,46.7,38.1,42.3z"/>
                </svg>
            </div>

            {view === 'login' ? (
                <div id="login" className="w-[320px] p-8 bg-white shadow-md rounded">
                    <form name="loginform" id="loginform" onSubmit={handleLogin} className="space-y-5">
                        <p className="space-y-1">
                            <label htmlFor="user_login" className="text-sm">Username or Email Address</label>
                            <input
                                type="text"
                                name="log"
                                id="user_login"
                                className="w-full p-2 border border-[#ddd] rounded shadow-sm focus:shadow-md focus:border-[#007cba] outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </p>
                        <p className="space-y-1">
                            <label htmlFor="user_pass" className="text-sm">Password</label>
                            <input
                                type="password"
                                name="pwd"
                                id="user_pass"
                                className="w-full p-2 border border-[#ddd] rounded shadow-sm focus:shadow-md focus:border-[#007cba] outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </p>
                        <p className="flex items-center">
                            <input type="checkbox" name="rememberme" id="rememberme" className="mr-2 h-4 w-4 border-[#ddd] rounded text-[#007cba] focus:ring-[#007cba]" />
                            <label htmlFor="rememberme" className="text-sm select-none">Remember Me</label>
                        </p>
                        <p className="mt-6">
                            <button
                                type="submit"
                                name="wp-submit"
                                id="wp-submit"
                                className="w-full flex justify-center items-center bg-[#007cba] text-white text-sm font-semibold py-2 px-4 rounded border border-[#007cba] hover:bg-[#0071a1] hover:border-[#005a87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007cba] disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Log In
                            </button>
                        </p>
                    </form>
                </div>
            ) : (
                <div id="lostpassword" className="w-[320px] p-8 bg-white shadow-md rounded">
                    <p className="text-sm mb-4">Please enter your username or email address. You will receive a link to create a new password via email.</p>
                    <form name="lostpasswordform" id="lostpasswordform" onSubmit={handleLostPassword} className="space-y-5">
                        <p className="space-y-1">
                            <label htmlFor="user_login_lost" className="text-sm">Username or Email Address</label>
                            <input
                                type="text"
                                name="user_login"
                                id="user_login_lost"
                                className="w-full p-2 border border-[#ddd] rounded shadow-sm focus:shadow-md focus:border-[#007cba] outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </p>
                        <p className="mt-6">
                            <button
                                type="submit"
                                name="wp-submit"
                                id="wp-submit-lost"
                                className="w-full flex justify-center items-center bg-[#007cba] text-white text-sm font-semibold py-2 px-4 rounded border border-[#007cba] hover:bg-[#0071a1] hover:border-[#005a87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007cba] disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Get New Password
                            </button>
                        </p>
                    </form>
                </div>
            )}

            <p id="nav" className="mt-6 text-sm">
                {view === 'login' ? (
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('lostPassword'); }} className="text-[#007cba] hover:text-[#005a87]">Lost your password?</a>
                ) : (
                    <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); }} className="text-[#007cba] hover:text-[#005a87]">Log in</a>
                )}
            </p>
            <p id="backtoblog" className="mt-4 text-sm">
                <a href="/" className="text-[#007cba] hover:text-[#005a87]">← Back to Baby Souk</a>
            </p>
        </div>
    );
};

export default FakeLoginPage;
