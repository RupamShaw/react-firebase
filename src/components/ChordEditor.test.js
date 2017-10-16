import React from 'react';
import ReactDOM from 'react-dom';
import ChordEditor from './ChordEditor';
import { shallow } from 'enzyme';
// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<ChordEditor />', () => {
  it('renders an editor area', () => {
    const editor = shallow(<ChordEditor song={{chordpro: ""}} />);
    expect(editor.find('textarea').length).toEqual(1);
  });

  it('renders an output area', () => {
    const editor = shallow(<ChordEditor song={{chordpro: ""}}/>);
    expect(editor.find('div.chord-output').length).toEqual(1);
  });

  it('renders the chord chart output', () => {
    const editor = shallow(<ChordEditor song={{chordpro: "Type some lyrics here by using chord in there is"}} />);
    const expectedOutput =
      '<table>' +
      '<tr>' +
      '<td class="chord"></td>' +
      '</tr>' +
      '<tr>' +
      '<td class="lyrics">Type some lyrics here by using chord in there is&nbsp;</td>' +
      '</tr>' +
      '</table>';

    const realOutput = editor.find('div.chord-output').html();
    expect(realOutput.indexOf(expectedOutput) > -1).toEqual(true);
  });
 
  
  it('renders the chord chart output', () => {
    const editor = shallow(<ChordEditor song={{chordpro: "[B]New [Am]Lyrics"}} />);
    const expectedOutput =
      '<table>' +
      '<tr>' +
      '<td class="chord">B</td>' +
      '<td class="chord">Am</td>' +
      '</tr>' +
      '<tr>' +
      '<td class="lyrics">New&nbsp;</td>' +
      '<td class="lyrics">Lyrics&nbsp;</td>' +
      '</tr>' +
      '</table>';

    const realOutput = editor.find('div.chord-output').html();
    expect(realOutput.indexOf(expectedOutput) > -1).toEqual(true);
  });

  it('calls updateSong when the textarea changes', () => {
    var theSong;
    const update = (song) => {
      theSong = song;
    };

    const editor = shallow(<ChordEditor song={{chordpro: "[B]New [Am]Lyrics"}} updateSong={update} />);

    editor.find('textarea').simulate("change", { target: { value: "[B]New [Am]Lyrics "}});

    expect(theSong).toEqual({ chordpro: "[B]New [Am]Lyrics "});
  });

});


