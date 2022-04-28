import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GET_USER_URL } from "../constants";
import CreateWishlist from "./CreateWishlist";
import EditWishlist from "./EditWishlist";
import { useAuthToken } from "../AuthTokenContext";
import { ImPencil } from "react-icons/im";

export default function WishLists() {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState([]);
  const [createMode, setCreateMode] = useState(false);
  const [editMode, setEditMode] = useState([]);
  const [count, setCount] = useState(0);
  const { accessToken } = useAuthToken();

  const changeToFalse = (i) => {
    const temp = editMode.slice();
    temp[i] = false;
    setEditMode(temp);
  };

  const changeToTrue = (i) => {
    const temp = editMode.slice();
    temp[i] = true;
    setEditMode(temp);
  };

  const changeCreate = () => {
    setCreateMode(false);
  };

  const countNum = () => {
    console.log("CountNum");
    setCount(count + 1);
  };

  useEffect(() => {
    async function getWishlists() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      const user_wishlist = data.wishlist;
      if (user_wishlist) {
        setWishlists(user_wishlist);
      }
    }
    if (accessToken) {
      getWishlists();
    }
  }, [count, accessToken]);

  useEffect(() => {
    const length = wishlists.length;
    const temp = [];
    for (let i = 0; i < length; i += 1) {
      temp.push(false);
    }
    setEditMode(temp);
  }, [wishlists]);

  const selectWishlist = (wishlistId) => {
    navigate(`/wishlist/${wishlistId}`);
  };

  const deleteWishlist = (wishlistId) => {
    fetch(`${GET_USER_URL}/wishlist/${wishlistId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Successfully deleted " + data.title);
        console.log("Success:", data);
        countNum();
      })
      .catch((error) => {
        alert("Operation failed!");
        console.error("Error:", error);
        countNum();
      });
  };

  return (
    <div>
      <div>My Favorite Recipe Box</div>
      <div>
        {createMode ? (
          <div>
            <CreateWishlist
              changeCreate={changeCreate}
              accessToken={accessToken}
              countNum={countNum}
            />
          </div>
        ) : (
          <div>
            <button onClick={() => setCreateMode(true)}>New Recipe List</button>
          </div>
        )}
      </div>
      <div>
        <ul className="wishlist-list">
          {wishlists.map((wishlist, i) => (
            <li className="wishlist-row-li" key={wishlist.id}>
              <div className="wishlist-row">
              <img
                  src={wishlist.imageURL}
                  style={{ width: "300px", height: "250px" }}
                  alt={wishlist.title}
                />

                <div>
                  {editMode[i] ? (
                    <div>
                      <EditWishlist
                        wishlistId={wishlist.id}
                        changeToFalse={() => changeToFalse(i)}
                        countNum={countNum}
                      />
                    </div>
                  ) : (
                    <div>
                      <div>{wishlist.title}</div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => changeToTrue(i)}
                      >
                        <ImPencil />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    className="check"
                    onClick={() => selectWishlist(wishlist.id)}
                  >
                    Check
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteWishlist(wishlist.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
