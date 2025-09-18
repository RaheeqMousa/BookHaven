import Img from '../../assets/Images/404.webp'
function NotFound(){
    return(
        <div className='row justify-center'>
            <img src={Img} width={300} height={400} alt='Page not found' title='Page not found' />
        </div>
    );
}
export default NotFound;