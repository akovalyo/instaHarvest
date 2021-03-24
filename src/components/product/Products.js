import Product from './Product'; 
import { useLocation } from "react-router-dom"; 
import Map from "../Map"

const Products = () => {
   
    const location = useLocation(); 
    const products = location.state.products; 

    return (
        <>
        { location.state.user_id ? (products.map((product) => {
            return (
                <div key={product.product_id}>
                    <Product product = {product} user_id={location.state.user_id}/>
                </div>
            )
        })) : (products.map((product) => {
            return (
                <div key={product.product_id}>
                    <Product product = {product}/>
                </div>
            )
        }))
    }
    <div>
        <Map />
    </div>
       </>
    )
}

export default Products; 

