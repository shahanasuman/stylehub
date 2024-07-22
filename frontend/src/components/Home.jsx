import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { mycontext } from './Context';
import Slider from './Slider';
import "./Home.css";
import Navbar from './Navbar';
import Footer from './Footer';

function Home() {
    const { products } = useContext(mycontext);
    const [searchquery, setSearchqury] = useState("");
    const [filterdproducts, setFilteredproducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredproducts(products);
    }, [products]);

    const handilesearch = (e) => {
        const query = e.target.value;
        setSearchqury(query);
        const filtered = products.filter(pdt => {
            const { category, name, price } = pdt;
            return (
                category.toLowerCase().includes(query.toLowerCase()) ||
                name.toLowerCase().includes(query.toLowerCase()) ||
                price.toString().includes(query)
            );
        });
        setFilteredproducts(filtered);
    };

    function handilemen() {
        navigate('/men');
    }
    function handilewomen() {
        navigate('/women');
    }
    function handilekid() {
        navigate('/kid');
    }
    function handleViewProduct(productId) {
        navigate(`/productview/${productId}`);
    }
  
    return (
        <div className='aa'>
            <Navbar />
            <Slider />
            <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: "50px", alignItems: "center", justifyContent: "center", margin: '50px' }}>
                <img src="https://assets.tatacliq.com/medias/sys_master/images/51034757726238.jpg" style={{ borderRadius: '40px' }} onClick={handilemen} width={500} alt="Men's Fashion" />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMcUzsdGbakMKOhTfrmFtlN1IwjFG0HCEdUxzbK9Rb4g6Cqi_X616rFiLEO8VGbb8iWe0&usqp=CAU" style={{ borderRadius: '40px', margin: '40px' }} onClick={handilekid} width={290} alt="Kids' Fashion" />
                <img src="https://assets.tatacliq.com/medias/sys_master/images/51034757660702.jpg" style={{ borderRadius: '40px' }} onClick={handilewomen} width={500} alt="Women's Fashion" />
            </div>

            <h1 className='h1'>New arrivals</h1>
            <div className='cc'>
                <input type='text' className='search' style={{ padding: "7px 50px", borderRadius: "10px", width: "100px" }} onChange={handilesearch} placeholder='search here' />
            </div>
            <div className=''>
                {filterdproducts.map(item => (
                    <div className='products' key={item._id}>
                        <img src={item.imageUrl} alt={item.name} width={200} height={300} onClick={() => handleViewProduct(item._id)} />
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Home;
