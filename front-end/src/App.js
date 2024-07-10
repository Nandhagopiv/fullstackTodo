import { Fragment, useEffect, useState } from "react";
import axios from 'axios'

function App() {

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const [product, setProduct] = useState('')
  const [shoppingList, setShoppingList] = useState([])
  const [stsDel, setStsDel] = useState(false)
  const [updateID, setUpdateID] = useState()
  const [modify, setModify] = useState(false)
  const [stsLoad,setStsLoad] = useState(false)
  const [stsEdit,setStsEdit] = useState(false)

  const handleChange = (e) => {
    setProduct(e.target.value)
  }

  useEffect(() => {
    setStsLoad(true)
    axios.get(`https://fullstacktodo-20uz.onrender.com/list`).then((data) => {
      setShoppingList(data.data)
      setStsLoad(false)
    })
  }, [])

  const handleClick = async () => {
    if (product === '') {
      alert("Enter something to add to your shopping list")
    } else {
      if (modify === true) {
        setStsEdit(true)
        await axios.get(`https://fullstacktodo-20uz.onrender.com/update?product=${updateID}&item=${product}`).then((data)=>{
          setShoppingList(data.data)
          setStsEdit(false)
        })
        setModify(false)
      } else {
        setShoppingList([...shoppingList, { item: product, forDel: shoppingList.length + 1 }])
        await axios.get(`https://fullstacktodo-20uz.onrender.com/addlist?item=${product}&forDel=${shoppingList.length + 1}`)
      }
      setProduct('')
    }
  }

  const handleDelete = (item) => {
    setStsDel(true)
    axios.get(`https://fullstacktodo-20uz.onrender.com/delete?item=${item}`).then((data) => {
      setShoppingList(data.data)
      setStsDel(false)
    })
  }

  const handleEdit = (item) => {
    setModify(true)
    setUpdateID(item)
    setProduct(item)
  }

  return (
    <Fragment>
      <section className="flex flex-col items-center">
        <form className="w-[80%] sm:w-[50%] flex justify-center gap-2 mt-5" onSubmit={handleSubmit}>
          <input type="text" className="bg-slate-200 p-2 outline-none rounded-lg" onChange={handleChange} value={product} id="productInput" placeholder="Enter any Product..."></input>
          <button className="bg-black px-5 py-2 text-white font-bold rounded-lg" onClick={handleClick} type="submit">{modify?'Modify':'Add'}</button>
        </form>
        <section className="w-[80%] sm:w-[50%] flex flex-col mt-5 gap-2">
          {
            shoppingList.map((data, index) => {
              return <div className="flex justify-between gap-10 items-center"><h1 className="text-xl font-semibold break-all">{index + 1}. {data.item}</h1><div className="flex gap-2"><button onClick={() => handleEdit(data.item)} className="text-sm font-bold bg-black rounded-lg text-white p-2">Edit</button><button onClick={() => handleDelete(data.item)} className="text-sm font-bold bg-black rounded-lg text-white p-2">Delete</button></div></div>
            })
          }
        </section>
        <section style={{ backgroundColor: 'rgba(0, 0, 0, 0.666)', display: stsDel ? 'flex' : 'none' }} className="h-[100%] flex justify-center items-center fixed w-[100%]"><h1 className="text-5xl text-white font-bold">Deleting...</h1></section>
        <section style={{ backgroundColor: 'rgba(0, 0, 0, 0.666)', display: stsLoad ? 'flex' : 'none' }} className="h-[100%] flex justify-center items-center fixed w-[100%]"><h1 className="text-5xl text-white font-bold">Loading...</h1></section>
        <section style={{ backgroundColor: 'rgba(0, 0, 0, 0.666)', display: stsEdit ? 'flex' : 'none' }} className="h-[100%] flex justify-center items-center fixed w-[100%]"><h1 className="text-5xl text-white font-bold">Updating...</h1></section>
      </section>
      
    </Fragment>
  );
}

export default App;
