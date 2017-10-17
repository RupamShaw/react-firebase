import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import ChordEditor from './components/ChordEditor';
import { BrowserRouter,Route } from 'react-router-dom';
import {  app, base } from './base';
import  SongList  from './components/SongList';

class App extends Component {

  constructor() {
    super();
    this.updateSong = this.updateSong.bind(this);
    this.addSong = this.addSong.bind(this);
    
    this.state = { 
      songs: { },
      authenticated: false,
     };
  }

  componentWillMount() {
    console.log('in cwm')
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('tr in cwm')
        this.setState({
          authenticated: true,
          })
        this.songsRef = base.syncState('songs', {
          context: this,
          state: 'songs'
        });
      } else {
        console.log('fal in cwm')
        this.setState({
          authenticated: false,
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
    return (
      <div style={{maxWidth: "1160px", margin: "0 auto" }}>
        
        <BrowserRouter>
          <div>
            <Header authenticated={this.state.authenticated}/>
            <div className="main-content"  style={{padding: "1em"}} >
              <div className="workspace">
                <Route exact path="/login" component={Login} />
                <Route exact path="/songs" render={(props) => {
                      return (
                        <SongList songs={this.state.songs} />
                      ) 
                  }}  
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
