import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Main from './Main';
import Search from './elements/Search';
import ListenAudio from './Audio';
import TypeA from './TypeA';
import HelperType from './HelperType';
import LeftMenu from './elements/leftMenu';
import LeftCentralMenu from './elements/LeftCentralMenu';
import HeaderCentral from './elements/HeaderCentral';
import Footer from './elements/Footer';
export const ContextToken = React.createContext<string>("");
export const ListenTrack = React.createContext<TypeA>({} as TypeA);


function App() {
  let client_id = "2cb946c3ccba426895f0eb2bd0a64a00";
  let client_secret = "63c62e7e6cbd45e5ad2040e3d0cb18f8";

  const [token, setToken] = useState('');
  const [recommend, setRecommend] = useState([]);
  const [alb, setAlb] = useState([]);
  const [linkTR, setLinkTR] = useState<HelperType>({} as HelperType);
 
  const dat = useMemo(() => ({ linkTR, setLinkTR }), [linkTR]);


  useEffect(() => {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
      },
      body: 'grant_type=client_credentials'
    }).then((result) => {
      if (!result.ok) {
        //Возвращение Promise с указанием ошибки 
        return Promise.reject(result.status);
      }
      else {
        //Возвращение положительного результата с преобразованием в JSON формат
        return result.json()
      }
    }).then((data) => {
      console.log(data.access_token);
      setToken(data.access_token);
      fetch('https://api.spotify.com/v1/browse/categories', {
        headers: {
          'Authorization': 'Bearer ' + data.access_token,
          'Content-Type': 'application/json'
        }
      }).then((result) => {
        if (!result.ok) {
          console.log(result)
          //Возвращение Promise с указанием ошибки 
          return Promise.reject(result.status);
        }
        else {
          //Возвращение положительного результата с преобразованием в JSON формат
          return result.json()
        }
      }).then((data) => {
        setRecommend(data.categories.items);
        //Обработка исключений
      }).catch(function (error) {
        console.log("Ошибка " + error);
      });
      //Обработка исключений
    }).catch(function (error) {
      console.log("Ошибка " + error);
    });
  }, [client_id, client_secret])


  return (
    <div className="App">
      <Router>
        <ListenTrack.Provider value={dat}>
          <ContextToken.Provider value={token}>
            <header className="header">

              {/* Левое меню */}
              <nav className="nav__for__left__menu">
                <LeftMenu></LeftMenu>

                {/* Левое центральное меню */}
                <LeftCentralMenu></LeftCentralMenu>
              </nav>
            </header>

            <main className="main">
              {/* Шапка (регистрация и вход) */}
              <HeaderCentral></HeaderCentral>

              <Routes>
                <Route path='/' element={<Main />}></Route>
                
              </Routes>
              <ListenAudio></ListenAudio>
            </main>

            <Footer></Footer>
            
          </ContextToken.Provider>
        </ListenTrack.Provider>
      </Router>
    </div>
  );
}

export default App;
