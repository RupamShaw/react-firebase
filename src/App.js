import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import ChordEditor from './components/ChordEditor';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import {  app, base } from './base';
import  SongList  from './components/SongList';
import { Spinner } from '@blueprintjs/core';
import Logout from './components/Logout';

  // AuthenticatedRoute added above App component
function AuthenticatedRoute({component: Component, authenticated, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => authenticated === true
            ? <Component {...props} {...rest} />
            : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>} />
      )
}

class App extends Component {

  constructor() {
    super();
    this.updateSong = this.updateSong.bind(this);
    this.addSong = this.addSong.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
    
    this.state = { 
      songs: { },
      currentUser: null,
      authenticated: false,
      loading: true //being authentication and to use spinner
     };
  }

  setCurrentUser(user) {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true
      })
    } else {
      this.setState({
        currentUser: null,
        authenticated: false
      })
    }
  }

  componentWillMount() {
    
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true, //for setting header
          currentUser: user,
          loading: false,
       })
        this.songsRef = base.syncState('songs', {
          context: this,
          state: 'songs'
        });
      } else {
       
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false,
        })
      }
    })
  }
   
  addSong(title){
    const songs = {...this.state.songs};
    const id = Date.now();
    songs[id] = {
      id:id ,
      title:title ,
      chordpro:""
    };
    this.setState({songs});
  }

  componentWillUnmount() {
    this.removeAuthListener();
    base.removeBinding(this.songsRef);
  }

  updateSong(song) {
     const songs = {...this.state.songs};
     songs[song.id] = song;
   
     this.setState({songs});
  }

  

  render() {
    if (this.state.loading === true) {
      return (
        <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%" }}>
          <h3>Loading</h3>
          <Spinner />
        </div>
      )
    }
    return (
      <div style={{maxWidth: "1160px", margin: "0 auto" }}>
        
        <BrowserRouter>
          <div>
            <Header addSong={this.addSong} authenticated={this.state.authenticated} />
            <div className="main-content"  style={{padding: "1em"}} >
              <div className="workspace">
                <Route exact path="/login" render={(props) => {
                  return <Login setCurrentUser={this.setCurrentUser} {...props} />
                }} />
                <Route exact path="/logout" component={Logout} />
                <AuthenticatedRoute
                  exact
                  path="/songs"
                  authenticated={this.state.authenticated}
                  component={SongList}
                  songs={this.state.songs} 
                />
                <Route path="/songs/:songId" render={(props) =>{
                    const song =this.state.songs[props.match.params.songId];
                      return( 
                        song
                        ? <ChordEditor song={ song } updateSong={ this.updateSong }/>
                        : <h1>Song not found </h1>
                      ) 
                   }} 
                />
              </div>
            </div>
          </div>
        </BrowserRouter>
        <Footer />
      </div>
    );
  }
}

export default App;
