import IntroSection from "../../Components/IntroSection/IntroSection";
import FeatureBooks from "../../Components/FeaturedBooks/FeaturedBooks";
import { BooksProvider } from "../../Context/BooksProvider";

function Home(){

    return(
        <>
            <IntroSection />
            <FeatureBooks />
        </>
    );
}
export default Home;