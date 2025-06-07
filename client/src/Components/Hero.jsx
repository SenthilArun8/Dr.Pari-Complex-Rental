import { Link } from 'react-router-dom';
import BlurredBackground from './BlurredBackground';

const Hero = ({
  title = 'Pari Complex',
  subtitle = 'Personalized, developmentally-appropriate activities for every child.',
}) => {
  return (
    <section className="relative bg-[#162114] isolate px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
      <BlurredBackground />
      <div className="mx-auto max-w-2xl py-16 sm:py-24 md:py-32 lg:py-44">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#FFEDD2] mb-6 drop-shadow-lg">
            {title}
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-[#FFEDD2] mb-10 drop-shadow-sm">
            {subtitle}
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 w-full max-w-xs mx-auto sm:max-w-none">
            <Link to="/login" className="rounded-md bg-[#FFEDD2] px-6 py-3 text-base font-semibold text-[#294122] shadow-md hover:bg-[#FFBBA6] hover:text-[#294122] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEDD2] transition w-full sm:w-auto text-center">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;