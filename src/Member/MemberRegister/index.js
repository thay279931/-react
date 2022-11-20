import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Img.css';
function MemberRegister() {
  // 選擇的檔案
  const [selectedFile, setSelectedFile] = useState(null);
  // 是否有檔案被挑選
  const [isFilePicked, setIsFilePicked] = useState(false);
  // 預覽圖片
  const [preview, setPreview] = useState('');
  // server上的圖片網址
  const [imgServerUrl, setImgServerUrl] = useState('');

  const forms = useRef(null);

  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    console.log(objectUrl);
    setPreview(objectUrl);

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const changeHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsFilePicked(true);
      setSelectedFile(file);
      setImgServerUrl('');
    } else {
      setIsFilePicked(false);
      setSelectedFile(null);
      setImgServerUrl('');
    }
  };

  const handleSubmission = () => {
    const formData = new FormData();

    // 對照server上的檔案名稱 req.files.avatar
    formData.append('avatar', selectedFile);

    fetch(
      'http://localhost:3001/upload-avatar', //server url
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
        setImgServerUrl('http://localhost:3001/uploads/' + result.data.name);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  const [user, setUser] = useState({
    email: '',
    password: '',
    doublepassword: '',
    name: '',
    phone: '',
  });
  // 記錄欄位有錯誤時的訊息
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    doublepassword: '',
    name: '',
    phone: '',
  });

  const navigate = useNavigate();

  // true = 呈現密碼 / false = 隱藏密碼
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const handleFieldChange = (e) => {
    //console.log(e.target.type, e.target.name, e.target.value)

    // computed property name
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names
    const newUser = { ...user, [e.target.name]: e.target.value };
    setUser(newUser);
  };

  const handleFormSubmit = async (e) => {
    // 阻擋預設form送出的行為
    e.preventDefault();

    if (user.password === user.doublepassword) {
      // const formData = new FormData();
      const fd = new FormData(e.target);
      console.log(fd);
      // return
      // 對照server上的檔案名稱 req.files.avatar
      //fd.append('avatar', selectedFile);
      console.log(fd);
      await axios
        .post('http://localhost:3002/MemberLogin/add', fd)
        .then((result) => {
          console.log(result);
          alert('註冊成功');
          navigate('/');
        })
        .catch((e) => {
          console.log(e);
          console.log(e.response);
          if (
            e.response.data.code === 'ER_DUP_ENTRY' &&
            e.response.data.message.indexOf('email') !== -1 &&
            e.response.data.message.indexOf('phone') !== -1
          ) {
            alert('註冊失敗！此帳號跟手機已存在，請嘗試新的帳號跟手機！');
          }
          if (
            e.response.data.code === 'ER_DUP_ENTRY' &&
            e.response.data.message.indexOf('phone') !== -1
          ) {
            alert('註冊失敗！此手機已存在，請嘗試新的手機！');
          } else if (
            e.response.data.code === 'ER_DUP_ENTRY' &&
            e.response.data.message.indexOf('email') !== -1
          ) {
            alert('註冊失敗！此帳號已存在，請嘗試新的帳號！');
          } else {
            // console.log(e.response.request.responseText);
            alert('註冊失敗!');
          }
        });
    } else {
      alert('兩次密碼輸入不一致!');
    }
  };
  // 得到輸入值的方式
  // 第1種，從state直接得到

  // 第2種，用FormData物件

  // 其它驗証…修改

  // 送到伺服器

  // 當表單有不合法的驗証出現時會觸發
  const handleFormInvalid = (e) => {
    // 阻擋預設行為 - 關閉泡泡訊息
    e.preventDefault();

    console.log(e.target.name, e.target.validationMessage);

    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: e.target.validationMessage,
    });
  };

  const handleFormChange = (e) => {
    //要把目前正在修改的欄位的錯誤訊息先清空
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: '',
    });
  };

  return (
    <>
      <form
        name="avatar"
        onSubmit={handleFormSubmit}
        onInvalid={handleFormInvalid}
        onChange={handleFormChange}
      >
        <input type="file" name="avatar" onChange={changeHandler} />
        {selectedFile && (
          <div>
            預覽圖片:
            <img className="img" src={preview} alt="" />
          </div>
        )}
        <br />
        <label>帳號(Email)</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleFieldChange}
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        />
        <span>{fieldErrors.email}</span>
        <br />
        <label>密碼</label>
        <input
          type={show ? 'text' : 'password'}
          name="password"
          value={user.password}
          onChange={handleFieldChange}
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
        />
        <span>{fieldErrors.password}</span>
        <input
          type="checkbox"
          name="show"
          checked={show}
          onChange={() => {
            setShow(!show);
          }}
        />
        <label>顯示密碼</label>
        <br />
        <label>再次輸入密碼</label>
        <input
          type={show1 ? 'text' : 'password'}
          name="doublepassword"
          value={user.doublepassword}
          onChange={handleFieldChange}
          required
          // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{9,}$"
        />
        <span>{fieldErrors.doublepassword}</span>
        <input
          type="checkbox"
          name="show1"
          checked={show1}
          onChange={() => {
            setShow1(!show1);
          }}
        />
        <label>顯示密碼</label>
        <br />
        <label>名子</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleFieldChange}
          required
        />
        <span>{fieldErrors.name}</span>
        <br />
        <label>手機</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleFieldChange}
          required
          pattern="09\d{2}\d{6}"
        />
        <span>{fieldErrors.phone}</span>
        <br />
        <button type="submit">送出</button>
        {/* 沒加 type 相當於 type="submit" */}
        <button
          type="button"
          onClick={() => {
            setUser({
              email: '',
              password: '',
              doublepassword: '',
              name: '',
              phone: '',
            });
          }}
        >
          清空
        </button>
      </form>
      <button
        onClick={() => {
          setUser({
            email: 'abc1234@gmail.com',
            password: 'Aa123456789',
            doublepassword: 'Aa123456789',
            name: '王大明',
            phone: '0912345678',
          });
        }}
      >
        快速填入
      </button>
    </>
  );
}
export default MemberRegister;
