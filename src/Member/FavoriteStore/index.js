import './favorite.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function FavoriteStore() {
  const [user, setUser] = useState([]);
  const [user2, setUser2] = useState([]);
  const [myIndex, setMyIndex] = useState(0);
  const [index, setIndex] = useState();
  const [inputText, setInputText] = useState('')

  const getform = async () => {
    const sid = localStorage.getItem('MemberSid');
    try {
      const response = await axios.get(
        `http://localhost:3002/MemberLogin/api3/${sid}`
      );

      console.log(localStorage.getItem('MemberSid'));
      console.log(response.data);
      console.log(response.data[0].name);
      // setUser(response.data[0]);
      // const image = response.data[0].image;
      // console.log(image);
      setUser(response.data);
    } catch (e) {
      console.error(e.message);
    }
  };

  const get = async () => {
    const sid = localStorage.getItem('MemberSid');
    try {
      const response = await axios.get(
        `http://localhost:3002/MemberLogin/api2/${sid}`
      );

      console.log(localStorage.getItem('MemberSid'));
      console.log(response.data[0]);
      // setUser2(response.data[0]);
      // const image = response.data[0].image;
      // console.log(image);
    } catch (e) {
      console.error(e.message);
    }
  };

  const get2 = async () => {
    const sid = localStorage.getItem('MemberSid');
    try {
      const response = await axios.get(
        `http://localhost:3002/MemberLogin/api4`
      );

      // console.log(localStorage.getItem('MemberSid'));
      console.log(response.data);
      setUser2(response.data);
      // const image = response.data[0].image;
      // console.log(image);
    } catch (e) {
      console.error(e.message);
    }
  };
  const add = async () => {
    const sid = localStorage.getItem('MemberSid');
    // const fd = new FormData('#shop_sid.value');
    // console.log(fd);
    try {
      const response = await axios.post(
        `http://localhost:3002/MemberLogin/addshop/${sid}`
      );
      console.log(response.data);
    } catch (e) {
      console.error(e.message);
    }
  }

  const del = async () => {
    // const fd = new FormData('#shop_sid.value');
    try {
      const response = await axios.delete(
        `http://localhost:3002/MemberLogin/del`
      );
      console.log(response.data);
    } catch (e) {
      console.error(e.message);
    }
  }

  const myClick = () => {
    const nextStatusIndex = myIndex === 0 ? 1 : 0;
    const nextIndex = myIndex === 0 ? (add()) : (del());
    setMyIndex(nextStatusIndex);
    setIndex(nextIndex);
  };

  useEffect(() => {
    // getform();
    get2();
  }, []);
  const display = user.map((v, i) => {
    return (
      <div className="col" key={v.sid}>
        <img
          src={
            'http://localhost:3002/uploads/2f97f848-7708-4635-8a7c-d67a7c618d7f.jpg'
          }
        />
        <p className="font1">店名:{v.name}</p>
        <p className="font2">地址:{v.address}</p>
        <p className="font3">電話:{v.phone}</p>
        <button
          onClick={() => {
            const nextStatusIndex = myIndex === 0 ? 1 : 0;
            const nextIndex = myIndex === 0 ? getform() : get();
            setMyIndex(nextStatusIndex);
            setIndex(nextIndex);
          }}
          className="icon"
        >
          {myIndex === 0 ? <AiOutlineHeart /> : <AiFillHeart />}
        </button>
      </div>
    );
  });

  const display2 = user2.map((v, i) => {
    return (
      <form className="col" key={v.sid}>
        <div>
          <img
            src={
              'http://localhost:3002/uploads/2f97f848-7708-4635-8a7c-d67a7c618d7f.jpg'
            }
          />
          <p className="font1">店名:{v.name}</p>
          <p className="font2">地址:{v.address}</p>
          <p className="font3">電話:{v.phone}</p>
          <button
            onClick={() => {
              const nextStatusIndex = myIndex === 0 ? 1 : 0;
              const nextIndex = myIndex === 0 ? (add()) :(del());
              setMyIndex(nextStatusIndex);
              setIndex(nextIndex);
            }}
            className="icon"
          >
            {myIndex === 0 ? <AiOutlineHeart /> : <AiFillHeart />}
          </button>
        </div>
        <input name="shop_sid" value={v.sid} id="shop_sid" type="hidden" />
      </form>
    );
  });
  return (
    <>
      <button  onClick={() => {
              const nextStatusIndex = myIndex === 0 ? 1 : 0;
              const nextIndex = myIndex === 0 ? (add()) :(del());
              setMyIndex(nextStatusIndex);
              setIndex(nextIndex);
            }}>
        {myIndex === 0 ? <AiOutlineHeart /> : <AiFillHeart />}
      </button>
      <div className="con">{display2}</div>
    </>
  );
}
