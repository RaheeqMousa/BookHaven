import IntroSection from "../../Components/IntroSection/IntroSection";
import FeatureBooks from "../../Components/FeaturedBooks/FeaturedBooks";
import { BooksProvider } from "../../Context/BooksProvider";

function Home(){

    return(
        <BooksProvider>
            <IntroSection />
            <FeatureBooks />
        </BooksProvider>
    );
}
export default Home;