import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ChordEditor from './components/ChordEditor';
import { BrowserRouter,Route } from 'react-router-dom';
import {  base } from './base';
import  SongList  from './components/SongList';

class App extends Component {

  constructor() {
    super();
    this.updateSong = this.updateSong.bind(this);
    this.addSong = this.addSong.bind(this);
    
    this.state = { 
      songs: { }
     };
  }

  componentWillMount() {
    // this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.setState({
    //       authenticated: true,
    //       currentUser: user,
    //       loading: false,
    //     })

        this.songsRef = base.syncState('songs', {
          context: this,
          state: 'songs'
        });
      // } else {
      //   this.setState({
      //     authenticated: false,
      //     currentUser: null,
      //     loading: false,
      //   })

       // base.removeBinding(this.songsRef);
    //   }
    // })
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
    //this.removeAuthListener();
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
            <Header />
            <div className="main-content"  style={{padding: "1em"}} >
              <div className="workspace">
    
                <Route exact path="/songs" render={(props) => {
                    return (
                      <SongList songs={this.state.songs} />
                    ) 
                }}  /> 
      
                <Route path="/songs/:songId" render={(props) =>{
                    const song =this.state.songs[props.match.params.songId];
                    return( 
                      song
                      ? <ChordEditor song={ song } updateSong={ this.updateSong }/>
                      : <h1>Song not found </h1>
                    ) 
                }} />
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
