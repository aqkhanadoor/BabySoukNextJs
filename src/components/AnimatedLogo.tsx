import B from '../assets/logo/B.webp';
import a from '../assets/logo/a.webp';
import b2 from '../assets/logo/b (2).webp';
import y from '../assets/logo/y.webp';
import S from '../assets/logo/S.webp';
import o from '../assets/logo/o.webp';
import u from '../assets/logo/u.webp';
import k from '../assets/logo/k.webp';

const AnimatedLogo = () => {
    return (
        <div className="flex items-center space-x-1">
            <div className="transition-transform duration-300 hover:scale-125">
                <img src={B} alt="B" className="mt-2 h-10 w-10 animate-bounce-slow" />
            </div>
            <img src={a} alt="a" className="h-7 w-7 animate-fade-in transition-transform duration-300 hover:scale-125" />
            <img src={b2} alt="b" className="h-7 w-7 animate-slide-in-left transition-transform duration-300 hover:scale-125" />
            <img src={y} alt="y" className="h-7 w-7 animate-slide-in-right transition-transform duration-300 hover:scale-125" />
            <div className="transition-transform duration-300 hover:scale-125">
                <img src={S} alt="S" className="h-10 w-10 animate-spin-slower" />
            </div>
            <img src={o} alt="o" className="h-7 w-7 animate-pulse-soft transition-transform duration-300 hover:scale-125" />
            <img src={u} alt="u" className="h-7 w-7 animate-fade-in transition-transform duration-300 hover:scale-125" />
            <div className="transition-transform duration-300 hover:scale-125">
                <img src={k} alt="k" className="h-7 w-7 animate-bounce-slow" />
            </div>
        </div>
    );
};

export default AnimatedLogo;
