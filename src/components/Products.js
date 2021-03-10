import Product from './Product'; 
import { useLocation } from "react-router-dom"; 

const Products = () => {
   
    const location = useLocation(); 
    // console.log(location)
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
       </>
    )
}

export default Products; 

