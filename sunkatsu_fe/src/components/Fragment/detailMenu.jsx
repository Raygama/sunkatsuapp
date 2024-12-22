import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import EditMenu from "./popupEditMenu";
import { deleteMenu } from "../../services/crudMenu";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const DetailMenu = ({ show, onClose, menuId }) => {
  const { getUser } = useContext(GlobalContext);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isCart, setIsCart] = useState(null); // State untuk menyimpan status cart
  const [menuImageURL, setMenuImageURL] = useState(null); // State untuk menyimpan URL gambar

  const [input, setInput] = useState({
    menuId: menuId.id,
    quantity: 1,
    deliver: "in store",
    note: "",
  });

  const decode = jwtDecode(Cookies.get("token"));

  // Fungsi untuk membuat cart kosong jika tidak ada
  const getEmptyCart = async () => {
    const id = decode.id;
    if (!id) {
      console.error("User ID is missing!");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8080/api/carts/empty", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        params: {
          UserId: id,
        },
      });
      console.log("Empty cart created successfully:", res.data);
      setIsCart(res.data);
    } catch (err) {
      console.error("Error creating empty cart:", err);
    }
  };

  // useEffect untuk memeriksa cart dan mengambil data jika ada
  useEffect(() => {
    const fetchCartData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token is missing!");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/api/customers/${decode.id}/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data && res.data.id) {
          console.log("Cart exists:", res.data);
          setIsCart(res.data);
        } else {
          console.log("Cart not found, creating an empty cart.");
          await getEmptyCart();
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
        await getEmptyCart();
      }
    };

    if (menuId && menuId.id) {
      fetchCartData();
    }
  }, [menuId]);

  // Fetch image for the menu item
  const fetchImage = async () => {
    const baseURL = "http://localhost:8080";
    try {
      const response = await axios.get(
        `${baseURL}/api/menus/images/${menuId.image}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          responseType: "blob", // To fetch the image as a Blob
        }
      );
      const imageURL = URL.createObjectURL(response.data);
      setMenuImageURL(imageURL); // Store the image URL in the state
    } catch (error) {
      console.error("Error fetching image for menu:", error);
    }
  };

  // Fetch image when menuId changes
  useEffect(() => {
    if (menuId && menuId.image) {
      fetchImage();
    }
  }, [menuId]);

  const handleEditClick = () => {
    setShowEditPopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const deleteHandler = (id) => {
    deleteMenu(id, () => {
      alert("Menu deleted successfully!");
      window.location.reload();
    });
  };

  const user = getUser();
  const baseURL = "http://localhost:8080";

  const handleInput = (event) => {
    const { name, value } = event.target;

    setInput((prevState) => ({
      ...prevState,
      [name]: value, // Update state based on field name
    }));
  };

  const addMenuToCart = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/carts/${isCart.id}/add-menu`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          params: {
            menuId: menuId.id,
            quantity: input.quantity,
            deliver: input.deliver,
            note: input.note,
          },
        }
      );
      console.log("Menu added to cart successfully:", response.data);
      alert("Menu added to cart successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding menu to cart:", error);
      alert("Error adding menu to cart. Please try again.");
    }
  };

  if (!show) return null;
  return (
    <div className="flex justify-center items-center h-screen fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="relative flex border-secondary border-8 gap-5 w-7/12 rounded-2xl p-6 bg-white shadow-md">
        {/* Tombol Close di Pojok Kanan Atas */}
        <button
          className="absolute top-2 right-2 text-black rounded-full w-8 h-8 flex justify-center items-center"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Left Section */}
        <div className="w-1/2 flex flex-col items-center">
          <h1 className="font-bold text-2xl mb-6 text-black">{menuId.name}</h1>
          {menuImageURL && (
            <img
              src={menuImageURL} // Use the fetched image URL here
              alt={menuId.name}
              className="w-48 h-48 rounded-full"
            />
          )}
        </div>

        <div className="w-1/2 flex flex-col justify-evenly">
          <p className="text-sm text-gray-700 leading-relaxed">{menuId.desc}</p>
          <div>
            <h2 className="text-secondary mb-6 font-bold text-2xl">
              {menuId.price}
            </h2>
          </div>
          <input
            type="text"
            placeholder="Note..."
            name="note"
            value={input.note}
            onChange={handleInput}
            className="border-2 border-gray-300 rounded-md p-2"
          />
          {user.role === "OWNER" ? (
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-black h-10 w-40 mt-6 text-white font-bold py-2 px-6 rounded-md hover:opacity-90"
                onClick={() => deleteHandler(menuId.id)}
              >
                Delete Menu
              </button>
              <button
                className="bg-secondary hover:bg-red-700 transition w-40 mt-6 h-10 text-white font-bold text-sm rounded-md self-end"
                onClick={handleEditClick}
              >
                Edit Menu
              </button>
              {/* Popup Edit Menu */}
              <EditMenu
                show={showEditPopup}
                onClose={closeEditPopup}
                menuId={menuId}
              />
            </div>
          ) : (
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={addMenuToCart}
                className="bg-secondary hover:bg-red-700 transition w-40 mt-6 h-10 text-white font-bold text-sm rounded-md self-end"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailMenu;
