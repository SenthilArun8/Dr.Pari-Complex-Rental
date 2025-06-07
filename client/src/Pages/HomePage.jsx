import Hero from '../Components/Hero'
import Footer from '../Components/Footer'
import LoginPage from './LoginPage'

const HomePage = () => {
    return(
    <>
         <Hero
            title='Dr. Pari Complex Rentals'
            subtitle='Manage your dashboard after logging in below'
         />
         <LoginPage/>
         <Footer/>
     </>
    )
}

export default HomePage